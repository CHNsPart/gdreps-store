//components/views/brands-page.tsx
'use client';

import { useCallback, useState } from 'react';
import { ProductsLayout } from '@/components/layout/products/products-layout';
import { ProductFilters } from '@/components/products/filters/product-filters';
import { ProductCard } from '@/components/products/card/product-card';
import { motion } from 'framer-motion';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { PrismaBrand, Product } from '@/types/product';

const queryClient = new QueryClient();

function transformPrismaProduct(prismaProduct: PrismaBrand['products'][0]): Product {
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

function BrandSection({ brand }: { brand: PrismaBrand }) {
  if (brand.products.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {brand.name}
          </h2>
          <p className="text-muted-foreground mt-1">
            {brand.products.length} Products
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {brand.products.slice(0, 3).map((product) => (
          <ProductCard 
            key={product.id} 
            product={transformPrismaProduct(product)}
          />
        ))}
      </div>

      {brand.products.length > 3 && (
        <div className="mt-6 text-center">
          <a
            href={`/brands/${brand.slug}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all {brand.products.length} products from {brand.name} →
          </a>
        </div>
      )}
    </motion.section>
  );
}

export function BrandsView({ brands }: { brands: PrismaBrand[] }) {
  const [filteredBrands, setFilteredBrands] = useState<PrismaBrand[]>(brands);

  const handleFilterChange = useCallback((filters: any) => {
    const filtered = brands.map(brand => ({
      ...brand,
      products: brand.products.filter(product => {
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
      })
    })).filter(brand => brand.products.length > 0);

    setFilteredBrands(filtered);
  }, [brands]);

  return (
    <QueryClientProvider client={queryClient}>
      <ProductsLayout
        title="Featured Brands"
        description="Discover our curated selection of premium brands"
        sidebar={
          <ProductFilters 
            showCategories={false}
            onFilterChange={handleFilterChange}
          />
        }
        banner={
          <div className="h-48 w-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-purple-700">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Premium Brands Collection
              </h1>
              <p className="text-gray-200">
                Authentic quality from the brands you trust
              </p>
            </div>
          </div>
        }
      >
        <div className="space-y-12">
          {filteredBrands.map((brand) => (
            <BrandSection key={brand.id} brand={brand} />
          ))}
        </div>
      </ProductsLayout>
    </QueryClientProvider>
  );
}