import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';

export default function AddProductModal({ isOpen, onClose, setProducts, categories }) {
  const [newProductName, setNewProductName] = useState("");
  const [newProductDescription, setNewProductDescription] = useState("");
  const [newProductImage, setNewProductImage] = useState(null);
  const [newProductInitialStock, setNewProductInitialStock] = useState(0);
  const [newProductAvailableStock, setNewProductAvailableStock] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { toast } = useToast(); // Use toast hook

  const handleAddProduct = async () => {
    // Validation checks
    if (!newProductName.trim()) {
      toast({
        title: "Validation Error",
        description: "Product name is required.",
        variant: "destructive", // Destructive variant for errors
      });
      return;
    }

    if (!newProductDescription.trim()) {
      toast({
        title: "Validation Error",
        description: "Product description is required.",
        variant: "destructive", // Destructive variant for errors
      });
      return;
    }

    if (!newProductImage) {
      toast({
        title: "Validation Error",
        description: "Product image is required.",
        variant: "destructive", // Destructive variant for errors
      });
      return;
    }

    if (newProductInitialStock < 0 || newProductAvailableStock < 0) {
      toast({
        title: "Validation Error",
        description: "Stock values must be positive.",
        variant: "destructive", // Destructive variant for errors
      });
      return;
    }

    if (!selectedCategory) {
      toast({
        title: "Validation Error",
        description: "Please select a category for the product.",
        variant: "destructive", // Destructive variant for errors
      });
      return;
    }

    // Prepare the form data to send to the backend
    const formData = new FormData();
    formData.append("name", newProductName);
    formData.append("description", newProductDescription);
    formData.append("image", newProductImage);
    formData.append("initialStock", newProductInitialStock);
    formData.append("availableStock", newProductAvailableStock);
    formData.append("categoryId", selectedCategory);

    try {
      // Send the form data to the /api/addProduct route
      const response = await axios.post("/api/addProductsApi", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // This is required to send FormData
        },
      });

      const { imageUrl } = response.data; // Get the image URL from the response

      // Add the product to the state (including the uploaded image URL)
      setProducts((prevProducts) => [
        ...prevProducts,
        {
          id: Date.now(),
          name: newProductName,
          description: newProductDescription,
          image: imageUrl,
          initialStock: newProductInitialStock,
          availableStock: newProductAvailableStock,
          categoryId: selectedCategory,
        },
      ]);

      toast({
        title: "Success",
        description: "Product added successfully!",
        variant: "success", // Success variant
      });

      setNewProductName("");
      setNewProductDescription("");
      setNewProductImage(null);
      setNewProductInitialStock(0);
      setNewProductAvailableStock(0);
      setSelectedCategory("");
      onClose(); // Close modal after adding the product
    } catch (error) {
      console.error("Error uploading image or adding product:", error);
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive", // Destructive variant for errors
      });
    }
  };

  const handleNewProductImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if the file is an image
      if (file.type.startsWith("image/")) {
        setNewProductImage(file);
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
      setNewProductImage(file);
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please drop a valid image file.",
        variant: "destructive", // Destructive variant for errors
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
        <DialogTitle>Add New Product</DialogTitle>
        <DialogDescription>Enter the details for the new product below.</DialogDescription>

        <Input
          value={newProductName}
          onChange={(e) => setNewProductName(e.target.value)}
          placeholder="Product Name"
          className="w-full p-3 mt-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />

        <Input
          value={newProductDescription}
          onChange={(e) => setNewProductDescription(e.target.value)}
          placeholder="Product Description"
          className="w-full p-3 mt-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />

        <Input
          type="number"
          value={newProductInitialStock}
          onChange={(e) => setNewProductInitialStock(Number(e.target.value))}
          placeholder="Initial Stock"
          className="w-full p-3 mt-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />

        <Input
          type="number"
          value={newProductAvailableStock}
          onChange={(e) => setNewProductAvailableStock(Number(e.target.value))}
          placeholder="Available Stock"
          className="w-full p-3 mt-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-3 mt-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <div
          className="w-full p-4 mt-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 cursor-pointer"
          onClick={handleClickToUpload} // Open file selection dialog on click
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            ref={fileInputRef} // Reference to trigger click programmatically
            onChange={handleNewProductImageChange}
            className="hidden"
            accept="image/*" // Only allow image files
          />
          {!newProductImage ? (
            <p className="text-center text-gray-500">Drag & Drop or Click to Upload</p>
          ) : (
            <img
              src={URL.createObjectURL(newProductImage)}
              alt="Product Preview"
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
            onClick={handleAddProduct}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Add Product
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}