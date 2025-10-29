import pool from './db'; 
import jwt from 'jsonwebtoken';

export default async function updatePfp(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({error: 'Method not allowed'});
    }



    const {new_bio, new_pfp, id} = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const {attempt_id, email} = decoded; 

        if (attempt_id != id) {
            console.error(err)
            res.status(401).json({error: 'Invalid token.'})
        }

        if (new_bio) {
            await pool.query(
                'UPDATE users SET bio = $1 WHERE id = $2', [new_pfp, id]
            );
        } 
        if (new_pfp) {
            await pool.query(
                'UPDATE users SET pfp = $1 WHERE id = $2', [new_bio, id]        
            );
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({error: 'Error updating profile page.'})
    }
}
