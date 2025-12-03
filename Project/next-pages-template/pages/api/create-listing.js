import jwt from 'jsonwebtoken';
import pool from './db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {token, user_id, name, description, price, image, tags} = req.params;

  if (!authorized(token, user_id)) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  try {

    if (!name || !description || !price || !image || !tags || tags.length === 0) {
      return res.status(400).json({error: 'All fields are required, and at least one tag must be selected.'});
    }

    await pool.query(
      'INSERT INTO products (name, description, price, image, user_id, sold) VALUES ($1, $2 $3, $4, $5, $6)', [name, description, price, image, user_id, false]
    );

    // success message
    res.status(201).json({success: true; message: 'Listing created successfully!'});

    // catch errors
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(401).json({error: 'Invalid token or server error'});
  }
}