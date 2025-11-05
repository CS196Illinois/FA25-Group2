import pool from './db'; 
import authorized from './authorized';

export default async function editPfp(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({error: 'Method not allowed'});
    }

    // Gather information from req (assuming how it is given)
    const {new_bio, new_pfp, id} = req.body;
    const {token} = req.cookies;

    
    try {
    // Check authorization
        if (!(authorized(token, id))) {
            return res.status(401).json({error: 'Invalid token.'})
        }

    // Implement changes
        if (new_bio) {
            await pool.query(
                'UPDATE users SET bio = $1 WHERE user_id = $2', [new_bio, id]
            );
        } 
        if (new_pfp) {
            await pool.query(
                'UPDATE users SET pfp = $1 WHERE user_id = $2', [new_pfp, id]        
            );
        }
    // Return success message
        return res.status(200).json({ success: true, message: 'Profile updated successfully.' });

    // Catch errors
    } catch (err) {
        console.error(err)
        return res.status(500).json({error: 'Error updating profile page.'})
    }
    return 
}
