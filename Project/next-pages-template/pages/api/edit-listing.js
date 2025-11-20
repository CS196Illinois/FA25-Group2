import pool from './db'; 
import authorized from './authorized';

export default async function editListing(req, res) {
    // Check request type
    if (req.method !== "POST") {
        res.status(405).json({error: 'Method not allowed'});
    }

    // Gather information from req (assuming how it is given)
    const {product_id, user_id, new_name, new_description, new_price, new_image, new_tags, new_sold} = req.body;
    const {token} = req.cookies;

    try {
    // Check authorization and sold status before implementing
        if (!(authorized(token, user_id))) {
            return res.status(401).json({error: 'Invalid token.'})
        }
        if (new_sold == true) {
            return res.status(401).json({error: 'This product has already been sold.'})
        }

    // Implement changes
        if (new_name) {
            await pool.query(
                'UPDATE products SET name = $1 WHERE product_id = $2', [new_name, product_id]
            );
        }
        if (new_description) {
            await pool.query(
                'UPDATE products SET description = $1 WHERE product_id = $2', [new_description, product_id]        
            );
        }
        if (new_price) {
            await pool.query(
                'UPDATE products SET price = $1 WHERE product_id = $2', [new_price, product_id]
            );
        }
        if (new_image) {
            await pool.query(
                'UPDATE products SET image = $1 WHERE product_id = $2', [new_image, product_id]        
            );
        }
        if (new_tags) {
            await pool.query(
                'UPDATE product_tags SET tag = $1 WHERE product_id = $2', [new_tags, product_id]
            );
        }
        if (new_sold) {
            await pool.query(
                'UPDATE products SET sold = $1 WHERE product_id = $2', [new_sold, product_id]        
            );
        }
    //Return success message
        return res.status(200).json({ success: true, message: 'Listing updated successfully.' });

    // Catch any unexpected errors
    } catch (err) {
        console.error(err)
        return res.status(500).json({error: 'Error editting listing.'})
    }
}
