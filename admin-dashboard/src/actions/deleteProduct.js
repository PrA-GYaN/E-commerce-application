import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from 'drizzle-orm';

export async function deleteProduct(productId) {
  console.log('Deleting product with ID:', productId);
  try {
    const productIdInt = parseInt(productId, 10);
    if (isNaN(productIdInt)) {
        throw new Error('Invalid productId');
    }
    const deletedProduct = await db.delete(products).where(eq(products.id,productIdInt));

    if (deletedProduct.count === 0) {
      console.log('No product found with the given ID');
      throw new Error('Product not found');
    }

    console.log('Product deleted successfully');
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
}
