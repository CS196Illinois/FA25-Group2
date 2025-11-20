import pool from "./db";
import authorized from "./authorized";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { user_id, authToken, bio } = req.body;

  if (!authorized(authToken, user_id)) {
    return res.status(401).json({ error: "Unauthorized to change bio" });
  }

  try {
    await pool.query("UPDATE users SET bio = $1 WHERE user_id = $2", [bio, user_id]);
  } catch (_) {
    return res.status(500).json({ error: "Could not update bio" });
  }

  res.status(200).json({ message: "Changed bio" });
}
