'use server'

import { RazorpayPayment } from '@/types/razorpay'
import Razorpay from 'razorpay'
import crypto from 'crypto'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function createOrder(amount: number) {
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      
    })

    return { success: true, order }
  } catch (error) {
    console.error('Error creating order:', error)
    return { success: false, error: 'Failed to create order' }
  }
}


export async function verifyPayment({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string
  paymentId: string
  signature: string
}) {
  try {
    const body = orderId + "|" + paymentId
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex")

    if (expectedSignature === signature) {
      const payment = await razorpay.payments.fetch(paymentId)
      
      if (payment.status === "captured") {
        return {
          success: true,
          payment,
        }
      } else {
        return {
          success: false,
          error: "Payment not captured",
        }
      }
    } else {
      return {
        success: false,
        error: "Invalid signature",
      }
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return {
      success: false,
      error: "Failed to verify payment",
    }
  }
}