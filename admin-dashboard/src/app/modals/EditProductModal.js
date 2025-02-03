import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"; // Import the useToast hook

export default function EditProductModal({
  isOpen,
  onClose,
  editingProduct,
  products,
  categories,
  setProducts,
}) {
  const [editProductName, setEditProductName] = useState("");
  const [editProductDescription, setEditProductDescription] = useState("");
  const [editProductInitialStock, setEditProductInitialStock] = useState(0);
  const [editProductAvailableStock, setEditProductAvailableStock] = useState(0);
  const [editProductCategory, setEditProductCategory] = useState("");
  const [editProductImage, setEditProductImage] = useState(null);
  const [tempProductName, setTempProductName] = useState(""); // Temporary state for name
  const [tempProductDescription, setTempProductDescription] = useState(""); // Temporary state for description
  const [tempProductImage, setTempProductImage] = useState(null); // Temporary state for image
  const [tempProductInitialStock, setTempProductInitialStock] = useState(0); // Temporary state for initial stock
  const [tempProductAvailableStock, setTempProductAvailableStock] = useState(0); // Temporary state for available stock
  const [tempProductCategory, setTempProductCategory] = useState(""); // Temporary state for category
  const { toast } = useToast(); // Initialize the toast hook

  // Reference for the hidden file input
  const fileInputRef = useRef(null);

  // Store initial values when the modal is opened
  useEffect(() => {
    if (editingProduct !== null && Array.isArray(products)) {
      const productToEdit = products.find((product) => product.id === editingProduct);
      if (productToEdit) {
        setTempProductName(productToEdit.name); // Set temporary name
        setTempProductDescription(productToEdit.description); // Set temporary description
        setTempProductImage(productToEdit.image); // Set temporary image
        setTempProductInitialStock(productToEdit.initialStock); // Set temporary initial stock
        setTempProductAvailableStock(productToEdit.availableStock); // Set temporary available stock
        setTempProductCategory(productToEdit.categoryId); // Set temporary category
      }
    }
  }, [editingProduct, products, isOpen]); // Added isOpen to reset when modal opens

  const handleUpdateProduct = () => {
    if (tempProductName.trim()) {
      setProducts(
        products.map((product) =>
          product.id === editingProduct
            ? {
                ...product,
                name: tempProductName,
                description: tempProductDescription,
                image: tempProductImage,
                initialStock: tempProductInitialStock,
                availableStock: tempProductAvailableStock,
                categoryId: tempProductCategory,
              }
            : product
        )
      );
      onClose(); // Close modal after saving
      toast({
        title: "Success",
        description: "Product updated successfully!",
        variant: "success", // Success variant for confirmation
      });
    } else {
      toast({
        title: "Validation Error",
        description: "Product name is required.",
        variant: "destructive", // Destructive variant for errors
      });
    }
  };

  const handleEditProductImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if the selected file is an image
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setTempProductImage(reader.result); // Set temporary image (not final)
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
        setTempProductImage(reader.result); // Set temporary image (not final)
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
    setTempProductName(editProductName); // Reset name
    setTempProductDescription(editProductDescription); // Reset description
    setTempProductImage(editProductImage); // Reset image
    setTempProductInitialStock(editProductInitialStock); // Reset initial stock
    setTempProductAvailableStock(editProductAvailableStock); // Reset available stock
    setTempProductCategory(editProductCategory); // Reset category
    onClose(); // Close modal
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogDescription>Update the details of the product below.</DialogDescription>

        <Input
          value={tempProductName}
          onChange={(e) => setTempProductName(e.target.value)} // Temporary name update
          placeholder="Edit product name"
          className="w-full p-3 mt-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />

        <Input
          value={tempProductDescription}
          onChange={(e) => setTempProductDescription(e.target.value)} // Temporary description update
          placeholder="Edit product description"
          className="w-full p-3 mt-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />

        <Input
          type="number"
          value={tempProductInitialStock}
          onChange={(e) => setTempProductInitialStock(Number(e.target.value))}
          placeholder="Edit initial stock"
          className="w-full p-3 mt-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />

        <Input
          type="number"
          value={tempProductAvailableStock}
          onChange={(e) => setTempProductAvailableStock(Number(e.target.value))}
          placeholder="Edit available stock"
          className="w-full p-3 mt-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={tempProductCategory}
          onChange={(e) => setTempProductCategory(e.target.value)}
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
          onClick={handleClickToUpload} // Trigger file input dialog on click
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            ref={fileInputRef} // Reference to trigger file input dialog programmatically
            onChange={handleEditProductImageChange}
            className="hidden"
            accept="image/*" // Only allow image files
          />
          {!tempProductImage ? (
            <p className="text-center text-gray-500">Drag & Drop or Click to Upload</p>
          ) : (
            <img
              src={tempProductImage}
              alt="Product Preview"
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
            onClick={handleUpdateProduct}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}