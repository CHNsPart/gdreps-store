
import AddProductContent from '@/components/admin-panel/products/create/add-product';
import { ProductProvider } from '@/components/providers/product-provider';

export default function AddProductPage() {
  return (
    <ProductProvider>
      <AddProductContent />
    </ProductProvider>
  );
}

