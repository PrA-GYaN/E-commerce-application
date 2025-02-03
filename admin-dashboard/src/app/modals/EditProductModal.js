import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";

export default function EditProductModal({
  isOpen,
  onClose,
  editingProduct,
  products,
  categories,
  setProducts,
}) {
  const [tempProductName, setTempProductName] = useState("");
  const [tempProductDescription, setTempProductDescription] = useState("");
  const [tempProductInitialStock, setTempProductInitialStock] = useState(0);
  const [tempProductAvailableStock, setTempProductAvailableStock] = useState(0);
  const [tempProductCategory, setTempProductCategory] = useState("");
  const [tempProductImage, setTempProductImage] = useState(null);
  const { toast } = useToast();
  
  const fileInputRef = useRef(null);

  // Store initial values when the modal is opened
  useEffect(() => {
    if (editingProduct !== null && Array.isArray(products)) {
      const productToEdit = products.find((product) => product.id === editingProduct);
      if (productToEdit) {
        setTempProductName(productToEdit.name);
        setTempProductDescription(productToEdit.description);
        setTempProductImage(productToEdit.image);
        setTempProductInitialStock(productToEdit.initialStock);
        setTempProductAvailableStock(productToEdit.availableStock);
        setTempProductCategory(productToEdit.categoryId);
      }
    }
  }, [editingProduct, products, isOpen]);

  const handleUpdateProduct = async () => {
    if (
      tempProductName.trim() === "" ||
      tempProductDescription.trim() === "" ||
      tempProductInitialStock === "" ||
      tempProductAvailableStock === ""
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
  
    // Find the product to edit
    const productToEdit = products.find((product) => product.id === editingProduct);
    if (!productToEdit) return;
  
    // Create a FormData object
    const formData = new FormData();
  
    // Add fields to the formData object if they've been updated
    if (tempProductName !== productToEdit.name) formData.append('name', tempProductName);
    if (tempProductDescription !== productToEdit.description) formData.append('description', tempProductDescription);
    if (tempProductInitialStock !== productToEdit.initialStock) formData.append('initialStock', tempProductInitialStock);
    if (tempProductAvailableStock !== productToEdit.availableStock) formData.append('availableStock', tempProductAvailableStock);
    if (tempProductCategory !== productToEdit.categoryId) formData.append('categoryId', tempProductCategory);
    
    // Check for image change and append it if necessary
    if (tempProductImage && tempProductImage !== productToEdit.image) {
      const imageBlob = await fetch(tempProductImage).then((res) => res.blob());
          formData.append("image", imageBlob, "product-image.jpg");
    }
  
    // If no fields have changed, just close the modal
    if (formData.entries().next().done) {
      onClose();
      return;
    }
  
    // Add the product ID to the formData
    formData.append('id', productToEdit.id);
  
    try {
      // Call the API to update the product using multipart form data
      const response = await fetch("/api/editProductsApi", {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
      console.log('API Response:', result);
      if (result?.id) {
        // Update the products list locally
        setProducts(
          products.map((product) =>
            product.id === editingProduct
              ? { ...product, ...result } // Dynamically merge fields from the API response
              : product
          )
        );
        toast({
          title: "Success",
          description: "Product updated successfully!",
          variant: "success",
        });
        onClose();
      } else {
        toast({
          title: "API Error",
          description: result.message || "An error occurred while updating the product.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the product.",
        variant: "destructive",
      });
    }
  };
  

  const handleEditProductImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setTempProductImage(reader.result);
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
        setTempProductImage(reader.result);
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
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-y-auto max-h-[80vh]">
        <DialogTitle>Edit Product</DialogTitle>
        <DialogDescription>Update the details of the product below.</DialogDescription>

        <Input
          value={tempProductName}
          onChange={(e) => setTempProductName(e.target.value)}
          placeholder="Edit product name"
          className="w-full p-3 mt-4 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />

        <Input
          value={tempProductDescription}
          onChange={(e) => setTempProductDescription(e.target.value)}
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

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={false}
              className="w-full mt-4 p-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {tempProductCategory
                ? categories.find((cat) => cat.id === tempProductCategory)?.name
                : "Select Category..."}
              <ChevronsUpDown className="ml-2 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search categories..." className="h-9" />
              <CommandList>
                <CommandEmpty>No categories found.</CommandEmpty>
                <CommandGroup>
                  {categories.map((category) => (
                    <CommandItem
                      key={category.id}
                      value={category.id}
                      onSelect={(currentValue) => {
                        setTempProductCategory(currentValue === tempProductCategory ? "" : currentValue);
                      }}
                    >
                      {category.name}
                      <Check
                        className={tempProductCategory === category.id ? "opacity-100 ml-auto" : "opacity-0"}
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
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleEditProductImageChange}
            className="hidden"
            accept="image/*"
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
            onClick={handleCancel}
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