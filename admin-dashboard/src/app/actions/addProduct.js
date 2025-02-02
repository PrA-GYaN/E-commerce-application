// app/actions/product.ts
'use server';
import { db } from '@/db';
import { products } from '@/db/schema';

export async function createProduct(formData) {
  const name = formData.get('name');
  const description = formData.get('description');
  const image = formData.get('image');
  const initialStock = parseInt(formData.get('initialStock'));
  const availableStock = parseInt(formData.get('availableStock'));
  const categoryId = parseInt(formData.get('categoryId'));
  await db.insert(products).values({ name, description, image, initialStock, availableStock, categoryId });
}