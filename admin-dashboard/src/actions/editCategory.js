import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from 'drizzle-orm';

export async function editCategory(category_id, categoryUpdateData) {
    const { name, imageUrl } = categoryUpdateData;
    console.log('Updating category:', category_id, name, imageUrl);

    const categoryIdInt = parseInt(category_id, 10);
    if (isNaN(categoryIdInt)) {
        throw new Error('Invalid category_id');
    }

    try {
        console.log('Parsed categoryIdInt:', categoryIdInt);

        // Check if the category exists
        const categoryExists = await db
            .select()
            .from(categories)
            .where(categories.id === categoryIdInt)
            .limit(1);

        console.log('Category Exists Check:', categoryExists);

        if (categoryExists.length === 0) {
            throw new Error(`Category with ID ${categoryIdInt} not found`);
        }

        const updateData = {};

        console.log('categoryExists[0].name:', categoryExists[0].name);
        console.log('Name:', name);

        if (name && typeof name === 'string' && name.trim() !== categoryExists[0].name) {
            updateData.name = name;
        }

        if (imageUrl && imageUrl !== categoryExists[0].image) {
            updateData.image = imageUrl;
        }


        if (Object.keys(updateData).length === 0) {
            console.log('No changes detected, skipping update.');
            return { message: "No changes to update" };
        }

        const editCategory = await db.update(categories)
            .set(updateData)
            .where(categories.id === categoryIdInt);

        console.log('editCategory result:', editCategory);

        if (editCategory.rowCount === 0) {
            throw new Error(`Category with ID ${categoryIdInt} not updated (rowCount is 0)`);
        }

        console.log('Category updated successfully:', editCategory);

        return { categoryId: categoryIdInt, ...updateData };

    } catch (error) {
        console.error('Error updating category:', error.message);
        throw new Error('Failed to update category');
    }
}
