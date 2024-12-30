'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import ProductForm from '@/components/admin-panel/products/product-form';
import { Loader2 } from 'lucide-react';

interface EditProductPageProps {
  id: string;
}

export default function EditProductPage({ id }: EditProductPageProps) {
  const router = useRouter();
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/admin/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        
        // Transform the data to match form format
        setInitialData({
          title: data.title,
          prodCategory: data.categoryId,
          brand: data.brandId,
          sku: data.sku,
          shippingCost: data.shippingCost.toString(),
          price: data.price.toString(),
          size: data.sizes.map((s: any) => s.id),
          colors: data.colors.map((c: any) => c.id),
          inStock: data.inStock,
          productDetails: data.productDetails,
          previewImages: typeof data.images === 'string' 
            ? JSON.parse(data.images).map((base64: string) => ({
                url: base64,
                base64
              }))
            : []
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch product",
          variant: "destructive"
        });
        router.push('/admin-panel/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  const handleSubmit = async (formData: any, images: any[]) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          images: images.map(img => img.base64),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      toast({
        title: "Success",
        description: "Product updated successfully"
      });

      router.push('/admin-panel/products');
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive"
      });
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <ProductForm
      initialData={initialData}
      previewImages={initialData?.previewImages}
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
      isEdit
    />
  );
}