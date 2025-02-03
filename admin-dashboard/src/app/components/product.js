import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import AddProductModal from "../modals/AddProductModal";
import EditProductModal from "../modals/EditProductModal";

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/getProductsApi');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        console.log('Products:', data);
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/getCategoriesApi');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        console.log('Categories:', data);
        if(data.length === 0){
          setCategories(data);
        }
        else{
          setCategories([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }          
    };
    fetchProducts();
    fetchCategories();
  }, []);

  // Handle editing a product
  const handleEditProduct = (id) => {
    setEditingProduct(id);
    setDialogOpen(true);
  };

  // Handle deleting a product
  const handleDeleteProduct = (id) => {
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gradient-to-r from-green-100 to-teal-200 rounded-xl shadow-lg">
      <div className="mt-8 flex flex-col gap-8">
        <div className="header flex flex-row align-center justify-between">
          <h3 className="text-3xl font-semibold text-gray-800 tracking-tight">{message} Products</h3>
          <div className="flex justify-end">
            <Button
              onClick={() => setAddProductModalOpen(true)}
              className="bg-gradient-to-r from-green-500 via-teal-600 to-blue-500 text-white px-8 py-3 rounded-lg shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
            >
              Add New Product
            </Button>
          </div>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-lg text-gray-600">No products available. Add a new product to get started.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-800">Product Name</th>
                  <th className="px-6 py-4 text-left text-gray-800">Image</th>
                  <th className="px-6 py-4 text-left text-gray-800">Stock</th>
                  <th className="px-6 py-4 text-left text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-800">
                      <span className="text-lg font-semibold">{product.name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-800">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                        />
                      ) : (
                        <span className="text-gray-500">No Image</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-800">
                      <span className="text-lg">{product.availableStock} / {product.initialStock}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-4">
                        <Button
                          onClick={() => handleEditProduct(product.id)}
                          variant="outline"
                          className="bg-yellow-300 text-yellow-800 hover:bg-yellow-400 px-6 py-2 rounded-md shadow-md transition duration-200 ease-in-out"
                        >
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded-md shadow-md transition duration-200 ease-in-out"
                            >
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white rounded-lg p-6 shadow-2xl">
                            <AlertDialogTitle className="text-2xl font-semibold text-gray-800">
                              Are you sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="mt-4 text-gray-700">
                              Do you really want to delete the product "{product.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                            <div className="mt-6 flex justify-end gap-6">
                              <AlertDialogCancel asChild>
                                <Button variant="outline" className="bg-gray-300 text-gray-800 hover:bg-gray-400 px-6 py-2 rounded-md transition-all duration-200">
                                  Cancel
                                </Button>
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProduct(product.id)}
                                className="bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded-md transition duration-200 ease-in-out"
                              >
                                Confirm
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddProductModal isOpen={isAddProductModalOpen} onClose={() => setAddProductModalOpen(false)} setProducts={setProducts} categories ={categories}/>
      <EditProductModal
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        editingProduct={editingProduct}
        products={products}
        setProducts={setProducts}
      />
    </div>
  );
}