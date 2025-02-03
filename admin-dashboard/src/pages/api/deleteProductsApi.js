import { deleteProduct } from "@/actions/deleteProduct";

export const config = {
  api: {
    bodyParser: true,
  },
};

const handler = async (req, res) => {
  if (req.method === "DELETE") {
    try {
      console.log("Request body:", req.body);
      const productId = req.body;

      if (!productId) {
        return res.status(400).json({ error: "Product ID is required" });
      }

      await deleteProduct(productId);

      return res.status(200).json({ message: `Product with ID ${productId} deleted successfully` });
    } catch (error) {
      console.error("Error deleting product:", error);
      return res.status(500).json({ error: "Failed to delete product" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};

export default handler;
