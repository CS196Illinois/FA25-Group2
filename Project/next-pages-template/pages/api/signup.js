import pool from "./db.js"; 
import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken";
// import { Resend } from "resend"; 

// VERIFICATION EMAIL IS WORK IN PROGRESS
// const resend = new Resend(process.env.RESEND);

export default async function handler(req, res) {
  
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" }); 
  }
  
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Email, username, and password are required" }); 
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await pool.query(
      "INSERT INTO users (username, email, password, bio, pfp) VALUES ($1, $2, $3, '', 'https://images.unsplash.com/broken')",
      [username, email, hashedPassword]
    );

    const result = await pool.query(
      "SELECT user_id, email FROM users WHERE username = $1",
      [username]
    )
    
    const user = result.rows[0];
    // await resend.emails.send({
    //   from: "noreply@yourdomain.com",
    //   to: email,
    //   subject: "Verify your email",
    //   html: `<a href="http://localhost:3000/api/auth/verify?email=${email}">Click here to verify your email</a>`,
    // });
    const token = jwt.sign(
      { id: user.user_id, email: user.email }, 
      process.env.JWT_SECRET,       
      { expiresIn: "999h" }                 
    );
    res.status(200).json({ token });

  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: "User already exists or database error" }); 
  }
}
