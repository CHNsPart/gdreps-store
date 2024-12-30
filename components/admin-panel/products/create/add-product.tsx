'use client';

import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import ProductForm from '@/components/admin-panel/products/product-form';

export default function AddProductPage() {
  const router = useRouter();

  const handleSubmit = async (formData: any, images: any[]) => {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          images: images.map(img => img.base64),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      toast({
        title: "Success",
        description: "Product created successfully"
      });

      router.push('/admin-panel/products');
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive"
      });
      throw error;
    }
  };

  return (
    <ProductForm
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
    />
  );
}