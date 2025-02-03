-- Create the 'categories' table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(255) NOT NULL
);

-- Create the 'products' table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(1000) NOT NULL,
  image VARCHAR(255) NOT NULL,
  initial_stock INTEGER NOT NULL,
  available_stock INTEGER NOT NULL,
  category_id INTEGER REFERENCES categories(id)
);