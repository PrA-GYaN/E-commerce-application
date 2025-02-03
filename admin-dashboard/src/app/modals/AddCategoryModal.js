import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';

export default function AddCategoryModal({ isOpen, onClose, setCategories }) {
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const { toast } = useToast(); // Use toast hook

  const handleAddCategory = async () => {
    // Validation checks
    if (!newCategory.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required.",
        variant: "destructive",
      });
      return;
    }

    if (!newCategoryImage) {
      toast({
        title: "Validation Error",
        description: "Category image is required.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", newCategory);
    formData.append("image", newCategoryImage);

    try {
      const response = await axios.post("/api/addCategoriesApi", formData, {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      });

      const { imageUrl } = response.data;

      setCategories((prevCategories) => [
        ...prevCategories,
        { id: Date.now(), name: newCategory, image: imageUrl },
      ]);

      toast({
        title: "Success",
        description: "Category added successfully!",
        variant: "success", 
      });

      setNewCategory("");
      setNewCategoryImage(null);
      onClose(); 
    } catch (error) {
      console.error("Error uploading image or adding category:", error);
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
        variant: "destructive", 
      });
    }
  };

  const handleNewCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if the file is an image
      if (file.type.startsWith("image/")) {
        setNewCategoryImage(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select a valid image file.",
          variant: "destructive", 
        });
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setNewCategoryImage(file);
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please drop a valid image file.",
        variant: "destructive", 
      });
    }
  };

  // Reference for the hidden input element
  const fileInputRef = useRef(null);

  const handleClickToUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogDescription>Enter the name and image for the new category below.</DialogDescription>

        <Input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Category Name"
          className="w-full p-3 mt-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />

        <div
          className="w-full p-4 mt-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 cursor-pointer"
          onClick={handleClickToUpload}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            ref={fileInputRef} // Reference to trigger click programmatically
            onChange={handleNewCategoryImageChange}
            className="hidden"
            accept="image/*" // Only allow image files
          />
          {!newCategoryImage ? (
            <p className="text-center text-gray-500">Drag & Drop or Click to Upload</p>
          ) : (
            <img
              src={URL.createObjectURL(newCategoryImage)}
              alt="Category Preview"
              className="mt-4 w-24 h-24 rounded-md object-cover mx-auto"
            />
          )}
        </div>

        <div className="mt-4 flex justify-end gap-4">
          <Button
            variant="outline"
            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
            onClick={onClose} // Close without saving
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddCategory}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Add Category
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}