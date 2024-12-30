'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { NavItem } from '@/types/nav';

interface MegaMenuProps {
  items: NavItem[];
  isOpen: boolean;
}

export function MegaMenu({ items, isOpen }: MegaMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute left-0 top-full w-full"
        >
          <div className="grid grid-cols-4 gap-4 p-6 bg-popover shadow-lg">
            {items.map((item) => (
              <div key={item.href} className="space-y-2">
                <Link
                  href={item.href}
                  className="text-sm font-medium hover:text-primary"
                >
                  {item.title}
                </Link>
                {item.items && (
                  <ul className="space-y-1">
                    {item.items.map((subItem) => (
                      <li key={subItem.href}>
                        <Link
                          href={subItem.href}
                          className="text-sm text-muted-foreground hover:text-primary"
                        >
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}