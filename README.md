# E-Commerce Admin Dashboard

This project is a **Full-Stack E-Commerce Admin Dashboard** built as part of the Zylux IT Solution internship task. It includes category and product management functionalities with authentication and a database backend.

## Features

### **Admin Dashboard**
- Category Management: Create, update, delete categories with name and image.
- Product Management: Create, update, delete products with name, description, image, initial stock, and available stock, linked to categories.
- Authentication: Secure admin login using **Clerk**.
- Database Integration: PostgreSQL with **Supabase & Drizzle ORM**.
- Additional Feature: **Analysis Page** for better insights.

## **Technology Stack**
- **Frontend:** Next.js (Server & Client Components)
- **Backend:** Server Actions (Built-in API handlers)
- **Database:** PostgreSQL (Supabase)
- **ORM:** Drizzle ORM
- **UI:** ShadCN UI & Tailwind CSS
- **Authentication:** Clerk

## **Setup Instructions**

### **Prerequisites**
Make sure you have the following installed:
- Node.js & npm/yarn
- PostgreSQL database (Supabase recommended)

### **Installation**
```sh
# Clone the repository
git clone https://github.com/your-username/repository-name.git

# Navigate to the project directory
cd repository-name

# Install dependencies
npm install  # or yarn install
```

### **Environment Variables**
Create a `.env` file in the root directory and configure the required environment variables:
```env
NEXT_PUBLIC_CLERK_FRONTEND_API=your-clerk-api-key
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
DATABASE_URL=your-database-url
```

### **Run the Project**
```sh
# Start the development server
npm run dev  # or yarn dev
```

## **Deployment**
- The project is deployed on **Vercel**

## **Contributing**
Feel free to fork this project and improve upon it. Contributions are welcome!

## **License**
This project is licensed under the MIT License.

---

For any queries, feel free to contact me at **pragyan1516@gmail.com**.
