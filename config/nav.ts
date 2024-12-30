import { NavConfig } from "@/types/nav";

export const navConfig: NavConfig = {
  mainNav: [
    {
      title: "Products",
      href: "/products",
      items: [
        { title: "Men Clothings", href: "/products/men-clothings" },
        { title: "Women Clothings", href: "/products/women-clothings" },
        { title: "Sneakers", href: "/products/sneakers" },
        { title: "Sunglasses", href: "/products/sunglasses" },
        { title: "Jackets", href: "/products/jackets" },
        { title: "Watches", href: "/products/watches" },
        { title: "Hats", href: "/products/hats" },
        { title: "Boots", href: "/products/boots" },
      ],
    },
    {
      title: "Brands",
      href: "/brands",
      items: [
        { title: "Nike", href: "/brands/nike" },
        { title: "Jordan", href: "/brands/jordan" },
        { title: "Adidas", href: "/brands/adidas" },
        { title: "Gucci", href: "/brands/gucci" },
        { title: "Louis Vuitton", href: "/brands/louis-vuitton" },
      ],
    },
  ],
};