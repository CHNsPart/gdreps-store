// app/categories/page.tsx
import { Suspense } from 'react';
import { CategoriesView } from '@/components/views/categories-page';
import { prisma } from '@/lib/prisma';
import { Loader2 } from 'lucide-react';

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        brand: true,
        sizes: true,
        colors: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function CategoriesPage() {
  const products = await getProducts();
  
  return (
    <div>
      <Suspense 
        fallback={
          <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <CategoriesView products={products} />
      </Suspense>
    </div>
  );
}