import { db } from "@/db";
import { categories } from "@/db/schema";

export async function addCategory(name, imageUrl) {
  console.log('Adding category:', name, imageUrl);
  try {
    const newCategory = await db.insert(categories).values({
      name: name,
      image: imageUrl,
    });

    console.log('Category added successfully:', newCategory);
  } catch (error) {
    console.error('Error adding category:', error);
    throw new Error('Failed to add category');
  }
}