'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createOrder, verifyPayment } from '@/lib/actions/razorpay'
import Razorpay from 'razorpay'

const plans = [
  {
    name: 'Basic',
    price: 999,
    plan_id: 'plan_1',
    description: 'Perfect for small businesses',
    features: ['Up to 5 users', '10GB storage', 'Basic support', 'Basic analytics'],
  },
  {
    name: 'Pro',
    price: 1999,
    plan_id: 'plan_2',
    description: 'Great for growing teams',
    features: ['Up to 20 users', '50GB storage', 'Priority support', 'Advanced analytics'],
  },
  {
    name: 'Enterprise',
    price: 4999,
    plan_id: 'plan_3',
    description: 'For large organizations',
    features: ['Unlimited users', '500GB storage', '24/7 support', 'Custom analytics'],
  },
]

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePayment = async (plan: typeof plans[0]) => {
    try {
      setLoading(plan.name)
      const response = await createOrder(plan.price)

      if (!response.success) {
        throw new Error('Failed to create order')
      }
      console.log(response);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: plan.price * 100,
        currency: 'INR',
        name: 'AtPoint',
        description: `${plan.name} Plan Subscription`,
        plan_id: plan.plan_id,
        order_id: response.order?.id,
        handler: async function (razorpayResponse: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
          try {
            const verificationResponse = await verifyPayment({
              orderId: razorpayResponse.razorpay_order_id,
              paymentId: razorpayResponse.razorpay_payment_id,
              signature: razorpayResponse.razorpay_signature,
            })

            if (verificationResponse.success) {
              console.log('Payment verified successfully:', verificationResponse)
              router.push(`/success?paymentId=${razorpayResponse.razorpay_payment_id}&orderId=${razorpayResponse.razorpay_order_id}`)
            } else {
              console.error('Payment verification failed:', verificationResponse)
              router.push(`/failure?errorCode=VERIFICATION_FAILED&errorDescription=${encodeURIComponent('Payment verification failed. Please contact support.')}`)
            }
          } catch (error) {
            console.error('Error during payment verification:', error)
            router.push(`/failure?errorCode=VERIFICATION_ERROR&errorDescription=${encodeURIComponent('Payment verification encountered an error. Please contact support.')}`)
          }
        },
        prefill: {
          name: 'manish kumar',
          email: 'gkrajoriya3@mail.com',
          contact: '3455678901',
        },
        theme: {
          color: '#0F172A',
        },
      }

      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error)
        router.push(`/failure?errorCode=${response.error.code}&errorDescription=${encodeURIComponent(response.error.description)}`)
      })
      paymentObject.open()
    } catch (error) {
      console.error('Payment error:', error)
      router.push(`/failure?errorCode=PAYMENT_ERROR&errorDescription=${encodeURIComponent('Payment failed. Please try again.')}`)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Choose the plan that best suits your needs. All plans include a 14-day free trial.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-6 sm:mt-20 lg:max-w-4xl lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mt-2 flex items-baseline">
                  <span className="text-3xl font-bold tracking-tight">₹{plan.price}</span>
                  <span className="text-sm font-semibold leading-6 text-muted-foreground">/month</span>
                </div>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handlePayment(plan)}
                  disabled={loading === plan.name}
                >
                  {loading === plan.name ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    'Get Started'
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

