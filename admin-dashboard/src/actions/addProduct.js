import { db } from "@/db";
import { products } from "@/db/schema"; // Assuming products is already defined in your schema

// Function to add a new product with details
export async function addProduct(name, description, imageUrl, initialStock, availableStock, categoryId) {
  console.log('Adding product:', name, description, imageUrl, initialStock, availableStock, categoryId);
  try {
    // Insert a new product with the given details
    const newProduct = await db.insert(products).values({
      name: name,
      description: description,
      image: imageUrl,
      initialStock: initialStock,
      availableStock: availableStock,
      categoryId: categoryId,
    });

    console.log('Product added successfully:', newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    throw new Error('Failed to add product');
  }
}