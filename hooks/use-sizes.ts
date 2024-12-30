import { useQuery } from '@tanstack/react-query';

export interface Size {
  id: string;
  name: string;
  type: string;
}

export function useSizes() {
  return useQuery<Size[]>({
    queryKey: ['sizes'],
    queryFn: async () => {
      const response = await fetch('/api/admin/sizes');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  });
}