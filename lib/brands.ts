export const BRANDS = [
  'nike',
  'jordan',
  'adidas',
  'gucci',
  'louis-vuitton',
] as const;

export type Brand = typeof BRANDS[number];