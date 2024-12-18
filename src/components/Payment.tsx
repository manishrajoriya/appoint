'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

const pricingPlans = [
  {
    name: 'Basic',
    monthlyPrice: 9,
    yearlyPrice: 90,
    features: ['1 user', '10 projects', '5GB storage', 'Basic support'],
  },
  {
    name: 'Pro',
    monthlyPrice: 19,
    yearlyPrice: 190,
    features: ['5 users', 'Unlimited projects', '50GB storage', 'Priority support', 'Advanced analytics'],
  },
  {
    name: 'Enterprise',
    monthlyPrice: 49,
    yearlyPrice: 490,
    features: ['Unlimited users', 'Unlimited projects', '500GB storage', '24/7 dedicated support', 'Custom integrations'],
  },
]

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the right plan for you
          </p>
        </div>
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-2">
            <span className={`text-sm ${isYearly ? 'text-gray-500' : 'font-semibold'}`}>Monthly</span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              aria-label="Toggle yearly pricing"
            />
            <span className={`text-sm ${isYearly ? 'font-semibold' : 'text-gray-500'}`}>Yearly</span>
          </div>
        </div>
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className="rounded-3xl p-8 ring-1 ring-gray-200 xl:p-10 bg-white"
            >
              <h3 className="text-lg font-semibold leading-8 text-gray-900">{plan.name}</h3>
              <p className="mt-4 flex items-baseline gap-x-2">
                <span className="text-4xl font-bold tracking-tight text-gray-900">
                  ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                </span>
                <span className="text-sm font-semibold leading-6 text-gray-600">
                  /{isYearly ? 'year' : 'month'}
                </span>
              </p>
              <Button className="mt-6 w-full" variant={plan.name === 'Pro' ? 'default' : 'outline'}>
                Get started
              </Button>
              <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

