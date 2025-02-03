import { deleteCategory } from "@/actions/deleteCategory";

export const config = {
  api: {
    bodyParser: true,
  },
};

const handler = async (req, res) => {
  if (req.method === "DELETE") {
    try {
      console.log("Request body:", req.body);
      const categoryId = req.body;

      if (!categoryId) {
        return res.status(400).json({ error: "Category ID is required" });
      }

      await deleteCategory(categoryId);

      return res.status(200).json({ message: `Category with ID ${categoryId} deleted successfully` });
    } catch (error) {
      console.error("Error deleting category:", error);
      return res.status(500).json({ error: "Failed to delete category" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};

export default handler;
