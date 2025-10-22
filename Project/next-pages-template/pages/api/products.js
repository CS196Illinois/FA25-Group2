import pool from "./db";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: 'Method not allowed' }); 
    }

    productResult = pool.query("SELECT * FROM products");

    res.status(200).json({result: productResult.rows});
}