export type CartItem = {
  id: string;
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color: {
    name: string;
    hex: string;
  };
  brand: {
    name: string;
  };
};