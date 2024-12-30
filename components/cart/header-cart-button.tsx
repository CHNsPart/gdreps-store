// components/cart/header-cart-button.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/use-cart-store';
import { useKindeAuth } from '@kinde-oss/kinde-auth-nextjs';
import { useRouter } from 'next/navigation';

export function HeaderCartButton() {
  const items = useCartStore((state) => state.items);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useKindeAuth();
  const router = useRouter();

  // Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);


  if (!mounted || isLoading) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative"
      >
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    );
  }

  const totalItems = getTotalItems();

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className={isAuthenticated ? "relative" : "hidden"}
      onClick={() => router.push('/cart')}
      asChild
    >
      <Link href="/cart">
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <ShoppingCart className="h-5 w-5" />
        )}
        <AnimatePresence mode="wait">
          {totalItems > 0 && (
            <motion.span
              key="cart-count"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              className="absolute -top-1 -right-1 size-4 rounded-full bg-blue-600 text-[10px] font-semibold text-primary-foreground flex items-center justify-center"
            >
              {totalItems > 9 ? '9+' : totalItems}
            </motion.span>
          )}
        </AnimatePresence>
      </Link>
    </Button>
  );
}