'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCategories } from '@/hooks/use-categories';
import { useBrands } from '@/hooks/use-brands';
import { useColors } from '@/hooks/use-colors';
import { useSizes } from '@/hooks/use-sizes';
import { processImages } from '@/lib/image-utils';

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from '@/components/ui/textarea';
import { ProductFormData } from '@/types/product';

interface PreviewImage {
  url: string;
  base64: string;
}

interface ProductFormProps {
  initialData?: ProductFormData;
  previewImages?: PreviewImage[];
  onSubmit: (data: ProductFormData, images: PreviewImage[]) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

export default function ProductForm({ 
  initialData,
  previewImages = [],
  onSubmit,
  onCancel,
  isEdit = false 
}: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);
  const [openSizes, setOpenSizes] = useState(false);
  const [openColors, setOpenColors] = useState(false);
  const [images, setImages] = useState<PreviewImage[]>(previewImages);
  const [formData, setFormData] = useState<ProductFormData>(initialData || {
    title: '',
    prodCategory: '',
    brand: '',
    sku: '',
    shippingCost: '',
    price: '',
    productDetails: '',
    size: [],
    colors: [],
    inStock: true,
    images: [] // Added missing images field
  });

  // Fetch data using custom hooks
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: brands = [], isLoading: brandsLoading } = useBrands();
  const { data: colors = [], isLoading: colorsLoading } = useColors();
  const { data: sizes = [], isLoading: sizesLoading } = useSizes();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        const base64Images = await processImages(files);
        const newImages: PreviewImage[] = await Promise.all(
          Array.from(files).map(async (file, index) => ({
            url: URL.createObjectURL(file),
            base64: base64Images[index]
          }))
        );
        setImages(prev => [...prev, ...newImages]);
      } catch (error) {
        console.error('Error processing images:', error);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData, images);
    } catch (error) {
      console.error('Error submitting product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit Product' : 'Add New Product'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Product title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* SKU */}
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  name="sku"
                  placeholder="Product SKU"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Category Combobox */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Popover open={openCategory} onOpenChange={setOpenCategory}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCategory}
                      className="w-full justify-between"
                    >
                      {formData.prodCategory
                        ? categories.find((category) => category.id === formData.prodCategory)?.name
                        : "Select category..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search category..." />
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {categories.map((category) => (
                          <CommandItem
                            key={category.id}
                            value={category.name}
                            onSelect={() => {
                              setFormData(prev => ({ ...prev, prodCategory: category.id }));
                              setOpenCategory(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.prodCategory === category.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {category.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Brand Combobox */}
              <div className="space-y-2">
                <Label>Brand</Label>
                <Popover open={openBrand} onOpenChange={setOpenBrand}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openBrand}
                      className="w-full justify-between"
                    >
                      {formData.brand
                        ? brands.find((brand) => brand.id === formData.brand)?.name
                        : "Select brand..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search brand..." />
                      <CommandEmpty>No brand found.</CommandEmpty>
                      <CommandGroup>
                        {brands.map((brand) => (
                          <CommandItem
                            key={brand.id}
                            value={brand.name}
                            onSelect={() => {
                              setFormData(prev => ({ ...prev, brand: brand.id }));
                              setOpenBrand(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.brand === brand.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {brand.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="99.99"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Shipping Cost */}
              <div className="space-y-2">
                <Label htmlFor="shippingCost">Shipping Cost</Label>
                <Input
                  id="shippingCost"
                  name="shippingCost"
                  type="number"
                  placeholder="9.99"
                  value={formData.shippingCost}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Images Upload */}
              <div className="space-y-2 col-span-2">
                <Label>Product Images</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="mb-4"
                  />
                  <div className="grid grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={image.url} 
                          alt={`Product ${index + 1}`} 
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sizes Combobox */}
              <div className="space-y-2 col-span-2">
                <Label>Available Sizes</Label>
                <Popover open={openSizes} onOpenChange={setOpenSizes}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openSizes}
                      className="w-full justify-between"
                    >
                      {formData.size.length > 0
                        ? `${formData.size.length} sizes selected`
                        : "Select sizes..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search sizes..." />
                      <CommandEmpty>No size found.</CommandEmpty>
                      <CommandGroup>
                        {sizes.map((size) => (
                          <CommandItem
                            key={size.id}
                            value={size.name}
                            onSelect={() => {
                              setFormData(prev => ({
                                ...prev,
                                size: prev.size.includes(size.id)
                                  ? prev.size.filter(id => id !== size.id)
                                  : [...prev.size, size.id]
                              }));
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={formData.size.includes(size.id)}
                                className="mr-2"
                              />
                              {size.name} ({size.type})
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Colors Combobox */}
              <div className="space-y-2 col-span-2">
                <Label>Available Colors</Label>
                <Popover open={openColors} onOpenChange={setOpenColors}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openColors}
                      className="w-full justify-between"
                    >
                      {formData.colors.length > 0
                        ? `${formData.colors.length} colors selected`
                        : "Select colors..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search colors..." />
                      <CommandEmpty>No color found.</CommandEmpty>
                      <CommandGroup>
                        {colors.map((color) => (
                          <CommandItem
                            key={color.id}
                            value={color.name}
                            onSelect={() => {
                              setFormData(prev => ({
                                ...prev,
                                colors: prev.colors.includes(color.id)
                                  ? prev.colors.filter(id => id !== color.id)
                                  : [...prev.colors, color.id]
                              }));
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={formData.colors.includes(color.id)}
                                className="mr-2"
                              />
                              <div 
                                className="w-4 h-4 rounded-full border"
                                style={{ backgroundColor: color.hex }}
                              />
                              {color.name}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Product Details Field */}
              <div className="space-y-2 col-span-2">
                <Label htmlFor="productDetails">Product Details</Label>
                <Textarea
                  id="productDetails"
                  name="productDetails"
                  value={formData.productDetails || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    productDetails: e.target.value
                  }))}
                  placeholder="Enter product details, specifications, or description..."
                  className="min-h-[150px w-full]"
                />
              </div>

              {/* In Stock */}
              <div className="space-y-2 col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inStock"
                    checked={formData.inStock}
                    onCheckedChange={(checked) => {
                      setFormData(prev => ({
                        ...prev,
                        inStock: checked as boolean,
                      }));
                    }}
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading || !formData.prodCategory || !formData.brand || formData.size.length === 0 || formData.colors.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isEdit ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  isEdit ? 'Update Product' : 'Create Product'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}