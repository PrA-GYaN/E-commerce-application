import { db } from "@/db";
import { products } from "@/db/schema"; // Assuming products is already defined in your schema

// Function to update an existing product with the given details
export async function editProduct(productId, updatedFields) {
  console.log('Editing product:', productId, updatedFields);
  const productIdInt = parseInt(productId, 10);
  try {
    // Ensure that only fields that were provided are updated
    const updateFields = {};

    // Add fields to updateFields if they are present in the updatedFields object
    if (updatedFields.name !== undefined) updateFields.name = updatedFields.name;
    if (updatedFields.description !== undefined) updateFields.description = updatedFields.description;
    if (updatedFields.image !== undefined) updateFields.image = updatedFields.image; // imageUrl might be null if no image is uploaded
    if (updatedFields.initialStock !== undefined) updateFields.initialStock = updatedFields.initialStock;
    if (updatedFields.availableStock !== undefined) updateFields.availableStock = updatedFields.availableStock;
    if (updatedFields.categoryId !== undefined) updateFields.categoryId = updatedFields.categoryId;

    // If no fields are to be updated, throw an error
    if (Object.keys(updateFields).length === 0) {
      console.log("No valid fields to update");
      return { message: "No changes to update" }; // No changes made, exit early
    }

    // Update the product in the database with the provided changes
    const updatedProduct = await db.update(products)
      .set(updateFields) // Set only the fields that are provided
      .where(products.id === productIdInt);

    console.log('Product updated successfully:', updatedProduct);

    return updatedProduct; // Return the updated product (optional)

  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
}