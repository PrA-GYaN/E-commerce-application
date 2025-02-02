import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"; // Import the useToast hook

export default function EditCategoryModal({ isOpen, onClose, editingCategory, categories, setCategories }) {
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryImage, setEditCategoryImage] = useState(null);
  const [tempCategoryName, setTempCategoryName] = useState(""); // Temporary state for name
  const [tempCategoryImage, setTempCategoryImage] = useState(null); // Temporary state for image
  const { toast } = useToast(); // Initialize the toast hook

  // Reference for the hidden file input
  const fileInputRef = useRef(null);

  // Store initial values when the modal is opened
  useEffect(() => {
    if (editingCategory !== null && Array.isArray(categories)) {
      const categoryToEdit = categories.find((category) => category.id === editingCategory);
      if (categoryToEdit) {
        setTempCategoryName(categoryToEdit.name); // Set temporary name
        setTempCategoryImage(categoryToEdit.image); // Set temporary image
      }
    }
  }, [editingCategory, categories, isOpen]); // Added isOpen to reset when modal opens

  const handleUpdateCategory = () => {
    if (tempCategoryName.trim()) {
      setCategories(
        categories.map((category) =>
          category.id === editingCategory
            ? { ...category, name: tempCategoryName, image: tempCategoryImage }
            : category
        )
      );
      onClose(); // Close modal after saving
      toast({
        title: "Success",
        description: "Category updated successfully!",
        variant: "success", // Success variant for confirmation
      });
    } else {
      toast({
        title: "Validation Error",
        description: "Category name is required.",
        variant: "destructive", // Destructive variant for errors
      });
    }
  };

  const handleEditCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if the selected file is an image
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setTempCategoryImage(reader.result); // Set temporary image (not final)
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select a valid image file.",
          variant: "destructive", // Destructive variant for errors
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempCategoryImage(reader.result); // Set temporary image (not final)
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please drop a valid image file.",
        variant: "destructive", // Destructive variant for errors
      });
    }
  };

  const handleClickToUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input dialog on click
    }
  };

  // Reset values to the previous state when cancel is clicked
  const handleCancel = () => {
    setTempCategoryName(editCategoryName); // Reset name
    setTempCategoryImage(editCategoryImage); // Reset image
    onClose(); // Close modal
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogDescription>Update the name and image of the category below.</DialogDescription>

        <Input
          value={tempCategoryName}
          onChange={(e) => setTempCategoryName(e.target.value)} // Temporary name update
          placeholder="Edit category name"
          className="w-full p-3 mt-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        
        <div
          className="w-full p-4 mt-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 cursor-pointer"
          onClick={handleClickToUpload} // Trigger file input dialog on click
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            ref={fileInputRef} // Reference to trigger file input dialog programmatically
            onChange={handleEditCategoryImageChange}
            className="hidden"
            accept="image/*" // Only allow image files
          />
          {!tempCategoryImage ? (
            <p className="text-center text-gray-500">Drag & Drop or Click to Upload</p>
          ) : (
            <img
              src={tempCategoryImage}
              alt="Category Preview"
              className="mt-4 w-24 h-24 rounded-md object-cover mx-auto"
            />
          )}
        </div>

        <div className="mt-4 flex justify-end gap-4">
          <Button
            variant="outline"
            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
            onClick={handleCancel} // Close without saving, revert changes
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
  );
}