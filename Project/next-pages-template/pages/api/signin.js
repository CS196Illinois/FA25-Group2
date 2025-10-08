import pool from './db'; 
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' }); 
  }
  
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET,             
      { expiresIn: '1h' }                 
    );
    
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600;`);
    res.status(200).json({ message: 'Signed in successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });

