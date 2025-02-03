import multer from "multer";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { addProduct } from "@/actions/addProduct"; // Assuming you have an addProduct function to interact with your database

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

        // Extract product details from the request body
        const { name, description, initialStock, availableStock, categoryId } = req.body;

        if (!name || name.trim() === "") {
          return res.status(400).json({ error: "Product name is required" });
        }
        if (!description || description.trim() === "") {
          return res.status(400).json({ error: "Product description is required" });
        }
        if (!initialStock || !availableStock || !categoryId) {
          return res.status(400).json({ error: "Initial stock, available stock, and category are required" });
        }

        const imageUrl = cloudinaryResult.secure_url; // Cloudinary URL of the uploaded image

        // Add the product to the database
        await addProduct(name, description, imageUrl, initialStock, availableStock, categoryId);

        return res.status(200).json({ name, description, imageUrl, initialStock, availableStock, categoryId });
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