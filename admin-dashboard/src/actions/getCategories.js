import { db } from "@/db";
import { categories } from "@/db/schema";
export async function getCategories() {
  try {
    const categoriesList = await db.select().from(categories);
    return categoriesList;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
}