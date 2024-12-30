// hooks/use-brands.ts
'use client';

import { useQuery } from '@tanstack/react-query';

export interface Brand {
  id: string;
  name: string;
  slug: string;
}

export function useBrands() {
  return useQuery<Brand[]>({
    queryKey: ['brands'],
    queryFn: async () => {
      const response = await fetch('/api/brands');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  });
}