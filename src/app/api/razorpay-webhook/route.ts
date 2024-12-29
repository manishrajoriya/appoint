import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { auth } from '@clerk/nextjs/server';

const secret = "NEETMBBS2@23"

if (!secret) {
  throw new Error('RAZORPAY_WEBHOOK_SECRET is not set in environment variables.');
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';

    const generatedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');

    if (generatedSignature !== signature) {
      console.error(`Invalid signature: Expected ${generatedSignature}, got ${signature}`);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const payload = JSON.parse(body);
    const event = payload.event;
    const payment = payload.payload.payment?.entity;

    console.log('payment', payment);

    if (payment) {
      const { id, amount, currency, status, method, description, email, contact, order_id } = payment;

      await prisma.payment.upsert({
        where: { razorpayId: id },
        update: {
          amount,
          currency,
          status,
          method: method || null,
          description: description || null,
          email: email || null,
          contact: contact || null,
          eventType: event,
        },
        create: {
          razorpayId: id,
          amount,
          currency,
          status,
          method: method || null,
          description: description || null,
          email: email || null,
          contact: contact || null,
          eventType: event,
          adminId: "user_2q920IGfrn8NcalWA4goAmolFLF",
          planId: order_id,
        },
      });

      console.log(`Payment event '${event}' handled and stored successfully: ${id}`);
    }

    switch (event) {
      case 'payment.created':
        console.log('Payment Created:', payment);
        break;
      case 'payment.failed':
        console.log('Payment Failed:', payment);
        break;
      case 'payment.authorized':
        console.log('Payment Authorized:', payment);
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
