'use client';
import pool from "./db";
import authorized from "./authorized";

export default async function handler(req, res) {

    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" })
    }; 

    const {authToken, username} = req.query;

    const user_result = await pool.query(
        'SELECT user_id FROM users WHERE username = $1', [username]
    );
    const user_id = user_result.rows[0].user_id;

    // check auth and sold status before implementing
    if (!(authorized(authToken, user_id))) {
        return res.status(401).json({error: 'Invalid token.'})
    }

    try {
        const notifications_result = await pool.query(
            'SELECT * FROM notifications WHERE recipient = $1 ORDER BY created_at DESC', [user_id]
        );

        const first = notifications_result.rows[0];
        const read = first.read;
        console.log(read, first);

        await pool.query(
            "UPDATE notifications SET read = TRUE WHERE recipient = $1 AND read = FALSE", [user_id]
        )
        return res.status(200).json({message: 'Succesfully grabbed notifications', notifications: notifications_result.rows, read})
    } catch (error) {
        res.status(500).json({error})
    }
}