import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextResponse } from 'next/server';
import { getServerStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    
    if (!data?.amount || !data?.items) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    const { amount, items } = data;

    // Get or create Stripe customer
    const stripe = getServerStripe();
    let customerId = user.stripeCustomerId;

    if (!customerId && user.email) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id }
      });
      customerId = customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId }
      });
    }

    // Create the order first
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: amount,
        paymentStatus: 'pending',
        orderStatus: 'pending',
        shippingAddress: 'To be updated', // Placeholder
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color,
          }))
        }
      }
    });

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      customer: customerId,
      metadata: {
        orderId: order.id,
        userId: user.id
      },
      automatic_payment_methods: {
        enabled: true
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id
    });

  } catch (error) {
    console.error('[PAYMENT_INTENT_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}