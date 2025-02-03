// pages/api/getCategoriesApi.js
import { getCategories } from "@/actions/getCategories";

export default async function handler(req, res) {
  try {
    const categories = await getCategories();
    // console.log('Categories:', categories);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
}