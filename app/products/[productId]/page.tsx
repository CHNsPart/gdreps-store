// app/products/[productId]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Loader2 } from 'lucide-react';
import { ProductView } from '@/components/products/view/product-page';
import { ProductProvider } from '@/components/providers/product-provider';
import { UserProduct } from '@/types/product';

interface ProductPageProps {
  params: {
    productId: string;
  };
}

function transformPrismaToUserProduct(prismaProduct: any): UserProduct {
  return {
    ...prismaProduct,
    images: typeof prismaProduct.images === 'string' 
      ? JSON.parse(prismaProduct.images) 
      : prismaProduct.images,
    createdAt: prismaProduct.createdAt.toISOString(),
    updatedAt: prismaProduct.updatedAt.toISOString(),
    category: {
      id: prismaProduct.category.id,
      name: prismaProduct.category.name,
      slug: prismaProduct.category.slug,
    },
    brand: {
      id: prismaProduct.brand.id,
      name: prismaProduct.brand.name,
      slug: prismaProduct.brand.slug,
    },
    sizes: prismaProduct.sizes.map((size: any) => ({
      id: size.id,
      name: size.name,
      type: size.type,
      createdAt: size.createdAt.toISOString(),
      updatedAt: size.updatedAt.toISOString(),
    })),
    colors: prismaProduct.colors.map((color: any) => ({
      id: color.id,
      name: color.name,
      hex: color.hex,
      createdAt: color.createdAt.toISOString(),
      updatedAt: color.updatedAt.toISOString(),
    })),
  };
}

async function getProduct(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        brand: true,
        sizes: true,
        colors: true,
      },
    });

    if (!product) {
      return null;
    }

    // Get related products from same brand and category
    const relatedProducts = await prisma.product.findMany({
      where: {
        OR: [
          { 
            brandId: product.brandId,
            id: { not: product.id }
          },
          {
            categoryId: product.categoryId,
            id: { not: product.id }
          }
        ]
      },
      include: {
        category: true,
        brand: true,
        sizes: true,
        colors: true,
      },
      take: 4,  // Limit to 4 related products
    });

    // Get brand's other products for "More from this brand" section
    const brandProducts = await prisma.product.findMany({
      where: {
        brandId: product.brandId,
        id: { not: product.id }
      },
      include: {
        category: true,
        brand: true,
        sizes: true,
        colors: true,
      },
      take: 4,  // Limit to 4 brand products
    });

    return {
      product: transformPrismaToUserProduct(product),
      relatedProducts: relatedProducts.map(transformPrismaToUserProduct),
      brandProducts: brandProducts.map(transformPrismaToUserProduct),
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const data = await getProduct(await(params.productId));

  if (!data) {
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
      <ProductProvider>
        <ProductView 
          product={data.product}
          relatedProducts={data.relatedProducts}
          brandProducts={data.brandProducts}
        />
      </ProductProvider>
    </Suspense>
  );
}