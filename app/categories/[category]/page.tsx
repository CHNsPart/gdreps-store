// app/categories/[category]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Loader2 } from 'lucide-react';
import { CategoryDetailView } from '@/components/views/category-detail-page';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

async function getCategoryWithProducts(slug: string) {
  try {
    const category = await prisma.category.findUnique({
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

    return category;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoryWithProducts(await(params.category));

  if (!category) {
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
      <CategoryDetailView category={category} />
    </Suspense>
  );
}