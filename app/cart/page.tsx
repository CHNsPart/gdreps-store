'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/use-cart-store';
import { CartItem } from '@/components/cart/cart-item';

function CartSummary() {
  const { getSubtotal, getShippingCost, getTotal, getTotalItems } = useCartStore();
  
  return (
    <Card className="rounded-xl">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold">Order Summary</h2>
        <div className="mt-4 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div 
              key={`subtotal-${getTotalItems()}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-between text-base"
            >
              <span>Subtotal ({getTotalItems()} items)</span>
              <span>${getSubtotal().toFixed(2)}</span>
            </motion.div>
            
            <motion.div 
              key={`shipping-${getShippingCost()}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-between text-base"
            >
              <span>Shipping</span>
              <span>${getShippingCost().toFixed(2)}</span>
            </motion.div>
            
            <Separator />
            
            <motion.div 
              key={`total-${getTotal()}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-between text-lg font-semibold"
            >
              <span>Total</span>
              <span>${getTotal().toFixed(2)}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="lg"
          asChild
        >
          <Link href="/checkout">
            Proceed to Checkout
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  if (items.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <div className="relative mb-4 h-24 w-24 text-muted-foreground">
          <ShoppingBag className="h-24 w-24 animate-pulse" />
        </div>
        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
        <p className="text-muted-foreground">
          Looks like you haven't added anything to your cart yet
        </p>
        <Button asChild>
          <Link href="/categories">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <p className="mt-2 text-muted-foreground">
          {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </AnimatePresence>
        </div>

        <motion.div 
          className="lg:sticky lg:top-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <CartSummary />
        </motion.div>
      </div>
    </div>
  );
}