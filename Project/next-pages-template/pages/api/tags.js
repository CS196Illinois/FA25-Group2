import pool from "./db";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const result = await pool.query(
            `SELECT DISTINCT UNNEST(tags) AS tag FROM products`
        );

        const tags = result.rows.map(row => row.tag);

        res.status(200).json({ tags });
    } catch (err) {
        console.error("TAG API ERROR:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

