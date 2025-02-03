import multer from "multer";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { editProduct } from "@/actions/editProduct";
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
        return res.status(500).json({ error: "Error uploading image using Multer" });
      }

      const { id, name, description, initialStock, availableStock, categoryId } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Product ID is required" });
      }

      let imageUrl = null;

      if (req.file) {
        try {
          const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
          if (!cloudinaryResult?.secure_url) {
            return res.status(500).json({ error: "Error uploading image to Cloudinary" });
          }
          imageUrl = cloudinaryResult.secure_url;
        } catch (error) {
          return res.status(500).json({ error: "Error processing image upload" });
        }
      }

      const updatedFields = {};

      if (name && name.trim() !== "") {
        updatedFields.name = name;
      }

      if (description && description.trim() !== "") {
        updatedFields.description = description;
      }

      if (initialStock && initialStock !== "") {
        updatedFields.initialStock = initialStock;
      }

      if (availableStock && availableStock !== "") {
        updatedFields.availableStock = availableStock;
      }

      if (categoryId && categoryId.trim() !== "") {
        updatedFields.categoryId = categoryId;
      }

      if (imageUrl) {
        updatedFields.image = imageUrl;
      }

      if (Object.keys(updatedFields).length === 0) {
        return res.status(200).json({ message: "No changes to save" });
      }

      try {
        await editProduct(id, updatedFields);

        return res.status(200).json({
          id,
          ...updatedFields,
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
