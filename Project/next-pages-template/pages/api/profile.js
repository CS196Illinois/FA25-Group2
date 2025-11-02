import pool from "./db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username } = req.query;

  const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

  if (result.rowCount === 0) {
    return res.status(404).json({ error: "User not found" });
  }

  const user = result.rows[0];

  // add actual for sale products here
  res.status(200).json({ ...user, forSale: [], purchased: []});
}
