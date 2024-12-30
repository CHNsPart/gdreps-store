// import { Stripe as StripeClient, loadStripe } from '@stripe/stripe-js';
// import Stripe from 'stripe';

// // Client-side stripe promise
// let stripePromise: Promise<StripeClient | null>;

// export const getStripe = () => {
//   if (!stripePromise && typeof window !== 'undefined') {
//     const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
//     if (!key) {
//       throw new Error('Stripe publishable key is not defined');
//     }
//     stripePromise = loadStripe(key);
//   }
//   return stripePromise;
// };

// // Server-side stripe instance
// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   // @ts-ignore - TypeScript's type for apiVersion is not up to date
//   apiVersion: '2024-12-18',
//   typescript: true,
// });


// import Stripe from 'stripe';
// import { Stripe as StripeClient, loadStripe } from '@stripe/stripe-js';

// // Client-side Stripe Promise
// let stripePromise: Promise<StripeClient | null>;

// export const getStripe = () => {
//   if (!stripePromise && typeof window !== 'undefined') {
//     const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
//     if (!key) {
//       throw new Error('Stripe publishable key is not defined');
//     }
//     stripePromise = loadStripe(key);
//   }
//   return stripePromise;
// };

// // Server-side Stripe Function
// export const getServerStripe = () => {
//   const key = process.env.STRIPE_SECRET_KEY;
//   if (!key) {
//     throw new Error('Stripe secret key is not defined');
//   }
//   return new Stripe(key, {
//     // @ts-ignore
//     apiVersion: '2023-09-16', // Use the valid API version from your Stripe Dashboard
//     typescript: true,
//   });
// };







// import Stripe from 'stripe';
// import { Stripe as StripeClient, loadStripe } from '@stripe/stripe-js';

// // Client-side Stripe Promise
// let stripePromise: Promise<StripeClient | null>;

// export const getStripe = () => {
//   if (!stripePromise && typeof window !== 'undefined') {
//     const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
//     if (!key) {
//       console.error('Stripe publishable key is not defined. Check environment variables.');
//       throw new Error('Stripe publishable key is not defined');
//     }
//     stripePromise = loadStripe(key);
//   }
//   return stripePromise;
// };

// // Server-side Stripe Function
// export const getServerStripe = () => {
//   const key = process.env.STRIPE_SECRET_KEY;
//   if (!key) {
//     throw new Error('Stripe secret key is not defined');
//   }
//   return new Stripe(key, {
//     // @ts-ignore
//     apiVersion: '2023-10-16', // Use a valid API version
//     typescript: true,
//   });
// };

// // Export a static Stripe instance for webhooks
// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   // @ts-ignore
//   apiVersion: '2023-10-16',
//   typescript: true,
// });

// lib/stripe.ts

import Stripe from 'stripe';
import { Stripe as StripeClient, loadStripe } from '@stripe/stripe-js';

// **Client-side Stripe Initialization**
let stripePromise: Promise<StripeClient | null>;

export const getStripe = () => {
  if (!stripePromise && typeof window !== 'undefined') {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.error('Stripe publishable key is not defined.');
      throw new Error('Stripe publishable key is missing.');
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

// **Server-side Stripe Initialization**
let serverStripe: Stripe | null = null;

export const getServerStripe = () => {
  if (!serverStripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('Stripe secret key is not defined.');
    }
    serverStripe = new Stripe(secretKey, {
     // @ts-ignore
     apiVersion: '2023-10-16',
      typescript: true,
    });
  }
  return serverStripe;
};
