import multer from "multer";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { addProduct } from "@/actions/addProduct";

const storage = multer.memoryStorage();

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = (req, res) => {
  if (req.method === "POST") {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: "Error uploading image" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      try {
        const cloudinaryResult = await uploadToCloudinary(req.file.buffer);

        if (!cloudinaryResult?.secure_url) {
          return res.status(500).json({ error: "Error uploading image to Cloudinary" });
        }

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

        const imageUrl = cloudinaryResult.secure_url;

        await addProduct(name, description, imageUrl, initialStock, availableStock, categoryId);

        return res.status(200).json({ name, description, imageUrl, initialStock, availableStock, categoryId });
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({ error: "Error uploading to Cloudinary" });
      }
    });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};

export default handler;
