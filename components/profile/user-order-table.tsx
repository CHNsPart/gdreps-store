'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import { Loader2, ChevronDown, ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { OrderDetailModal } from './order-detail-modal';
import { useOrders, type Order, type OrderFilters } from '@/hooks/use-orders';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

const ORDER_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
} as const;

const ORDER_STATUSES = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' }
] as const;

export function UserOrderTable() {
  const [page, setPage] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [filters, setFilters] = useState<OrderFilters>({
    status: 'all' // Set default value to 'all' instead of empty string
  });
  
  const limit = 10;
  const { data, isLoading } = useOrders(
    limit, 
    page * limit, 
    filters.status === 'all' ? {} : filters // Only apply filter if not 'all'
  );

  const handleStatusChange = (status: string) => {
    setFilters(prev => ({ ...prev, status }));
    setPage(0); // Reset to first page when filter changes
  };

  const statusFilter = (
    <div className="flex items-center gap-4 mb-4">
      <Select
        value={filters.status}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          {ORDER_STATUSES.map(status => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  if (isLoading) {
    return (
      <div>
        {statusFilter}
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  if (!data?.orders?.length) {
    return (
      <div>
        {statusFilter}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-lg text-muted-foreground">No orders found</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {statusFilter}
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Products</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.orders.map((order: Order) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group hover:bg-muted/50 cursor-pointer"
              >
                <TableCell>
                  <div className="relative flex items-center gap-2">
                    <img
                      src={JSON.parse(order.items[0].product.images)[0]}
                      alt={order.items[0].product.title}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                    {order.items.length > 1 && (
                      <div className="absolute -top-2 -right-2 size-5 rounded-full bg-blue-600 text-[10px] font-semibold text-white flex items-center justify-center">
                        {order.items.length > 9 ? '9+' : order.items.length}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {dayjs(order.createdAt).format('MMM DD, YYYY')}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary"
                    className={cn(
                      ORDER_STATUS_COLORS[order.orderStatus as keyof typeof ORDER_STATUS_COLORS]
                    )}
                  >
                    {order.orderStatus}
                  </Badge>
                </TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-3">
                        <h4 className="font-medium">Need Help?</h4>
                        <p className="text-sm text-muted-foreground">
                          For any inquiries about your order, please contact us at:
                        </p>
                        <div className="flex items-center gap-2 bg-muted p-3 rounded-lg">
                          <Phone className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">+16496586458</span>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data.total > limit && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(prev => Math.max(0, prev - 1))}
            disabled={page === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(prev => prev + 1)}
            disabled={!data.hasMore}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Order Detail Modal */}
      <OrderDetailModal 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />
    </div>
  );
}