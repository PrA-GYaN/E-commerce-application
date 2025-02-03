import multer from "multer";
import path from "path";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { editCategory } from "@/actions/editCategory";

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

      if (!req.body.categoryId) {
        return res.status(400).json({ error: "Category ID is required" });
      }

      // Extract category information from the request body
      const { categoryId, name } = req.body;
      
      let imageUrl = null;

      // Only upload the image if a new one is provided
      if (req.file) {
        const cloudinaryResult = await uploadToCloudinary(req.file.buffer); // Pass the file buffer

        if (!cloudinaryResult?.secure_url) {
          return res.status(500).json({ error: "Error uploading image to Cloudinary" });
        }
        imageUrl = cloudinaryResult.secure_url; // Cloudinary URL of the uploaded image
      }
      try {
        const categoryUpdateData = {};
        if (name && name.trim() !== "") {
          categoryUpdateData.name = name;
        }

        if (imageUrl) {
          categoryUpdateData.imageUrl = imageUrl;
        }

        // If there's no change to either, skip the update process
        if (Object.keys(categoryUpdateData).length === 0) {
          return res.status(200).json({ message: "No changes to save." });
        }

        // Update the category in the database
        await editCategory(categoryId, categoryUpdateData);

        return res.status(200).json({
          categoryId,
          name: categoryUpdateData.name || null,
          imageUrl: categoryUpdateData.image || null,
        });
      } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Error processing the request" });
      }
    });
  } else {
    // Return error if method is not POST
    res.status(405).json({ error: "Method Not Allowed" });
  }
};

export default handler;