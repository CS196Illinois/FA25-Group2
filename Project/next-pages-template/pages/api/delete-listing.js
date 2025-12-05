import pool from "./db";
import authorized from "./authorized"; 

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: 'Method not allowed' }); 
    };

    try {
    const {authToken, username, product_id} = req.body;

    //authorize
    const user_id_result = await pool.query(
        'SELECT u.user_id FROM products WHERE product_id = $1', [product_id]
    );
    const user_id = user_id_result.rows[0].user_id;
    if (!(authorized(authToken, user_id))) {
            return res.status(401).json({error: 'Unauthorized.'})
        };

    //ensure owner & unsold
    const {username_check_result, sold_result} = await pool.query(
        'SELECT u.username, p.sold FROM users u NATURAL JOIN products p WHERE u.user_id = p.user_id AND product_id = $2', [product_id] 
    ); 
    const username_check = username_check_result.rows[0].username;
    if (username == username_check) {
        console.log('The user did not post this item, so they cant delete it');
        return res.status(400).json({error: 'This item was not posted by you.'});
    };
    const sold = sold_result.rows[0].sold;
    if (sold == true) {
        return res.status(400).json({error: "This item has already been sold"});
    };

    //delete
    await pool.query(
        'DELETE FROM products WHERE product_id = $1', [product_id]
    );

    return res.status(200).json("Successfully removed listing.");
    } catch(error) {
        return res.status(400).json({error});
    };
}