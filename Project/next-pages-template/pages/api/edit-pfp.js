import pool from './db'; 
import authorized from './authorized';

export default async function editPfp(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({error: 'Method not allowed'});
    }

    // gather info from req (assuming how it is given)
    const {token, new_bio, new_pfp, id} = req.query;
    
    try {
    // check auth
        if (!(authorized(token, id))) {
            return res.status(401).json({error: 'Invalid token.'})
        }

    // implement changes
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
    // success message
        return res.status(200).json({message: 'Profile updated successfully.' });

    // Catch errors
    } catch (err) {
        console.error(err)
        return res.status(500).json({error: 'Error updating profile page.'})
    }
}
