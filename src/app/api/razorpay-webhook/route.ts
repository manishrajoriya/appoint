import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Import Prisma client
import crypto from 'crypto';
import { auth } from '@clerk/nextjs/server';

const secret = 'NEETMBBS2@23'; // Replace with your Razorpay webhook secret

export async function POST(req: Request) {
  try {
    const body = await req.text(); // Read raw body for signature verification
    const signature = req.headers.get('x-razorpay-signature') || '';
    // const {userId} = await auth()
    // if (!userId) {
    //   return NextResponse.json({ error: 'Unauthorized userid not found' }, { status: 401 });
    // }
    // const admin = await prisma.admin.findUnique({
    //   where: { id: userId },
    // })
    // if (!admin) {
    //   return NextResponse.json({ error: 'Unauthorized admin not found' }, { status: 401 });
    // }
    // Verify the signature
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (generatedSignature !== signature) {
      console.error('Webhook signature verification failed.');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const payload = JSON.parse(body);

    // Handle payment-related events
    const event = payload.event;
    const payment = payload.payload.payment?.entity;
console.log('payment',payment);

    // if (payment) {
    //   const { id, amount, currency, status, method, description, email, contact, order_id } = payment;

    //   // Upsert payment data based on the event type
    //   // await prisma.payment.upsert({
    //   //   where: { razorpayId: id },
    //   //   update: {
    //   //     amount,
    //   //     currency,
    //   //     status,
    //   //     method: method || null,
    //   //     description: description || null,
    //   //     email: email || null,
    //   //     contact: contact || null,
    //   //     eventType: event,
    //   //   },
    //   //   create: {
    //   //     razorpayId: id,
    //   //     amount,
    //   //     currency,
    //   //     status,
    //   //     method: method || null,
    //   //     description: description || null,
    //   //     email: email || null,
    //   //     contact: contact || null,
    //   //     eventType: event,
    //   //     adminId: "user_2q920IGfrn8NcalWA4goAmolFLF",
    //   //     planId: order_id,
    //   //   },
    //   // });

    //   console.log(`Payment event '${event}' handled and stored successfully: ${id}`);
    // }

    // Add custom logic for specific events
    switch (event) {
      case 'payment.created':
        console.log('Payment Created:', payment);
        break;

      case 'payment.failed':
        console.log('Payment Failed:', payment);
        break;

      case 'payment.authorized':
        console.log('Payment Authorized:', payment);
        // Add capture logic if required (manual capture scenario)
        break;

      case 'payment.captured':
        console.log('Payment Captured:', payment);
        break;

      default:
        console.log(`Unhandled payment event: ${event}`);
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
