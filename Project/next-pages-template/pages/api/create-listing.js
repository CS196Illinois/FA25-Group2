import jwt from 'jsonwebtoken';
import pool from './db';
import authorized from './authorized';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {token, username, name, description, price, image, tags} = req.body;
  const user_result = await pool.query(
    'SELECT user_id FROM users WHERE username = $1', [username]
  );
  const user_id = user_result.rows[0].user_id;
  console.log(user_id);

  if (!authorized(token, user_id)) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  try {

    if (!name || !description || !price || !image || !tags || tags.length === 0) {
      return res.status(400).json({error: 'All fields are required, and at least one tag must be selected.'});
    }

    await pool.query(
      'INSERT INTO products (name, description, price, image, user_id, tags, sold) VALUES ($1, $2, $3, $4, $5, $6, $7)', [name, description, price, image, user_id, {tags}, false]
    );

    // success message
    res.status(200).json({success: true, message: 'Listing created successfully!'});

    // catch errors
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(401).json({error: 'Invalid token or server error'});
  }
}