'use client';

import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { Package2, MapPin, CreditCard } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { type Order } from '@/hooks/use-orders';
import { cn } from '@/lib/utils';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
}

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-4">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Order Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-medium">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">
                {dayjs(order.createdAt).format('MMM DD, YYYY')}
              </p>
            </div>
          </div>

          <Separator />

          {/* Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Package2 className="h-4 w-4 text-blue-500" />
                <p className="text-sm font-medium">Order Status</p>
              </div>
              <Badge className={cn("mt-2 shadow-none hover:bg-transparent", getStatusColor(order.orderStatus))}>
                {order.orderStatus}
              </Badge>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-500" />
                <p className="text-sm font-medium">Payment Status</p>
              </div>
              <Badge className={cn("mt-2 shadow-none hover:bg-transparent", getStatusColor(order.paymentStatus))}>
                {order.paymentStatus === 'paid' ? 'Completed' : order.paymentStatus}
              </Badge>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500" />
                <p className="text-sm font-medium">Shipping Address</p>
              </div>
              <p className="mt-2 text-sm break-words">{order.shippingAddress}</p>
            </Card>
          </div>

          {/* Order Items - Made scrollable on mobile */}
          <div className="space-y-4 max-h-[50vh] overflow-y-auto">
            <h3 className="font-medium sticky top-0 bg-background py-2">Order Items</h3>
            {order.items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-4 rounded-lg border p-4"
              >
                <img
                  src={JSON.parse(item.product.images)[0]}
                  alt={item.product.title}
                  className="h-16 w-16 rounded-md object-cover"
                />
                <div className="flex-1 min-w-0"> {/* Added min-w-0 for text truncation */}
                  <p className="font-medium truncate">{item.product.title}</p>
                  <p className="text-sm text-muted-foreground">{item.product.brand.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                    <span>Size: {item.size}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>Color: {item.color}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium whitespace-nowrap">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Total */}
          <div className="sticky bottom-0 bg-background pt-4">
            <div className="rounded-lg bg-muted p-4">
              <div className="flex justify-between">
                <span className="font-medium">Total Amount</span>
                <span className="font-medium">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}