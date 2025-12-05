import pool from "./db";
import authorized from "./authorized";

export default async function handler(req, res) {

    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" })
    }; 

    const {authToken, username, negotiation_id} = req.query;

    const user_result = await pool.query(
        "SELECT user_id FROM users WHERE username = $1", [username]
    );
    const user_id = user_result.rows[0].user_id;

    // check auth and sold status before implementing
    if (!(authorized(authToken, user_id))) {
        return res.status(401).json({error: "Invalid token."})
    }

    try {
        const negotiationResult = await pool.query(
            "SELECT * FROM negotiations n NATURAL JOIN products p NATURAL JOIN users u WHERE n.negotiation_id = $1 AND n.product_id = p.product_id AND p.user_id = u.user_id", [negotiation_id]
        );

        const negotiation = negotiationResult.rows[0];
        if (negotiation.seller != user_id) {
            return res.status(401).json({error: "You cannot view this negotiation."});
        }

        res.status(200).json({message: "Succesfully grabbed negotiation", negotiation})
    } catch (error) {
        console.log(error);
        res.status(500).json({error})
    }
}