import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function EditCategoryModal({ isOpen, onClose, editingCategory, categories, setCategories }) {
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryImage, setEditCategoryImage] = useState(null);
  const [tempCategoryName, setTempCategoryName] = useState("");
  const [tempCategoryImage, setTempCategoryImage] = useState(null);
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editingCategory !== null && Array.isArray(categories)) {
      const categoryToEdit = categories.find((category) => category.id === editingCategory);
      if (categoryToEdit) {
        setEditCategoryName(categoryToEdit.name);
        setEditCategoryImage(categoryToEdit.image);
        setTempCategoryName(categoryToEdit.name);
        setTempCategoryImage(categoryToEdit.image);
      }
    }
  }, [editingCategory, categories, isOpen]);

  const handleUpdateCategory = async () => {
    const hasNameChanged = tempCategoryName.trim() !== editCategoryName.trim();
    const hasImageChanged = tempCategoryImage !== editCategoryImage;

    if (!hasNameChanged && !hasImageChanged) {
      onClose(); // Close the modal if no changes have been made
      return; // Return early to prevent the API call
    }
  
    if (tempCategoryName.trim()) {
      try {
        const formData = new FormData();
        formData.append("categoryId", editingCategory);
        if (hasNameChanged) formData.append("name", tempCategoryName);
        if (hasImageChanged && tempCategoryImage) {
          const imageBlob = await fetch(tempCategoryImage).then((res) => res.blob());
          formData.append("image", imageBlob, "category-image.jpg");
        }
        console.log('formData:', formData);
        const response = await fetch("/api/editCategoriesApi", {
          method: "POST",
          body: formData,
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setCategories(
            categories.map((category) =>
              category.id === editingCategory
                ? { ...category, name: tempCategoryName, image: tempCategoryImage }
                : category
            )
          );
          onClose();
          toast({
            title: "Success",
            description: "Category updated successfully!",
            variant: "success",
          });
        } else {
          toast({
            title: "Error",
            description: data.error || "Failed to update category.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while updating the category.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Validation Error",
        description: "Category name is required.",
        variant: "destructive",
      });
    }
  };
  

  const handleEditCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setTempCategoryImage(reader.result);
        };
        reader.readAsDataURL(file);
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempCategoryImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please drop a valid image file.",
        variant: "destructive",
      });
    }
  };

  const handleClickToUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCancel = () => {
    setTempCategoryName(editCategoryName);
    setTempCategoryImage(editCategoryImage);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogDescription>Update the name and image of the category below.</DialogDescription>

        <Input
          value={tempCategoryName}
          onChange={(e) => setTempCategoryName(e.target.value)}
          placeholder="Edit category name"
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
            ref={fileInputRef}
            onChange={handleEditCategoryImageChange}
            className="hidden"
            accept="image/*"
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
            onClick={handleCancel}
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