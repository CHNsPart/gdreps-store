type ProductInput = {
  title: string;
  images: string[];
  sku: string;
  shippingCost: number;
  price: number;
  size: string[];
  colors: string[];
  inStock: boolean;
};

type ProductDB = {
  title: string;
  images: string;
  sku: string;
  shippingCost: number;
  price: number;
  size: string;
  colors: string;
  inStock: boolean;
};

export function formatProductForDB(product: ProductInput): ProductDB {
  return {
    ...product,
    images: JSON.stringify(product.images),
    size: product.size.join(','),
    colors: product.colors.join(','),
  };
}

export function formatProductFromDB(product: ProductDB): ProductInput {
  return {
    ...product,
    images: JSON.parse(product.images),
    size: product.size.split(',').filter(Boolean),
    colors: product.colors.split(',').filter(Boolean),
  };
}