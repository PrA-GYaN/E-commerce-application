import multer from "multer";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { editProduct } from "@/actions/editProduct";
const storage = multer.memoryStorage();

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
        return res.status(500).json({ error: "Error uploading image using Multer" });
      }

      const { id, name, description, initialStock, availableStock, categoryId } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Product ID is required" });
      }

      // Only upload the image if a new one is provided
      let imageUrl = null;

      if (req.file) {
        try {
          const cloudinaryResult = await uploadToCloudinary(req.file.buffer); // Pass the file buffer
          if (!cloudinaryResult?.secure_url) {
            return res.status(500).json({ error: "Error uploading image to Cloudinary" });
          }
          imageUrl = cloudinaryResult.secure_url; // Cloudinary URL of the uploaded image
        } catch (error) {
          return res.status(500).json({ error: "Error processing image upload" });
        }
      }

      // Prepare the updated fields object
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

      // If no fields are provided to update, return early
      if (Object.keys(updatedFields).length === 0) {
        return res.status(200).json({ message: "No changes to save" });
      }

      try {
        // Update the product in the database
        await editProduct(id, updatedFields);

        return res.status(200).json({
          id,
          ...updatedFields, // Send the updated fields in the response
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