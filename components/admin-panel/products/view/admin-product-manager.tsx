'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Pencil, 
  Trash2, 
  Image as ImageIcon,
  Check,
  X,
  MoreVertical,
  AlertTriangle 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from '@/types/product';

interface AdminProductManagerProps {
  products: Product[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function AdminProductManager({ products, onEdit, onDelete }: AdminProductManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const parseProductImages = (product: Product): string[] => {
    return typeof product.images === 'string' ? 
      JSON.parse(product.images) : product.images;
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <Card>
        <CardHeader>
          <CardTitle>Search Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by title, SKU, or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </CardContent>
      </Card>

      {/* Products Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Colors</TableHead>
              <TableHead>Sizes</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Shipping</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Images</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => {
              const images = parseProductImages(product);

              return (
                <TableRow key={product.id}>
                  {/* Image */}
                  <TableCell>
                    <img 
                      src={images[0]} 
                      alt={product.title}
                      className="size-12 rounded-lg object-cover"
                    />
                  </TableCell>

                  {/* Title */}
                  <TableCell>
                    <div className="text-xs font-medium">{product.title}</div>
                  </TableCell>

                  {/* SKU */}
                  <TableCell>
                    <div className="font-mono text-sm">{product.sku}</div>
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <Badge variant="outline">{product.category.name}</Badge>
                  </TableCell>

                  {/* Brand */}
                  <TableCell>
                    <Badge variant="default">{product.brand.name}</Badge>
                  </TableCell>

                  {/* Colors */}
                  <TableCell>
                    <div className="flex flex-col gap-1 w-fit">
                      {product.colors.map((color) => (
                        <div
                          key={color.id}
                          className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs"
                        >
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: color.hex }}
                          />
                          {color.name}
                        </div>
                      ))}
                    </div>
                  </TableCell>

                  {/* Sizes */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {product.sizes.map((size) => (
                        <Badge key={size.id} variant="secondary" className="text-xs">
                          {size.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>

                  {/* Price */}
                  <TableCell>
                    <div className="font-medium">${product.price.toFixed(2)}</div>
                  </TableCell>

                  {/* Shipping */}
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      ${product.shippingCost.toFixed(2)}
                    </div>
                  </TableCell>

                  {/* Stock */}
                  <TableCell>
                    {product.inStock ? (
                      <Badge variant="outline" className="bg-green-50 text-green-800 hover:bg-green-100 select-none">
                        <Check className="mr-1 size-3" />
                        In Stock
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="bg-red-100 text-red-800 select-none">
                        <X className="mr-1 h-3 w-3" />
                        Out of Stock
                      </Badge>
                    )}
                  </TableCell>

                  {/* Images Count */}
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <ImageIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        {images.length}
                      </span>
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 p-0 hover:bg-muted"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onEdit && (
                          <DropdownMenuItem
                            onClick={() => onEdit(product.id)}
                            className="gap-2"
                          >
                            <Pencil className="h-4 w-4 text-blue-500" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <>
                            <DropdownMenuItem
                              onClick={() => setDeleteConfirm(product.id)}
                              className="gap-2 text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="space-y-1">
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this product? This action cannot be undone.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="my-4">
              {deleteConfirm && (
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
                  <img 
                    src={parseProductImages(products.find(p => p.id === deleteConfirm)!)[0]} 
                    alt="Product" 
                    className="size-16 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium text-sm">
                      {products.find(p => p.id === deleteConfirm)?.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      SKU: {products.find(p => p.id === deleteConfirm)?.sku}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="ghost"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (deleteConfirm && onDelete) {
                    onDelete(deleteConfirm);
                    setDeleteConfirm(null);
                  }
                }}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}