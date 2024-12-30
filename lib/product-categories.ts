export const PRODUCT_CATEGORIES = [
  'men-clothings',
  'women-clothings',
  'sneakers',
  'sunglasses',
  'jackets',
  'watches',
  'hats',
  'boots',
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];