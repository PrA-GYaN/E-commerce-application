// app/actions/category.js
'use server';
import { db } from '@/db';
import { categories } from '@/db/schema';

export async function createCategory(formData) {
  const name = formData.get('name');
  const image = formData.get('image');
  await db.insert(categories).values({ name, image });
}