import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Loader2 } from 'lucide-react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/use-cart-store';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showVariantSelector, setShowVariantSelector] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  
  const addToCart = useCartStore(state => state.addItem);
  const images = typeof product.images === 'string' 
    ? JSON.parse(product.images) 
    : product.images;

  const handleImageHover = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev === 0 ? 1 : 0));
    }
  };

  const handleProductClick = () => {
    if (!showVariantSelector) {
      router.push(`/products/${product.id}`);
    }
  };

  const handleAddToCart = async () => {
    // If variants aren't selected, show the selector
    if (!selectedSize || !selectedColor) {
      setShowVariantSelector(true);
      return;
    }

    try {
      setIsAddingToCart(true);

      // Get selected variants
      const size = product.sizes.find(s => s.id === selectedSize);
      const color = product.colors.find(c => c.id === selectedColor);

      if (!size || !color) {
        throw new Error('Please select size and color');
      }

      // Create cart item
      const cartItem = {
        id: uuidv4(),
        productId: product.id,
        title: product.title,
        price: product.price,
        image: images[0],
        quantity: 1,
        size: size.name,
        color: {
          name: color.name,
          hex: color.hex,
        },
        brand: {
          name: product.brand.name,
        },
      };

      // Add to cart
      addToCart(cartItem);
      
      // Close selector and reset selections
      setShowVariantSelector(false);
      setSelectedSize(null);
      setSelectedColor(null);

    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add to cart",
        variant: "destructive"
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="group relative cursor-pointer"
        onClick={handleProductClick}
      >
        {/* Product Image */}
        <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
          <motion.div
            className="relative h-full w-full"
            onHoverStart={handleImageHover}
            onHoverEnd={handleImageHover}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex]}
                alt={product.title}
                className="h-full w-full object-cover object-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </AnimatePresence>

            <div className="absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-10">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute bottom-2 right-2 h-8 w-8 scale-0 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowVariantSelector(true);
                      }}
                      disabled={isAddingToCart || !product.inStock}
                    >
                      {isAddingToCart ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ShoppingBag className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add to Cart</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
              {product.title}
            </h3>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsWishlisted(!isWishlisted);
              }}
              className="rounded-full p-1 transition-colors hover:bg-gray-100"
            >
              <Heart
                className={`h-4 w-4 ${
                  isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'
                }`}
              />
            </motion.button>
          </div>

          <div className="flex items-center gap-2">
            <div
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/brands/${product.brand.slug}`);
              }}
              className="cursor-pointer"
            >
              <Badge variant="secondary" className="font-normal">
                {product.brand.name}
              </Badge>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/categories/${product.category.slug}`);
              }}
              className="cursor-pointer text-xs text-muted-foreground hover:underline"
            >
              {product.category.name}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-base font-semibold">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground">
                +${product.shippingCost.toFixed(2)} shipping
              </span>
            </div>
            <Badge 
              variant={product.inStock ? "default" : "destructive"}
              className="pointer-events-none"
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-1">
            {product.colors.length > 0 && (
              <div className="flex items-center gap-1">
                {product.colors.slice(0, 3).map((color) => (
                  <TooltipProvider key={color.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="h-3 w-3 rounded-full border border-gray-200"
                          style={{ backgroundColor: color.hex }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>{color.name}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
                {product.colors.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{product.colors.length - 3}
                  </span>
                )}
              </div>
            )}
            {product.sizes.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">
                  {product.sizes.length} sizes
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Variant Selection Sheet */}
      <Sheet open={showVariantSelector} onOpenChange={setShowVariantSelector}>
        <SheetContent 
          side="right" 
          className="w-[400px]"
          onClick={(e) => e.stopPropagation()}
        >
          <SheetHeader>
            <SheetTitle>Select Options</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            {/* Sizes */}
            <div className="space-y-4">
              <h3 className="font-medium">Select Size</h3>
              <div className="flex flex-auto flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size.id}
                    variant={selectedSize === size.id ? "default" : "outline"}
                    className="w-fit"
                    onClick={() => setSelectedSize(size.id)}
                  >
                    {size.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-4">
              <h3 className="font-medium">Select Color</h3>
              <div className="flex flex-auto flex-wrap gap-2">
                {product.colors.map((color) => (
                  <Button
                    key={color.id}
                    variant={selectedColor === color.id ? "default" : "outline"}
                    className="w-fit"
                    onClick={() => setSelectedColor(color.id)}
                  >
                    <div
                      className="mr-2 h-4 w-4 rounded-full border"
                      style={{ backgroundColor: color.hex }}
                    />
                    {color.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              className="w-full"
              disabled={!selectedSize || !selectedColor || isAddingToCart}
              onClick={handleAddToCart}
            >
              {isAddingToCart ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ShoppingBag className="mr-2 h-4 w-4" />
              )}
              Add to Cart
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}