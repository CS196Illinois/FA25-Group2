import pool from "./db";
import jwt from "jsonwebtoken";

export default function authorized(authToken) {
    console.log(jwt.verify(authToken));
    return true;
}