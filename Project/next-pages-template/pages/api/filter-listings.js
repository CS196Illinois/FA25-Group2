import pool from './db'; 

export default async function filterListings(req, res) {
    // check request type
    if (req.method !== "GET") {
        res.status(405).json({error: 'Method not allowed'});
    }

    // get info from req (assuming how it is given)
    const {textbooks, electronics, clothing, vehicles, fitness, minPrice, maxPrice} = req.params;

    try {
        // query assuming what the database names will be 
        await pool.query(
        'SELECT product_id FROM products WHERE f_textbooks = $1 AND f_electronics = $2 AND f_clothing = $3 AND f_vehicles = $4 AND f_fitness = $5 AND f_price <= $6 AND f_price >= $7', [textbooks, electronics, clothing, vehicles, fitness, minPrice, maxPrice]
        );

        // success
        res.status(200).json("Filtered search updated")
        
    } catch (err) {
        console.error(err)
        return res.status(500).json({error: 'An unexpected error occurred while filtering searches'})
    }
}
