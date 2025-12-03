import pool from './db'; 
import authorized from './authorized';

export default async function editListing(req, res) {
    // check request type
    if (req.method !== "POST") {
        res.status(405).json({error: 'Method not allowed'});
    }

    // get info from req (assuming how it is given)
    const {token, product_id, user_id, new_name, new_description, new_price, new_image, new_tags, new_sold} = req.params;

    try {
    // check auth and sold status before implementing
        if (!(authorized(token, user_id))) {
            return res.status(401).json({error: 'Invalid token.'})
        }
        const sold_status = await pool.query(
            'SELECT sold FROM products WHERE product_id = $1', [product_id]
        );
        if (sold_status == true) {
            return res.status(401).json({error: 'This product has already been sold.'})

    // implement changes
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
    // success message
        return res.status(200).json({ success: true, message: 'Listing updated successfully.' });

    // catch errors
    } catch (err) {
        console.error(err)
        return res.status(500).json({error: 'Error editting listing.'})
    }
}
