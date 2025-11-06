import pool from "./db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const userResult = await pool.query(
      "SELECT user_id, username, email, bio, pfp FROM users WHERE username = $1",
      [username]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResult.rows[0];

    const forSaleResult = await pool.query(
      "SELECT * FROM products WHERE user_id = $1",
      [user.user_id]
    );

    const purchasedResult = await pool.query(
      "SELECT * FROM purchases WHERE buyer_id = $1",
      [user.user_id]
    );

    const profileData = {
      username: user.username,
      email: user.email,
      bio: user.bio,
      pfp: user.pfp,
      forSale: forSaleResult.rows,       // Items listed by this user
      purchased: purchasedResult.rows,   // Items the user bought
    };

    res.status(200).json(profileData);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Server error" });
  }
}
