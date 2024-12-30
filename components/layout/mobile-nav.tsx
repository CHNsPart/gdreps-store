// components/layout/mobile-nav.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { MobileNavProps } from '@/types/nav';

export function MobileNav({ isOpen, categories, brands, onClose }: MobileNavProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const mainNavItems = [
    {
      title: "Categories",
      href: "/categories",
      items: categories.map(cat => ({
        title: cat.name,
        href: `/categories/${cat.slug}`
      }))
    },
    {
      title: "Brands",
      href: "/brands",
      items: brands.map(brand => ({
        title: brand.name,
        href: `/brands/${brand.slug}`
      }))
    },
    {
      title: "Cart",
      href: "/cart",
      items: []
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in md:hidden bg-background"
        >
          <div className="relative z-20 grid gap-6 p-4">
            {mainNavItems.map((item) => (
              <div key={item.href} className="space-y-3">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedItem(expandedItem === item.title ? null : item.title)}
                >
                  <span
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    {item.title}
                  </span>
                  {item.items && (
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform duration-200 ${
                        expandedItem === item.title ? 'rotate-180' : ''
                      }`} 
                    />
                  )}
                </div>
                
                <AnimatePresence>
                  {item.items && expandedItem === item.title && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-2 pl-4">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors py-2"
                            onClick={onClose}
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}