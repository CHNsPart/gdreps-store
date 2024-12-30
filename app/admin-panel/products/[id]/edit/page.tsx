import EditProductPage from '@/components/admin-panel/products/edit/edit-product';
import { ProductProvider } from '@/components/providers/product-provider';

interface EditPageProps {
  params: {
    id: string;
  }
}

export default async function EditPage({ params }: EditPageProps) {
  const id = await params.id;

  return (
    <ProductProvider>
      <EditProductPage id={id} />
    </ProductProvider>
  );
}