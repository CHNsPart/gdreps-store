// app/brands/page.tsx
import { Suspense } from 'react';
import { BrandsView } from '@/components/views/brands-page';
import { prisma } from '@/lib/prisma';
import { Loader2 } from 'lucide-react';

async function getBrandsWithProducts() {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        products: {
          include: {
            category: true,
            brand: true,
            sizes: true,
            colors: true,
          }
        }
      },
      orderBy: {
        name: 'asc',
      }
    });

    return brands;
  } catch (error) {
    console.error('Error fetching brands and products:', error);
    return [];
  }
}

export default async function BrandsPage() {
  const brands = await getBrandsWithProducts();

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <BrandsView brands={brands} />
    </Suspense>
  );
}