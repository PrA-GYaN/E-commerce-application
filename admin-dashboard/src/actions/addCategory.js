import { db } from "@/db";
import { categories } from "@/db/schema";

// Function to add a new category with name and imageUrl
export async function addCategory(name, imageUrl) {
  console.log('Adding category:', name, imageUrl);
  try {
    // Insert a new category with the given name and imageUrl
    const newCategory = await db.insert(categories).values({
      name: name,
      image: imageUrl,
    });
  } catch (error) {
    console.error('Error adding category:', error);
    throw new Error('Failed to add category');
  }
}