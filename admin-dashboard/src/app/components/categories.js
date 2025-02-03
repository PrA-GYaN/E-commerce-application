import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import AddCategoryModal from "../modals/AddCategoryModal";
import EditCategoryModal from "../modals/EditCategoryModal";
import { Loader } from "lucide-react";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isAddCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/getCategoriesApi');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        console.log('Categories:', data);
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const deleteCategory = async (categoryId) => {
    try {
      const response = await fetch(`/api/deleteCategoryApi`,
        {
          method: "DELETE",
          body: categoryId,
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      const data = await response.json();
      handleDeleteCategory(categoryId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle editing a category
  const handleEditCategory = (id) => {
    setEditingCategory(id);
    setDialogOpen(true);
  };

  // Handle deleting a category
  const handleDeleteCategory = (id) => {
    setCategories((prevCategories) => prevCategories.filter((category) => category.id !== id));
  };
  
  if (loading) {
    return (
      <div className="flex-col gap-4 w-full h-96 flex items-center justify-center">
        <div
          className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full"
        >
          <div
            className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gradient-to-r from-blue-100 to-purple-200 rounded-xl shadow-lg">
      <div className="mt-8 flex flex-col gap-8">
        <div className="header flex flex-row align-center justify-between">
          <h3 className="text-3xl font-semibold text-gray-800 tracking-tight">Categories</h3>
          <div className="flex justify-end">
            <Button
              onClick={() => setAddCategoryModalOpen(true)}
              className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white px-8 py-3 rounded-lg shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
            >
              Add New Category
            </Button>
          </div>
        </div>

        {categories.length === 0 ? (
          <p className="text-center text-lg text-gray-600">No categories available. Add a new category to get started.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-800">Category Name</th>
                  <th className="px-6 py-4 text-left text-gray-800">Image</th>
                  <th className="px-6 py-4 text-left text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-800">
                      <span className="text-lg font-semibold">{category.name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-800">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                        />
                      ) : (
                        <span className="text-gray-500">No Image</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-4">
                        <Button
                          onClick={() => handleEditCategory(category.id)}
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
                              Do you really want to delete the category "{category.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                            <div className="mt-6 flex justify-end gap-6">
                              <AlertDialogCancel asChild>
                                <Button variant="outline" className="bg-gray-300 text-gray-800 hover:bg-gray-400 px-6 py-2 rounded-md transition-all duration-200">
                                  Cancel
                                </Button>
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteCategory(category.id)}
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

      <AddCategoryModal isOpen={isAddCategoryModalOpen} onClose={() => setAddCategoryModalOpen(false)} setCategories={setCategories} />
      <EditCategoryModal
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        editingCategory={editingCategory}
        categories={categories}
        setCategories={setCategories}
      />
    </div>
  );
}