import multer from "multer";
import path from "path";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { editCategory } from "@/actions/editCategory";

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

      if (!req.body.categoryId) {
        return res.status(400).json({ error: "Category ID is required" });
      }

      const { categoryId, name } = req.body;
      
      let imageUrl = null;

      if (req.file) {
        const cloudinaryResult = await uploadToCloudinary(req.file.buffer);

        if (!cloudinaryResult?.secure_url) {
          return res.status(500).json({ error: "Error uploading image to Cloudinary" });
        }
        imageUrl = cloudinaryResult.secure_url;
      }
      try {
        const categoryUpdateData = {};
        if (name && name.trim() !== "") {
          categoryUpdateData.name = name;
        }

        if (imageUrl) {
          categoryUpdateData.imageUrl = imageUrl;
        }

        if (Object.keys(categoryUpdateData).length === 0) {
          return res.status(200).json({ message: "No changes to save." });
        }

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
    res.status(405).json({ error: "Method Not Allowed" });
  }
};

export default handler;
