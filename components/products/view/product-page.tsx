"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Share2,
  Truck,
  Shield,
  ArrowRight,
  RefreshCcw,
  ChevronRight,
  MinusCircle,
  PlusCircle,
  ShoppingBag,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { ProductCard } from "@/components/products/card/product-card";
import { Product } from "@/types/product";
// import { useCart } from '@/hooks/use-cart';
import { useCartStore } from '@/store/use-cart-store';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "@/hooks/use-toast";

interface ProductViewProps {
  product: Product;
  relatedProducts: Product[];
  brandProducts: Product[];
}

export function ProductView({
  product,
  relatedProducts,
  brandProducts,
}: ProductViewProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // const { addToCart } = useCart();
  const addToCart = useCartStore(state => state.addItem);


  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) return;

    setIsAddingToCart(true);
    try {
      const cartItem = {
        id: uuidv4(), // Generate unique ID for cart item
        productId: product.id,
        title: product.title,
        price: product.price,
        image: typeof product.images === 'string' 
          ? JSON.parse(product.images)[0] 
          : product.images[0],
        quantity,
        size: selectedSize,
        color: {
          name: product.colors.find(c => c.id === selectedColor)?.name || '',
          hex: product.colors.find(c => c.id === selectedColor)?.hex || '',
        },
        brand: {
          name: product.brand.name,
        },
      };

      // Add to local store
      addToCart(cartItem);

      // Show success toast
      toast({
        title: "Success",
        description: "Added to cart successfully",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive"
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const images =
    typeof product.images === "string"
      ? JSON.parse(product.images)
      : product.images;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta)));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 pb-8 md:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="py-4 px-4 md:px-6 lg:px-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link
                href="/categories"
                className="text-muted-foreground hover:text-foreground"
              >
                Home
              </Link>
            </li>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <li>
              <Link
                href={`/categories/${product.category.slug}`}
                className="text-muted-foreground hover:text-foreground"
              >
                {product.category.name}
              </Link>
            </li>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <li>
              <Link
                href={`/brands/${product.brand.slug}`}
                className="text-muted-foreground hover:text-foreground"
              >
                {product.brand.name}
              </Link>
            </li>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <li className="text-foreground font-medium truncate">
              {product.title}
            </li>
          </ol>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-xl overflow-hidden bg-gray-100">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden bg-gray-100 ring-2 ring-offset-2 transition-all
                    ${
                      selectedImage === index
                        ? "ring-blue-500"
                        : "ring-transparent hover:ring-gray-300"
                    }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">{product.title}</h1>
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setIsWishlisted(!isWishlisted)}
                          className={isWishlisted ? "text-red-500" : ""}
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              isWishlisted ? "fill-current" : ""
                            }`}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isWishlisted
                          ? "Remove from Wishlist"
                          : "Add to Wishlist"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: product.title,
                                url: window.location.href,
                              });
                            }
                          }}
                        >
                          <Share2 className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Share</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link href={`/brands/${product.brand.slug}`}>
                  <Badge variant="secondary" className="font-normal">
                    {product.brand.name}
                  </Badge>
                </Link>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  ${product.price.toFixed(2)}
                </span>
                {product.shippingCost > 0 && (
                  <span className="text-sm text-muted-foreground">
                    + ${product.shippingCost.toFixed(2)} shipping
                  </span>
                )}
              </div>
              <Badge variant={product.inStock ? "default" : "destructive"}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div className="space-y-4">
                <label className="block text-sm font-medium">
                  Color:{" "}
                  {product.colors.find((c) => c.id === selectedColor)?.name}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <TooltipProvider key={color.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setSelectedColor(color.id)}
                            className={`w-8 h-8 rounded-full border-2 transition-all
                              ${
                                selectedColor === color.id
                                  ? "ring-2 ring-offset-2 ring-blue-500"
                                  : "hover:scale-110"
                              }`}
                            style={{ backgroundColor: color.hex }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>{color.name}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div className="space-y-4">
                <label className="block text-sm font-medium">
                  Size: {product.sizes.find((s) => s.id === selectedSize)?.name}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className={`px-4 py-2 rounded-md border text-sm font-medium transition-all
                        ${
                          selectedSize === size.id
                            ? "border-blue-500 bg-blue-50 text-blue-500"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-4">
              <label className="block text-sm font-medium">Quantity</label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium w-8 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 10}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <Button
                className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
                disabled={
                  !product.inStock || 
                  !selectedSize || 
                  !selectedColor || 
                  isAddingToCart
                }
                onClick={handleAddToCart}
              >
                {isAddingToCart ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </Button>
              {(!selectedSize || !selectedColor) && (
                <p className="text-sm text-red-500">
                  Please select {!selectedSize && "size"}
                  {!selectedSize && !selectedColor && " and "}
                  {!selectedColor && "color"}
                </p>
              )}
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-6">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                <Truck className="h-6 w-6 text-blue-500" />
                <div>
                  <h3 className="font-medium">Free Shipping</h3>
                  <p className="text-sm text-muted-foreground">
                    On orders over $200
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                <Shield className="h-6 w-6 text-blue-500" />
                <div>
                  <h3 className="font-medium">Secure Payment</h3>
                  <p className="text-sm text-muted-foreground">
                    100% protected
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                <RefreshCcw className="h-6 w-6 text-blue-500" />
                <div>
                  <h3 className="font-medium">Easy Returns</h3>
                  <p className="text-sm text-muted-foreground">
                    30 day return policy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details and Description - Placeholder section */}
        <section className="mt-16 border-t pt-16">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-8">Product Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-lg font-medium mb-4 text-blue-600">Details</h3>
                <div className="grid grid-cols-1">
                  <div className="space-y-2">
                    <p className="font-medium text-muted-foreground text-justify">{product.productDetails}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4 text-blue-600">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Brand</p>
                    <p className="font-medium">{product.brand.name}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{product.category.name}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">SKU</p>
                    <p className="font-medium">{product.sku}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Available Colors
                    </p>
                    <p className="font-medium">{product.colors.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 border-t pt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">You Might Also Like</h2>
              <Button variant="ghost" className="group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                  />
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* More from Brand */}
        {brandProducts.length > 0 && (
          <section className="mt-16 border-t pt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">
                  More from {product.brand.name}
                </h2>
                <p className="text-muted-foreground mt-1">
                  Discover other products from this brand
                </p>
              </div>
              <Link href={`/brands/${product.brand.slug}`}>
                <Button variant="ghost" className="group">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {brandProducts.map((brandProduct) => (
                  <ProductCard key={brandProduct.id} product={brandProduct} />
                ))}
              </div>
            </motion.div>
          </section>
        )}
      </div>
    </div>
  );
}
