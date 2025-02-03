import { db } from "@/db";
import { products } from "@/db/schema";
export async function getProducts() {
  try {
    const productsList = await db.select().from(products);
    return productsList;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
}