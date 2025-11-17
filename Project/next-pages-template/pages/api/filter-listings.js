import pool from './db'; 

export default async function filterListings(req, res) {
    // check request type
    if (req.method !== "GET") {
        res.status(405).json({error: 'Method not allowed'});
    }
    
    // get info from req (assuming how it is given)
    const {} = req.params;
    
