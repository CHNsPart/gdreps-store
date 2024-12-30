// components/views/category-detail-page.tsx
'use client';

import { useCallback, useState } from 'react';
import { ProductsLayout } from '@/components/layout/products/products-layout';
import { ProductFilters } from '@/components/products/filters/product-filters';
import { ProductCard } from '@/components/products/card/product-card';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { PrismaProduct } from '@/types/product';

const queryClient = new QueryClient();

interface PrismaCategory {
  id: string;
  name: string;
  slug: string;
  products: PrismaProduct[];
  createdAt: Date;
  updatedAt: Date;
}

function transformPrismaProduct(prismaProduct: PrismaProduct) {
  return {
    ...prismaProduct,
    images: typeof prismaProduct.images === 'string' 
      ? JSON.parse(prismaProduct.images) 
      : prismaProduct.images,
    createdAt: prismaProduct.createdAt.toISOString(),
    updatedAt: prismaProduct.updatedAt.toISOString(),
    category: {
      ...prismaProduct.category,
      createdAt: prismaProduct.category.createdAt.toISOString(),
      updatedAt: prismaProduct.category.updatedAt.toISOString(),
    },
    brand: {
      ...prismaProduct.brand,
      createdAt: prismaProduct.brand.createdAt.toISOString(),
      updatedAt: prismaProduct.brand.updatedAt.toISOString(),
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

function ProductGrid({ products }: { products: PrismaProduct[] }) {
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

export function CategoryDetailView({ category }: { category: PrismaCategory }) {
  const [filteredProducts, setFilteredProducts] = useState<PrismaProduct[]>(category.products);

  const handleFilterChange = useCallback((filters: any) => {
    const filtered = category.products.filter(product => {
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

      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(product.brandId)) {
        return false;
      }

      return true;
    });

    setFilteredProducts(filtered);
  }, [category.products]);

  return (
    <QueryClientProvider client={queryClient}>
      <ProductsLayout
        title={category.name}
        description={`Explore our collection of ${category.name}`}
        sidebar={
          <ProductFilters 
            showCategories={false}
            onFilterChange={handleFilterChange}
          />
        }
        banner={
          <div className="h-48 w-full flex items-center justify-center bg-gradient-to-r from-indigo-500 to-indigo-700">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {category.name} Collection
              </h1>
              <p className="text-gray-200">
                {filteredProducts.length} Products Available
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