import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useCallback, useEffect, useState } from 'react';
import { toast } from './use-toast';

let stripePromise: Promise<Stripe | null>;

export const useStripe = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stripe, setStripe] = useState<Stripe | null>(null);

  useEffect(() => {
    if (!stripePromise) {
      stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
    }
    
    stripePromise.then((stripeInstance) => {
      setStripe(stripeInstance);
      setIsLoading(false);
    }).catch((error) => {
      console.error('Failed to load Stripe:', error);
      toast({
        title: "Error",
        description: "Failed to initialize payment system",
        variant: "destructive"
      });
      setIsLoading(false);
    });
  }, []);

  const createPaymentIntent = useCallback(async (amount: number) => {
    try {
      const response = await fetch('/api/checkout/payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }, []);

  return {
    stripe,
    isLoading,
    createPaymentIntent
  };
};