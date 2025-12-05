import pool from "./db";
import authorized from "./authorized";

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const data = req.body?.params || req.body || {};

        const { authToken, sender, product_id, price, negotiation_id } = data;

        if (!authToken || !sender) {
            return res.status(401).json({ error: "Missing credentials" });
        }

        if (!product_id) {
            return res.status(400).json({ error: "Missing product_id" });
        }

        const senderRes = await pool.query(
            "SELECT user_id FROM users WHERE username = $1",
            [sender]
        );

        const sender_id = senderRes.rows[0].user_id;
   
        const authOK = authorized(authToken, sender_id);
        if (!authOK) {
            return res.status(403).json({ error: "Unauthorized" });
        }

       
        const productRes = await pool.query(
            "SELECT user_id, name FROM products WHERE product_id = $1",
            [product_id]
        );

        if (productRes.rowCount === 0) {
            return res.status(404).json({ error: "Product does not exist" });
        }

        const seller = productRes.rows[0].user_id;
        const productName = productRes.rows[0].name;


        const message = `${sender} wants to buy ${productName} for $${price}`;

        const blocked_result = await pool.query(
            'SELECT blocked_id FROM blocklist WHERE user_id = $1', [seller]
        ); 
        const blocked_list = blocked_result.rows;
        if (!blocked_list.includes(sender_id)) {
            await pool.query(
                `INSERT INTO notifications (recipient, sender, product_id, message, read, created_at, link)
                    VALUES ($1, $2, $3, $4, false, NOW(), $5)`,
                [seller, sender_id, product_id, message, `/negotiation/${negotiation_id}`]
            );
        }

        return res.status(200).json({
            success: true,
            message: "Notification sent",
        });

    } catch (err) {
        console.error("NOTIFICATION ERROR:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}