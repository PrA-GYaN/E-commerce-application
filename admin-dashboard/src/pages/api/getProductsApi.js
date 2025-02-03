import { getProducts } from "@/actions/getProducts";

export default async function handler(req, res) {
  try {
    const products = await getProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
}