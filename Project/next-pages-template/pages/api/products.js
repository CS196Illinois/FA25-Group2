import pool from "./db";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: 'Method not allowed' }); 
    }

    const { minPrice, maxPrice, search } = req.query;

    let queryText = `
        SELECT p.product_id, p.name, p.description, p.price, p.image, u.username as seller, u.pfp 
        FROM products p 
        NATURAL JOIN users u 
        WHERE 1=1
    `;
    
    const queryParams = [];
    let paramIndex = 1;

    if (minPrice) {
        queryText += ` AND p.price >= $${paramIndex++}`;
        queryParams.push(minPrice);
    }
    if (maxPrice) {
        queryText += ` AND p.price <= $${paramIndex++}`;
        queryParams.push(maxPrice);
    }

    if (search) {
        queryText += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
        queryParams.push(`%${search}%`); 
        paramIndex++;
    }

    try {
        const productResult = (await pool.query(queryText, queryParams)).rows;
        res.status(200).json({ products: productResult });
    } catch (err) {
        console.error("FILTER ERROR:", err);
        res.status(500).json({ error: "Database error" });
    }
}