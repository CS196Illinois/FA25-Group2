import pool from './db.js'; 
import bcrypt from 'bcryptjs'; 
import { Resend } from 'resend'; 

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' }); 
  }
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' }); 
  }

  try {
   const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );
    
    const user = result.rows[0];
    await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: email,
      subject: 'Verify your email',
      html: `<a href="http://localhost:3000/api/auth/verify?email=${email}">Click here to verify your email</a>`,
    });
    res.status(201).json({ user });

  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: 'User already exists or database error' }); 
  }
}
