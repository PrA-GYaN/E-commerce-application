import { db } from './index';
import { categories, products } from './schema';

async function insertData() {
  try {
    // Insert a new category
    const category = await db.insert(categories).values({
      name: 'Electronics',
      image: 'electronics.jpg',
    });

    // Get the category ID from the inserted category
    const categoryId = category.id;

    // Insert a new product that belongs to the above category
    const product = await db.insert(products).values({
      name: 'Laptop',
      description: 'A powerful gaming laptop.',
      image: 'laptop.jpg',
      initialStock: 100,
      availableStock: 80,
      categoryId: categoryId,
    });

    console.log('Inserted category:', category);
    console.log('Inserted product:', product);
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

insertData();
