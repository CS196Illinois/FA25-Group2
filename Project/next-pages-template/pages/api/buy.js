import pool from "./db";
import authorized from "./authorized"; 

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = req.body?.params || req.body || {};
    const { username, authToken, price, product_id } = data;

  
    if (!username || !authToken) {
      return res.status(401).json({ error: "Missing credentials" });
    }

    const userRes = await pool.query(
      "SELECT user_id FROM users WHERE username = $1",
      [username]
    );

    const user_id = userRes.rows[0].user_id;
 
    const authOK = authorized(authToken, user_id); 
    if (!authOK) {
      return res.status(500).json({ error: "Unauthorized" });
    }

   
    if (!product_id) {
      return res.status(500).json({ error: "Missing product_id" });
    }
    if (price === undefined || isNaN(Number(price))) {
      return res.status(500).json({ error: "Invalid price" });
    }

    // Find seller
    const productRes = await pool.query(
      "SELECT user_id FROM products WHERE product_id = $1",
      [product_id]
    );

    if (productRes.rowCount === 0) {
      return res.status(500).json({ error: "Product does not exist" });
    }

    const seller = productRes.rows[0].user_id;

    // Insert negotiation
    const negotiationResult = await pool.query(
      `INSERT INTO negotiations (product_id, buyer, seller, price, status, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING negotiation_id`,
      [product_id, user_id, seller, Number(price), "pending"]
    );
    const negotiation_id = negotiationResult.rows[0].negotiation_id;

    return res.status(200).json({
      success: true,
      message: "Negotiation submitted",
      negotiation_id
    });

  } catch (err) {
    console.error("NEGOTIATE ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
