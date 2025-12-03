import pool from "./pool";
import authorized from "./authorized";

export default async function handler(req, res) {

  
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {

        const { username, authToken } = req.query;

       
        if (!username || !authToken) {
            return res.status(401).json({ error: "Missing credentials" });
        }


        const authOK = authorized(authToken, username);
        if (!authOK) {
            return res.status(403).json({ error: "Unauthorized" });
        }


        const result = await pool.query(
            `SELECT notification_id, sender, product_id, message, read, created_at
             FROM notifications
             WHERE recipient = $1
             ORDER BY created_at DESC`,
            [username]
        );

        return res.status(200).json({
            success: true,
            notifications: result.rows
        });

    } catch (err) {
        console.error("GET NOTIFICATIONS ERROR:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

