//components/views/categories-page.tsx
'use client';

import { useCallback, useState } from 'react';
import { ProductsLayout } from '@/components/layout/products/products-layout';
import { ProductFilters } from '@/components/products/filters/product-filters';
import { ProductCard } from '@/components/products/card/product-card';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { PrismaProduct, Product } from '@/types/product';

const queryClient = new QueryClient();

function transformPrismaProduct(prismaProduct: PrismaProduct): Product {
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
    sizes: prismaProduct.sizes.map(size => ({
      ...size,
      createdAt: size.createdAt.toISOString(),
      updatedAt: size.updatedAt.toISOString(),
    })),
    colors: prismaProduct.colors.map(color => ({
      ...color,
      createdAt: color.createdAt.toISOString(),
      updatedAt: color.updatedAt.toISOString(),
    })),
  };
}

interface ProductGridProps {
  products: PrismaProduct[];
}

function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h3 className="text-xl font-medium">No products found</h3>
        <p className="text-muted-foreground mt-2">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={transformPrismaProduct(product)}
        />
      ))}
    </div>
  );
}

export function CategoriesView({ products }: { products: PrismaProduct[] }) {
  const [filteredProducts, setFilteredProducts] = useState<PrismaProduct[]>(products);

  const handleFilterChange = useCallback((filters: any) => {
    const filtered = products.filter(product => {
      // Search filter
      if (filters.search && !product.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Price range filter
      if (filters.priceRange.min && product.price < parseFloat(filters.priceRange.min)) {
        return false;
      }
      if (filters.priceRange.max && product.price > parseFloat(filters.priceRange.max)) {
        return false;
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.categoryId)) {
        return false;
      }

      return true;
    });

    setFilteredProducts(filtered);
  }, [products]);

  return (
    <QueryClientProvider client={queryClient}>
      <ProductsLayout
        title="All Categories"
        description="Browse our collection across all categories"
        sidebar={
          <ProductFilters 
            showBrands={false}
            onFilterChange={handleFilterChange}
          />
        }
        banner={
          <div className="h-48 w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Explore Our Collection
              </h1>
              <p className="text-gray-200">
                Find the perfect piece from our diverse range of products
              </p>
            </div>
          </div>
        }
      >
        <ProductGrid products={filteredProducts} />
      </ProductsLayout>
    </QueryClientProvider>
  );
}