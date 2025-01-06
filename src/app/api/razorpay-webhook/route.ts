import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { RazorpayError } from '@/types/razorpay';

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'NEETMBBS2@23';

if (!RAZORPAY_WEBHOOK_SECRET) {
  throw new Error('RAZORPAY_WEBHOOK_SECRET is not set in environment variables.');
}

export async function POST(req: Request) {
  try {
    // 🛡️ Validate Webhook Signature
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';

    const generatedSignature = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    if (generatedSignature !== signature) {
      console.error(`Invalid signature: Expected ${generatedSignature}, got ${signature}`);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // 📦 Parse Payload
    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const payment = payload.payload.payment?.entity || {};

    const {
      id,
      amount,
      currency,
      status,
      method,
      description,
      email,
      contact,
      order_id,
    } = payment;

    if (!id) {
      console.error('Payment ID is missing from the payload');
      return NextResponse.json({ error: 'Invalid payment payload' }, { status: 400 });
    }

    console.log(`Handling event: ${event}`);

    // 📝 Validate Plan Reference
    if (order_id) {
      const existingPlan = await prisma.plan.findUnique({
        where: { id: order_id }
      });

      if (!existingPlan) {
        console.error(`Plan ID '${order_id}' does not exist.`);
        return NextResponse.json({ error: 'Invalid Plan ID' }, { status: 400 });
      }
    }

    // 💾 Upsert Payment Record
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
        planId: order_id || null,
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
        planId: "order_PeF8LqeG6dg7V9",
      },
    });

    // 🔄 Handle Different Payment Events
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
  } catch (error: RazorpayError| any) {
    console.error('Error handling webhook:', error.message || error, error.stack || '');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
