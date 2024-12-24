'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createPayuOrder } from '@/lib/actions/createPayuOrder'

const plans = [
  {
    name: 'Basic',
    price: 9.99,
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
  },
  {
    name: 'Pro',
    price: 19.99,
    features: ['All Basic features', 'Feature 4', 'Feature 5'],
  },
  {
    name: 'Enterprise',
    price: 49.99,
    features: ['All Pro features', 'Feature 6', 'Feature 7', 'Priority Support'],
  },
]

export default function PricingSection() {
  const [loading, setLoading] = useState<string | null>(null)

  const handlePurchase = async (plan: string, price: number) => {
    setLoading(plan)
    try {
      const result = await createPayuOrder({
        productInfo: plan,
        amount: price,
        email: 'customer@example.com', // In a real app, you'd get this from the user
        firstName: 'John', // In a real app, you'd get this from the user
        lastName: 'Doe', // In a real app, you'd get this from the user
        phone: '876296129', // In a real app, you'd get this from the user
      })
console.log(result);

      if (result.success) {
        // Redirect to PayU payment page
        window.location.href = result.paymentUrl!
      } else {
        console.error('Failed to create PayU order:', result.error)
        alert('Failed to create order. Please try again.')
      }
    } catch (error) {
      console.error('Error creating PayU order:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="container mx-auto py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name} className="flex flex-col">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>${plan.price.toFixed(2)} / month</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="list-disc list-inside space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handlePurchase(plan.name, plan.price)}
                disabled={loading === plan.name}
              >
                {loading === plan.name ? 'Processing...' : 'Choose Plan'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

