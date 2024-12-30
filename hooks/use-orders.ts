'use client';

import { useQuery } from '@tanstack/react-query';
import { toast } from './use-toast';

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
  product: {
    title: string;
    images: string;
    brand: {
      name: string;
    }
  }
}

export interface OrderFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface Order {
  id: string;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  shippingAddress: string;
  trackingNumber: string | null;
  createdAt: string;
  items: OrderItem[];
}

interface OrdersResponse {
  orders: Order[];
  total: number;
  hasMore: boolean;
}

export function useOrders(
  limit = 10, 
  offset = 0,
  filters: OrderFilters = {}
) {
  return useQuery<OrdersResponse>({
    queryKey: ['orders', limit, offset, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        ...(filters.status && { status: filters.status }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      });

      const response = await fetch(`/api/orders?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      return response.json();
    },
  });
}