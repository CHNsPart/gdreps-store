// app/brands/[brand]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Loader2 } from 'lucide-react';
import { BrandDetailView } from '@/components/views/brand-detail-page';

interface BrandPageProps {
  params: {
    brand: string;
  };
}

async function getBrandWithProducts(slug: string) {
  try {
    const brand = await prisma.brand.findUnique({
      where: { slug },
      include: {
        products: {
          include: {
            category: true,
            brand: true,
            sizes: true,
            colors: true,
          },
        },
      },
    });

    return brand;
  } catch (error) {
    console.error('Error fetching brand:', error);
    throw error;
  }
}

export default async function BrandPage({ params }: BrandPageProps) {
  const brand = await getBrandWithProducts(params.brand);

  if (!brand) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <BrandDetailView brand={brand} />
    </Suspense>
  );
}