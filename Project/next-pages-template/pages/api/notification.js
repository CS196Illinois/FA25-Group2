import pool from "./db";
import authorized from "./authorized"; 

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { username, authToken } = req.query;

    
    if (!username || !authToken || !authorized(authToken, username)) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        
        const query = `
            SELECT 
                n.id as negotiation_id,
                n.price as offer_price,
                n.buyer,
                n.status,
                p.name as product_name,
                p.image as product_image,
                u.pfp as buyer_pfp
            FROM negotiations n
            JOIN products p ON n.product_id = p.product_id
            JOIN users u ON n.buyer = u.username
            WHERE n.seller = $1 AND n.status = 'pending'
            ORDER BY n.created_at DESC
        `;
        
        const result = await pool.query(query, [username]);
        
        res.status(200).json({ notifications: result.rows });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}