import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { getServerStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return new NextResponse('Missing stripe signature', { status: 400 });
  }

  try {
    const stripe = getServerStripe();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as any;
        
        // Update order status
        await prisma.order.update({
          where: {
            id: paymentIntent.metadata.orderId,
          },
          data: {
            paymentStatus: 'paid',
            orderStatus: 'processing',
            stripePaymentIntentId: paymentIntent.id,
          },
        });
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as any;
        
        await prisma.order.update({
          where: {
            id: paymentIntent.metadata.orderId,
          },
          data: {
            paymentStatus: 'failed',
            orderStatus: 'cancelled',
          },
        });
        break;
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new NextResponse(
      'Webhook error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      { status: 400 }
    );
  }
}

export const runtime = 'edge';