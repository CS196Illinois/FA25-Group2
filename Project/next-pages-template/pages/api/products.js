import pool from "./db";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: 'Method not allowed' }); 
    }

    const productResult = (await pool.query("SELECT p.name, p.description, p.price, p.image, u.username as seller, u.pfp FROM products p NATURAL JOIN users u")).rows;
    
    res.status(200).json({products: productResult});
}