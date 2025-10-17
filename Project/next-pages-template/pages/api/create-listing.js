import jwt from 'jsonwebtoken';
import pool from './db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id: userId } = decoded; // Get user ID from token

    const { name, description, price, image, tags, distance } = req.body;

    if (!name || !description || !price || !image || !tags || tags.length === 0) {
      return res.status(400).json({ error: 'All fields are required, and at least one tag must be selected.' });
    }

    // For now, we'll just log the listing data.
    // In a real application, you would save this to a database.
    console.log('New Listing:', {
      userId,
      name,
      description,
      price,
      image,
      tags,
      distance,
    });

    // Simulate saving to DB and getting an ID
    const newListing = {
      id: Math.random().toString(36).substring(2, 15),
      userId,
      name,
      description,
      price,
      image,
      tags,
      distance,
    };

    res.status(201).json({ message: 'Listing created successfully', listing: newListing });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(401).json({ error: 'Invalid token or server error' });
  }
}
