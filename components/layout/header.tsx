// components/layout/header.tsx
'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, ChevronDown, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileNav } from './mobile-nav';
import { UserButton } from '../auth/user-button';
import { useCategories } from '@/hooks/use-categories';
import { useBrands } from '@/hooks/use-brands';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HeaderCartButton } from '../cart/header-cart-button';

const queryClient = new QueryClient();

function NavigationContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: brands = [], isLoading: brandsLoading } = useBrands();

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  const handleMouseEnter = (title: string) => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    setActiveMegaMenu(title);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 100);
  };

  // Group categories into columns for the mega menu
  const categoryColumns = categories.reduce<Array<Array<typeof categories[0]>>>(
    (acc, category, index) => {
      const columnIndex = Math.floor(index / 4); // 4 items per column
      if (!acc[columnIndex]) {
        acc[columnIndex] = [];
      }
      acc[columnIndex].push(category);
      return acc;
    },
    []
  );

  // Group brands into columns for the mega menu
  const brandColumns = brands.reduce<Array<Array<typeof brands[0]>>>(
    (acc, brand, index) => {
      const columnIndex = Math.floor(index / 4); // 4 items per column
      if (!acc[columnIndex]) {
        acc[columnIndex] = [];
      }
      acc[columnIndex].push(brand);
      return acc;
    },
    []
  );

  const mainNavItems = [
    {
      title: "Categories",
      href: "/categories",
      type: "mega-menu",
      data: categoryColumns,
      isLoading: categoriesLoading
    },
    {
      title: "Brands",
      href: "/brands",
      type: "mega-menu",
      data: brandColumns,
      isLoading: brandsLoading
    },
  ];

  const renderMegaMenu = (item: typeof mainNavItems[0]) => {
    if (item.type !== "mega-menu" || activeMegaMenu !== item.title) return null;
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="absolute -left-[50%] top-full w-screen bg-popover border rounded-lg shadow-lg mt-1 -ml-4"
        style={{ maxWidth: '600px' }}
      >
        <motion.div 
          className="grid grid-cols-2 gap-6 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {!item.isLoading && item.data.map((column, columnIndex) => (
            <div key={columnIndex} className="space-y-2">
              {column.map((item) => {
                const basePath = activeMegaMenu === "Categories" ? "categories" : "brands";
                
                return (
                  <Link
                    key={item.id}
                    href={`/${basePath}/${item.slug}`}
                    className="group flex items-center justify-between gap-1 hover:bg-blue-50 p-3 rounded-lg transition-colors"
                  >
                    <motion.span 
                      className="flex items-center group-hover:text-blue-500 justify-between w-full h-full text-sm font-medium transition-colors"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {item.name}
                      <ArrowRight 
                        className="h-4 w-4 text-primary hidden group-hover:inline-block ml-2 transition-all duration-300 ease-in-out transform group-hover:rotate-45" 
                      />
                    </motion.span>
                  </Link>
                );
              })}
            </div>
          ))}
          
          {/* Loading State */}
          {item.isLoading && (
            <motion.div 
              className="col-span-2 flex items-center justify-center p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </motion.div>
          )}
  
          {/* Empty State */}
          {!item.isLoading && item.data.length === 0 && (
            <motion.div 
              className="col-span-2 text-center p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-muted-foreground">No items available</p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center font-bold text-md hover:text-primary transition-colors bg-blue-50 text-blue-600 px-5 py-2.5 rounded-full"
        >
          GDREPS
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex justify-center items-center space-x-2 flex-1 rounded-full">
          {mainNavItems.map((item) => (
            <div
              key={item.href}
              className="relative group"
              onMouseEnter={() => handleMouseEnter(item.title)}
              onMouseLeave={handleMouseLeave}
            >
              <Link 
                href={item.href}
                className="flex items-center text-md font-medium py-2.5 px-5 hover:bg-blue-50 rounded-full hover:text-primary transition-colors"
              >
                {item.title}
                {item.type === "mega-menu" && (
                  <ChevronDown className="h-4 w-4 opacity-50" />
                )}
              </Link>
              
              {/* Mega Menu */}
              {renderMegaMenu(item)}
            </div>
          ))}
        </nav>

        {/* Right side icons */}
        <div className="flex items-center gap-4 ml-auto">
          <HeaderCartButton />

          <UserButton />

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size={'icon'}
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isOpen}
        categories={categories}
        brands={brands}
        onClose={() => setIsOpen(false)}
      />
    </header>
  );
}

// Wrap the header with QueryClientProvider
export default function Header() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContent />
    </QueryClientProvider>
  );
}