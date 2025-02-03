import multer from "multer";
import path from "path";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { addCategory } from "@/actions/addCategory";

// Set up multer storage configuration (for handling files before uploading to Cloudinary)
const storage = multer.memoryStorage(); // Use memoryStorage to keep the image buffer in memory

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing to allow multer to process the form data
  },
};

const handler = (req, res) => {
  // If method is POST, handle file upload
  if (req.method === "POST") {
    // Use multer to handle the incoming request and upload the file
    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: "Error uploading image" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      try {
        // Upload image to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(req.file.buffer); // Pass the file buffer

        if (!cloudinaryResult?.secure_url) {
          return res.status(500).json({ error: "Error uploading image to Cloudinary" });
        }

        // Extract category name from the request body
        const { name } = req.body;

        if (!name || name.trim() === "") {
          return res.status(400).json({ error: "Category name is required" });
        }

        const imageUrl = cloudinaryResult.secure_url; // Cloudinary URL of the uploaded image

        // Add the category to the database
        await addCategory(name, imageUrl);

        return res.status(200).json({ name, imageUrl });
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({ error: "Error uploading to Cloudinary" });
      }
    });
  } else {
    // Return error if method is not POST
    res.status(405).json({ error: "Method Not Allowed" });
  }
};

export default handler;