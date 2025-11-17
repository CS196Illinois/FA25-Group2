import jwt from "jsonwebtoken";

export default function authorized(authToken, id) {
    try {
        const tokenInfo = jwt.verify(authToken, process.env.JWT_SECRET);
        return tokenInfo.id == id;
    } catch (_) {
        return false;
    }
}