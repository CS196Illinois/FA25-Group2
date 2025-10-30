import { Pool } from 'pg';
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

console.log("cwd", process.cwd());
export default pool;