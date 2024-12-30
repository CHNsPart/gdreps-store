//components/products/filters/product-filters.tsx
'use client';

import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useCategories } from '@/hooks/use-categories';
import { useBrands } from '@/hooks/use-brands';
import { cn } from '@/lib/utils';

interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
  showCategories?: boolean;
  showBrands?: boolean;
}

interface FilterState {
  search: string;
  priceRange: {
    min: string;
    max: string;
  };
  categories: string[];
  brands: string[];
}

export function ProductFilters({ 
  onFilterChange, 
  showCategories = true, 
  showBrands = true 
}: FilterProps) {
  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    priceRange: { min: '', max: '' },
    categories: [],
    brands: []
  });

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const resetFilters = () => {
    setFilters({
      search: '',
      priceRange: { min: '', max: '' },
      categories: [],
      brands: []
    });
  };

  const hasActiveFilters = () => {
    return filters.search !== '' ||
           filters.priceRange.min !== '' ||
           filters.priceRange.max !== '' ||
           filters.categories.length > 0 ||
           filters.brands.length > 0;
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="pl-8"
          />
        </div>
      </div>

      <Separator className="my-4" />

      {/* Price Range */}
      <div className="space-y-2">
        <Label>Price Range</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.priceRange.min}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              priceRange: { ...prev.priceRange, min: e.target.value }
            }))}
            className="w-full"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.priceRange.max}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              priceRange: { ...prev.priceRange, max: e.target.value }
            }))}
            className="w-full"
          />
        </div>
      </div>

      {showCategories && categories.length > 0 && (
        <>
          <Separator className="my-4" />
          
          {/* Categories */}
          <div className="space-y-2">
            <Label>Categories</Label>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={filters.categories.includes(category.id)}
                    onCheckedChange={(checked) => {
                      setFilters(prev => ({
                        ...prev,
                        categories: checked
                          ? [...prev.categories, category.id]
                          : prev.categories.filter(id => id !== category.id)
                      }));
                    }}
                  />
                  <label
                    htmlFor={category.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {showBrands && brands.length > 0 && (
        <>
          <Separator className="my-4" />
          
          {/* Brands */}
          <div className="space-y-2">
            <Label>Brands</Label>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={brand.id}
                    checked={filters.brands.includes(brand.id)}
                    onCheckedChange={(checked) => {
                      setFilters(prev => ({
                        ...prev,
                        brands: checked
                          ? [...prev.brands, brand.id]
                          : prev.brands.filter(id => id !== brand.id)
                      }));
                    }}
                  />
                  <label
                    htmlFor={brand.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {brand.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Reset Button */}
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "w-full",
          hasActiveFilters() ? "opacity-100" : "opacity-0"
        )}
        onClick={resetFilters}
      >
        <X className="mr-2 h-4 w-4" />
        Reset Filters
      </Button>
    </div>
  );
}