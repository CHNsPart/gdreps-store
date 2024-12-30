"use client"

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Package2,
  Users,
  LayoutDashboard,
  Settings,
  Tags,
  BadgePercent,
  ShoppingBag,
  LineChart
} from "lucide-react";

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {}

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/admin-panel",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/admin-panel/products",
    icon: Package2,
  },
  {
    title: "Add Product",
    href: "/admin-panel/products/new",
    icon: ShoppingBag,
  },
  {
    title: "Settings",
    href: "/admin-panel/settings",
    icon: Settings,
  },
];

export function AdminSidebar({ className }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className={cn(
        "pb-12 min-h-screen border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mb-4">
            <Link 
              href="/admin-panel" 
              className="flex items-center px-3 py-2 text-lg font-medium"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="px-4 py-2 rounded-full"
              >
                <span className="font-semibold italic text-blue-600">GDREPS</span> Batcave
              </motion.div>
            </Link>
          </div>
          <div className="space-y-1">
            {sidebarLinks.map((link, index) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <motion.div
                  key={link.href}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "group flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-200",
                      isActive ? "bg-accent text-accent-foreground" : "transparent"
                    )}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="h-4 w-4" />
                    </motion.div>
                    <span>{link.title}</span>
                    {isActive && (
                      <motion.div
                        className="absolute left-0 h-6 w-1 rounded-r-lg bg-primary"
                        layoutId="activeTab"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}