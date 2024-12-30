'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Elements } from '@stripe/react-stripe-js';
import { useCartStore } from '@/store/use-cart-store';
import { getStripe } from '@/lib/stripe';
import CheckoutForm from '@/components/checkout/checkout-form';
import OrderSummary from '@/components/checkout/order-summary';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const cart = useCartStore();
  const stripePromise = getStripe();
  const router = useRouter();

  useEffect(() => {
    // Check cart items and redirect if empty
    if (typeof window !== 'undefined' && cart.items.length === 0) {
      router.push('/cart');
      return;
    }

    const createPaymentIntent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/checkout/payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: cart.getTotal(),
            items: cart.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              size: item.size,
              color: item.color.name
            }))
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create payment intent');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to initialize checkout',
          variant: 'destructive'
        });
        if (typeof window !== 'undefined') {
          router.push('/cart');
        }
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [cart, router]);

  return (
    <AnimatePresence mode="wait">
      {isLoading || !clientSecret || !stripePromise ? (
        <motion.div 
          className="flex items-center justify-center min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </motion.div>
      ) : (
        <motion.div
          className="max-w-7xl mx-auto p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#2563eb',
                      colorBackground: '#ffffff',
                      colorText: '#000000',
                      colorDanger: '#dc2626',
                      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                    },
                  },
                }}
              >
                <CheckoutForm />
              </Elements>
            </div>
            <div>
              <OrderSummary />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}