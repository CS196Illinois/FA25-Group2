import pool from "./db"; 
import authorized from "./authorized";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function updatePfp(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({error: "Method not allowed"});
    }

    // Gather information from req (assuming how it is given)
    let { pfp, user_id, authToken } = req.body;

    
    try {
    // Check authorization
        if (!(authorized(authToken, user_id))) {
            return res.status(401).json({error: "Invalid token."})
        }

    // Implement changes
        try {
            if (typeof pfp === 'string' && !pfp.startsWith("data:image")) {
                pfp = `data:image/png;base64,${pfp}`;
            }

            const uploadResult = await cloudinary.uploader.upload(pfp, {
                folder: "profile_pictures",
            });

            await pool.query(
                "UPDATE users SET pfp=$1 WHERE user_id=$2",
                [uploadResult.secure_url, user_id]
            );


            res.status(200).json({ message: "Profile picture updated successfully", pfp: uploadResult.secure_url });
        } catch (cloudinaryError) {
            console.error("Cloudinary Error:", cloudinaryError.message || cloudinaryError.data || cloudinaryError.response || 'Failed to upload image');
            res.status(500).json({ error: "Failed to upload image to Cloudinary" });
            return;
        }

    // Catch errors
    } catch (err) {
        console.error(err)
        return res.status(500).json({error: "Error updating profile page."})
    }
    return 
}