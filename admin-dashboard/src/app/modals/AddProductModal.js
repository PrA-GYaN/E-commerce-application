import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import axios from "axios";

export default function AddProductModal({ isOpen, onClose, setProducts, categories }) {
  const [newProductName, setNewProductName] = useState("");
  const [newProductDescription, setNewProductDescription] = useState("");
  const [newProductImage, setNewProductImage] = useState(null);
  const [newProductInitialStock, setNewProductInitialStock] = useState(0);
  const [newProductAvailableStock, setNewProductAvailableStock] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { toast } = useToast();

  const handleAddProduct = async () => {
    if (!newProductName.trim()) {
      toast({
        title: "Validation Error",
        description: "Product name is required.",
        variant: "destructive",
      });
      return;
    }

    if (!newProductDescription.trim()) {
      toast({
        title: "Validation Error",
        description: "Product description is required.",
        variant: "destructive",
      });
      return;
    }

    if (!newProductImage) {
      toast({
        title: "Validation Error",
        description: "Product image is required.",
        variant: "destructive",
      });
      return;
    }

    if (newProductInitialStock < 0 || newProductAvailableStock < 0) {
      toast({
        title: "Validation Error",
        description: "Stock values must be positive.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCategory) {
      toast({
        title: "Validation Error",
        description: "Please select a category for the product.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", newProductName);
    formData.append("description", newProductDescription);
    formData.append("image", newProductImage);
    formData.append("initialStock", newProductInitialStock);
    formData.append("availableStock", newProductAvailableStock);
    formData.append("categoryId", selectedCategory);

    try {
      const response = await axios.post("/api/addProductsApi", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { imageUrl } = response.data;
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
        variant: "success",
      });

      setNewProductName("");
      setNewProductDescription("");
      setNewProductImage(null);
      setNewProductInitialStock(0);
      setNewProductAvailableStock(0);
      setSelectedCategory("");
      onClose();
    } catch (error) {
      console.error("Error uploading image or adding product:", error);
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNewProductImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setNewProductImage(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select a valid image file.",
          variant: "destructive",
        });
      }
    }
  };

  const fileInputRef = useRef(null);

  const handleClickToUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
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

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Initial Stock</label>
          <Input
            type="number"
            value={newProductInitialStock}
            onChange={(e) => setNewProductInitialStock(Number(e.target.value))}
            placeholder="Initial Stock"
            className="w-full p-3 mt-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Available Stock</label>
          <Input
            type="number"
            value={newProductAvailableStock}
            onChange={(e) => setNewProductAvailableStock(Number(e.target.value))}
            placeholder="Available Stock"
            className="w-full p-3 mt-2 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full mt-4 justify-between">
              {selectedCategory
                ? categories.find((category) => category.id === selectedCategory)?.name
                : "Select Category..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search categories..." className="h-9" />
              <CommandList>
                <CommandEmpty>No categories found.</CommandEmpty>
                <CommandGroup>
                  {categories.map((category) => (
                    <CommandItem
                      key={category.id}
                      onSelect={() => {
                        setSelectedCategory(category.id);
                      }}
                    >
                      {category.name}
                      <Check
                        className={`ml-auto ${selectedCategory === category.id ? "opacity-100" : "opacity-0"}`}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div
          className="w-full p-4 mt-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 cursor-pointer"
          onClick={handleClickToUpload}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleNewProductImageChange}
            className="hidden"
            accept="image/*"
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
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button onClick={handleAddProduct} className="bg-blue-600 text-white hover:bg-blue-700">
            Add Product
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}