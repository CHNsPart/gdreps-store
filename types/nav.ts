import { Category } from "@/hooks/use-categories";
import { Brand } from "@/hooks/use-brands";

export interface NavItem {
  title: string;
  href: string;
  items?: NavItem[];
}

export interface NavConfig {
  mainNav: NavItem[];
}

export interface MobileNavProps {
  isOpen: boolean;
  categories: Category[];
  brands: Brand[];
  onClose: () => void;
}