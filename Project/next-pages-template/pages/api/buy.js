import pool from "./db";
import authorized from "./authorized"; 

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, authToken, price, product_id } = req.body;

  try {
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

    // user cannot buy own item
    const username_check_result = await pool.query(
      'SELECT u.username FROM products p NATURAL JOIN users u WHERE p.product_id = $1 AND p.user_id = u.user_id', [product_id]
    );
    const username_check = username_check_result.rows[0].username;
    if (username == username_check) {
      console.log("Dude, that's your own item...");
      return res.status(400).json({error: "You cannot buy your own item."})
    };

    // cant buy if alr sold
    const sold_result = await pool.query(
      'SELECT sold FROM products WHERE product_id = $1', [product_id]
    );
    const sold = sold_result.rows[0].sold;
    if (sold == true) {
      console.log("Yo this item sold already");
      return res.status(400).json({error: "This item is already sold."})
    };

    // Find seller
    const productRes = await pool.query(
      "SELECT user_id FROM products WHERE product_id = $1",
      [product_id]
    );

    if (productRes.rowCount === 0) {
      return res.status(500).json({ error: "Product does not exist" });
    }

    const seller = productRes.rows[0].user_id;

    //only one negotiation per sender until user rejects
    const status_result = await pool.query(
      'SELECT status FROM negotiations WHERE sender_id = $1 AND product_id = $2', [seller, product_id]
    );
    const status = status_result.rows[0].status;
    if (status == "pending") {
      return res.status(400).json({error: "User cannot send another negotiation because seller response is still pending."});
    } else if (status == "accepted") {
      return res.status(400).json({error: "User cannot send another negotiation because seller has already accepted one from this user."});
    } else if (status == "blocked") {
      return res.status(400).json({error: "User is blocked. No notification sent."})
    };

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
