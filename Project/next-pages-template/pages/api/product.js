import pool from "./db";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: 'Method not allowed' }); 
    }

    const { productID } = req.query;

    let productResult = (await pool.query("SELECT p.name, p.description, p.price, p.image, p.tags, u.username as seller, u.pfp FROM products p NATURAL JOIN users u WHERE p.product_id = $1", [productID])).rows[0];
    
    res.status(200).json(productResult);
}