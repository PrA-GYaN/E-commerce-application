import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from 'drizzle-orm';

export async function deleteCategory(categoryId) {
  console.log('Deleting category with ID:', categoryId);
  try {

    const categoryIdInt = parseInt(categoryId, 10);
    if (isNaN(categoryIdInt)) {
        throw new Error('Invalid category_id');
    }
    const deletedCategory = await db
      .delete(categories)
      .where(eq(categories.id, categoryIdInt));

    if (deletedCategory.count === 0) {
      console.log('No category found with the given ID');
      throw new Error('Category not found');
    }

    console.log('Category deleted successfully');
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error('Failed to delete category');
  }
}