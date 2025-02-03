import { db } from "@/db";
import { products } from "@/db/schema";

export async function editProduct(productId, updatedFields) {
  console.log('Editing product:', productId, updatedFields);
  const productIdInt = parseInt(productId, 10);
  try {
    const updateFields = {};

    if (updatedFields.name !== undefined) updateFields.name = updatedFields.name;
    if (updatedFields.description !== undefined) updateFields.description = updatedFields.description;
    if (updatedFields.image !== undefined) updateFields.image = updatedFields.image;
    if (updatedFields.initialStock !== undefined) updateFields.initialStock = updatedFields.initialStock;
    if (updatedFields.availableStock !== undefined) updateFields.availableStock = updatedFields.availableStock;
    if (updatedFields.categoryId !== undefined) updateFields.categoryId = updatedFields.categoryId;


    if (Object.keys(updateFields).length === 0) {
      console.log("No valid fields to update");
      return { message: "No changes to update" };
    }

    const updatedProduct = await db.update(products)
      .set(updateFields) 
      .where(products.id === productIdInt);

    console.log('Product updated successfully:', updatedProduct);

    return updatedProduct;

  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
}