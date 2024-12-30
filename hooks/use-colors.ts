import { useQuery } from '@tanstack/react-query';

export interface Color {
  id: string;
  name: string;
  hex: string;
}

export function useColors() {
  return useQuery<Color[]>({
    queryKey: ['colors'],
    queryFn: async () => {
      const response = await fetch('/api/admin/colors');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  });
}