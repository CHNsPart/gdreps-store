'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = {
  MENU: [
    { label: "Home", href: "/" },
    { label: "Service", href: "/service" },
    { label: "Our Work", href: "/work" },
    { label: "Project", href: "/project" },
    { label: "About Us", href: "/about" },
  ],
  CATEGORIES: [
    { label: "Replica Clothing", href: "/products/clothing" },
    { label: "Premium Sneakers", href: "/products/sneakers" },
    { label: "Accessories", href: "/products/accessories" },
    { label: "Designer Wear", href: "/products/designer" },
    { label: "Customization", href: "/products/custom" },
  ],
  "SOCIAL MEDIA": [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Twitter", href: "https://twitter.com" },
    { label: "Snapchat", href: "https://snapchat.com" },
  ],
};

export const CtaFooter = () => {
  return (
    <>
      {/* CTA Section */}
      <section className="relative bg-[#000033] text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-blue-900" />
        
        <motion.div 
          className="max-w-[1400px] mx-auto px-4 text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl md:text-6xl lg:text-7xl font-light mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Experience Luxury Without
            <br />
            The Premium Price Tag
          </motion.h2>
          
          <motion.p 
            className="text-gray-400 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Shop premium quality replicas of your favorite designer brands at unbeatable prices
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-100 group"
            >
              <ShoppingBag className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              SHOP NOW
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer Section */}
      <footer className="bg-black text-white py-20">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div>
              <Link href="/" className="text-2xl font-bold mb-6 block">
                GDREPS
              </Link>
              <p className="text-gray-400 text-sm max-w-xs">
                {"We are a premium replica fashion store that believes every piece tells a story, and our job is to bring that story to life in the most authentic way possible."}
              </p>
            </div>

            {/* Menu Columns */}
            {Object.entries(menuItems).map(([title, items]) => (
              <div key={title}>
                <h3 className="font-medium mb-6">{title}</h3>
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li key={item.label}>
                      <Link 
                        href={item.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 GDREPS. All Rights Reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                Terms & Conditions
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};