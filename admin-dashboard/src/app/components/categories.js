import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null); // Store the image file
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryImage, setEditCategoryImage] = useState(null); // Store the image file for edit
  const [isDialogOpen, setDialogOpen] = useState(false);

  // Handle adding a new category with image
  const handleAddCategory = () => {
    if (newCategory.trim() && newCategoryImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategories([
          ...categories,
          { id: Date.now(), name: newCategory, image: reader.result },
        ]);
      };
      reader.readAsDataURL(newCategoryImage); // Convert the image to a data URL
      setNewCategory("");
      setNewCategoryImage(null);
    }
  };

  // Handle editing an existing category
  const handleEditCategory = (id) => {
    const categoryToEdit = categories.find((category) => category.id === id);
    setEditingCategory(id);
    setEditCategoryName(categoryToEdit.name);
    setEditCategoryImage(categoryToEdit.image); // Set the image for edit
    setDialogOpen(true);
  };

  // Handle updating an existing category with new name and image
  const handleUpdateCategory = () => {
    if (editCategoryName.trim()) {
      setCategories(
        categories.map((category) =>
          category.id === editingCategory
            ? { ...category, name: editCategoryName, image: editCategoryImage }
            : category
        )
      );
      setEditingCategory(null);
      setEditCategoryName("");
      setEditCategoryImage(null);
      setDialogOpen(false);
    }
  };

  // Handle deleting a category
  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  // Handle image selection for adding new category
  const handleNewCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCategoryImage(file);
    }
  };

  // Handle image selection for editing category
  const handleEditCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditCategoryImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800">Category Management</h2>
      <p className="mt-4 text-gray-600">Manage your platform's categories here.</p>

      <div className="mt-6">
        <div className="flex items-center gap-4">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter new category"
            className="w-full p-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          
          <Input
            type="file"
            onChange={handleNewCategoryImageChange}
            className="w-full p-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          
          <Button
            onClick={handleAddCategory}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Add Category
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-medium text-gray-700">Categories:</h3>
        <div className="mt-4 space-y-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-md shadow-md"
            >
              <div className="flex items-center gap-4">
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <span className="text-gray-700">{category.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleEditCategory(category.id)}
                  variant="outline"
                  className="bg-yellow-200 text-yellow-800 border-yellow-300 hover:bg-yellow-300 rounded-md"
                >
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Do you really want to delete the category "{category.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                    <div className="mt-4 flex justify-end gap-4">
                      <AlertDialogCancel asChild>
                        <Button variant="outline" className="bg-gray-300 text-gray-800 hover:bg-gray-400">
                          Cancel
                        </Button>
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteCategory(category.id)}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Confirm
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {editingCategory && (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the name and image of the category below.
            </DialogDescription>

            <Input
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
              placeholder="Edit category name"
              className="w-full p-3 mt-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <Input
              type="file"
              onChange={handleEditCategoryImageChange}
              className="w-full p-3 mt-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {editCategoryImage && (
              <img
                src={editCategoryImage}
                alt="Category Preview"
                className="mt-4 w-24 h-24 rounded-md object-cover"
              />
            )}

            <div className="mt-4 flex justify-end gap-4">
              <Button
                variant="outline"
                className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                onClick={() => setDialogOpen(false)} // Close dialog without saving
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateCategory}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}