import pool from "./db";
import authorized from "./authorized";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, authToken } = req.query;

  const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

  if (result.rowCount === 0) {
    return res.status(200).json({ message: "No profile to be found" });
  }

  const user = result.rows[0];
  const me = authorized(authToken, user.user_id); // am i the requested user?

  const productResult = await pool.query("SELECT * FROM purchases NATURAL JOIN products WHERE user_id = $1 ORDER BY purchase_date DESC", [user.user_id]);
  const purchases = productResult.rows;

  const saleResult = await pool.query("SELECT * FROM products WHERE user_id = $1", [user.user_id]);
  const forSale = saleResult.rows;

  res.status(200).json({ ...user, password: null, me, forSale, purchases });
}
