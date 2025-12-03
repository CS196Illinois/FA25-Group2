import pool from "./pool";
import authorized from "./authorized";

export default async function handler(req, res) {

    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const data = req.body?.params || req.body || {};

        const { authToken, sender, product_id, price } = data;

        if (!authToken || !sender) {
            return res.status(401).json({ error: "Missing credentials" });
        }

        if (!product_id) {
            return res.status(400).json({ error: "Missing product_id" });
        }

   
        const authOK = authorized(authToken, sender);
        if (!authOK) {
            return res.status(403).json({ error: "Unauthorized" });
        }

       
        const productRes = await pool.query(
            "SELECT seller, name FROM products WHERE product_id = $1",
            [product_id]
        );

        if (productRes.rowCount === 0) {
            return res.status(404).json({ error: "Product does not exist" });
        }

        const seller = productRes.rows[0].seller;
        const productName = productRes.rows[0].name;


        const message = `User wants to buy ${productName} for ${price}`;

       
        await pool.query(
            `INSERT INTO notifications (recipient, sender, product_id, message, read, created_at)
             VALUES ($1, $2, $3, $4, false, NOW())`,
            [seller, sender, product_id, message]
        );

        return res.status(200).json({
            success: true,
            message: "Notification sent"
        });

    } catch (err) {
        console.error("NOTIFICATION ERROR:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

