import pool from "./db";
import authorized from "./authorized";

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" })
    }; 

    const {authToken, seller_username, negotiation_id, choice, userMessage} = req.body;

    // set seller_id and sender_id using usernames
    const sender_result = await pool.query(
        'SELECT u.username, u.user_id FROM negotiations n NATURAL JOIN users u WHERE n.negotiation_id = $1 AND n.buyer = u.user_id', [negotiation_id]
    );
    const sender_id = sender_result.rows[0].user_id;
    //const sender_username = sender_result.rows[0].username;

    const seller_result = await pool.query(
        'SELECT user_id FROM users WHERE username = $1', [seller_username]
    );
    const seller_id = seller_result.rows[0].user_id;

    


    // check seller authorization
    if (!(authorized(authToken, seller_id))) {
        return res.status(401).json({error: 'Unauthorized.'})
    };


    // set message based on negotiation status
    let message;
    if (choice == 'accepted') {
        message = seller_username + " has accepted your negotiation request!\n" + userMessage;
        await pool.query(
            `UPDATE products p SET sold = true FROM negotiations n WHERE n.product_id = p.product_id 
             AND n.negotiation_id = $1`, [negotiation_id]
        );
        console.log("Successfully saved the product as sold");
    } else if (choice == 'rejected') {
        message = seller_username + " has declined your negotiation offer.\n" + userMessage;
    } else if (choice == 'blocked') {
        message = seller_username + " has declined your negotiation offer.\n" + userMessage;
        await pool.query(
            'INSERT INTO blocklist VALUES (user_id = $1, blocked_id = $2)', [seller_id, sender_id]
        );
    } else {
        res.status(500).json({message: "Expected a choice of 'accepted', 'rejected', or 'blocked' but got: " + choice})
    }

    // change negotiation status to db, then add notification if choice is 'accepted' or 'rejected'
    try {

        const productResult = await pool.query(
            'SELECT product_id FROM negotiations WHERE negotiation_id = $1', [negotiation_id]
        );
        const product_id = productResult.rows[0].product_id;

        // set seller_id and sender_id using usernames
        const sender_result = await pool.query(
            'SELECT u.username, u.user_id FROM negotiations n NATURAL JOIN users u WHERE n.negotiation_id = $1 AND n.buyer = u.user_id', [negotiation_id]
        );
        const sender_id = sender_result.rows[0].user_id;
        //const sender_username = sender_result.rows[0].username;

        const seller_result = await pool.query(
            'SELECT user_id FROM users WHERE username = $1', [seller_username]
        );
        const seller_id = seller_result.rows[0].user_id;

        // check seller authorization
        if (!(authorized(authToken, seller_id))) {
            return res.status(401).json({error: 'Unauthorized.'})
        };

        // set message based on negotiation status
        let message;
        if (choice == 'accepted') {
            message = seller_username + " has accepted your negotiation request!\n" + userMessage;
            await pool.query(
                'UPDATE products p SET sold = true FROM negotiations n WHERE n.product_id = p.product_id AND n.negotiation_id = $1', [negotiation_id]
            );
            await pool.query(
                'INSERT INTO purchases VALUES (NOW(), $1, $2)', [sender_id, product_id]
            );
        } else if (choice == 'rejected') {
            message = seller_username + " has declined your negotiation offer.\n" + userMessage;
        } else if (choice == 'blocked') {
            message = seller_username + " has declined your negotiation offer.\n" + userMessage;
            await pool.query(
                'INSERT INTO blocklist VALUES (user_id = $1, blocked_id = $2)', [seller_id, sender_id]
            );
        } else {
            res.status(500).json({message: "Expected a choice of 'accepted', 'rejected', or 'blocked' but got: " + choice})
        }

        // change negotiation status to db, then add notification if choice is 'accepted' or 'rejected'
        await pool.query(
            'UPDATE negotiations SET status = $1 WHERE product_id = $2', [choice, product_id]
        );

        await pool.query(
            'INSERT INTO notifications (recipient, sender, product_id, message, read, created_at, link) VALUES ($1, $2, $3, $4, false, NOW(), NULL)', 
            [sender_id, seller_id, product_id, message]
        );
        
        res.status(200).json({message: 'Successfully sent a notification'})
    } catch (error) {
        console.log(error);
        res.status(500).json({error})
    }
}