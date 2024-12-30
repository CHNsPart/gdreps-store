// components/layout/products/products-layout.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface ProductsLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  banner?: React.ReactNode;
  title: string;
  description?: string;
}

export function ProductsLayout({
  children,
  sidebar,
  banner,
  title,
  description
}: ProductsLayoutProps) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Banner Section */}
      {banner && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-black text-white"
        >
          {banner}
        </motion.div>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="mt-2 text-muted-foreground">{description}</p>
            )}
          </div>

          {/* Mobile Filter Button */}
          <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 lg:hidden"
              >
                Filters
                <ChevronDown className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs p-0">
              {/* Add SheetHeader with required Title */}
              <SheetHeader className="p-6">
                <SheetTitle className='text-blue-500 text-left'>Filters</SheetTitle>
              </SheetHeader>
              <div className="p-6">{sidebar}</div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Content Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar - Hidden on mobile */}
          <div className="hidden lg:block">
            <div className="sticky top-8">{sidebar}</div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}