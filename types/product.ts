export interface Product {
  id: string;
  title: string;
  images: string[];
  sku: string;
  price: number;
  shippingCost: number;
  productDetails?: string;
  inStock: boolean;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  brandId: string;
  brand: {
    id: string;
    name: string;
    slug: string;
  };
  sizes: Array<{
    id: string;
    name: string;
    type: string;
  }>;
  colors: Array<{
    id: string;
    name: string;
    hex: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface UserProduct {
  id: string;
  title: string;
  images: string[];  // Array of image URLs/base64
  sku: string;
  price: number;
  shippingCost: number;
  inStock: boolean;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  brandId: string;
  brand: {
    id: string;
    name: string;
    slug: string;
  };
  sizes: Array<{
    id: string;
    name: string;
    type: string;
    createdAt: string;  // ISO string
    updatedAt: string;  // ISO string
  }>;
  colors: Array<{
    id: string;
    name: string;
    hex: string;
    createdAt: string;  // ISO string
    updatedAt: string;  // ISO string
  }>;
  createdAt: string;  // ISO string
  updatedAt: string;  // ISO string
}

export interface PrismaProduct {
  id: string;
  title: string;
  images: string;
  sku: string;
  price: number;
  shippingCost: number;
  inStock: boolean;
  categoryId: string;
  brandId: string;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
  };
  brand: {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
  };
  sizes: Array<{
    id: string;
    name: string;
    type: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  colors: Array<{
    id: string;
    name: string;
    hex: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

export interface PrismaBrand {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  products: Array<{
    id: string;
    title: string;
    images: string;
    sku: string;
    price: number;
    shippingCost: number;
    inStock: boolean;
    categoryId: string;
    brandId: string;
    createdAt: Date;
    updatedAt: Date;
    category: {
      id: string;
      name: string;
      slug: string;
      createdAt: Date;
      updatedAt: Date;
    };
    brand: {
      id: string;
      name: string;
      slug: string;
      createdAt: Date;
      updatedAt: Date;
    };
    sizes: Array<{
      id: string;
      name: string;
      type: string;
      createdAt: Date;
      updatedAt: Date;
    }>;
    colors: Array<{
      id: string;
      name: string;
      hex: string;
      createdAt: Date;
      updatedAt: Date;
    }>;
  }>;
}

export interface ProductFormData {
  title: string;
  prodCategory: string;
  brand: string;
  images: string[];
  sku: string;
  shippingCost: string;
  price: string;
  productDetails?: string;
  size: string[];
  colors: string[];
  inStock: boolean;
}