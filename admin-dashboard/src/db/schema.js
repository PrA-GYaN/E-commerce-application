import { pgTable, varchar, integer, serial } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  image: varchar('image', { length: 255 }).notNull(),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 1000 }).notNull(),
  image: varchar('image', { length: 255 }).notNull(),
  initialStock: integer('initial_stock').notNull(),
  availableStock: integer('available_stock').notNull(),
  categoryId: integer('category_id').references(() => categories.id),
});