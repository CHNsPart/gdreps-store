import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, MinusCircle, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/store/use-cart-store';
import { cn } from '@/lib/utils';
import type { CartItem as CartItemType } from '@/types/cart';

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCartStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setIsUpdating(true);
      updateQuantity(item.id, newQuantity);
      setTimeout(() => setIsUpdating(false), 300);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group"
    >
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <motion.div 
              className="relative aspect-square w-24 overflow-hidden rounded-lg bg-gray-100"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full aspect-square object-cover"
              />
            </motion.div>

            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium line-clamp-2">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.brand.name}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                </Button>
              </div>

              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div 
                    className="h-4 w-4 rounded-full border"
                    style={{ backgroundColor: item.color.hex }}
                  />
                  <span>{item.color.name}</span>
                </div>
                <p>Size: {item.size}</p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={item.quantity <= 1}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  </motion.div>

                  <div className="relative w-8 h-8">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`quantity-${item.id}-${item.quantity}`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={cn(
                          "absolute inset-0 flex items-center justify-center font-medium",
                          isUpdating && "text-blue-600"
                        )}
                      >
                        {item.quantity}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(1)}
                      disabled={item.quantity >= 10}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>

                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={`price-${item.id}-${item.quantity}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="font-medium"
                    >
                      ${(item.price * item.quantity).toFixed(2)}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}