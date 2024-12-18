import PricingPage from '@/components/Payment'
import PaymentForm from '@/components/RazorpayPayment'
import React from 'react'

function page() {
  return (
    <div>
      <PricingPage/>
      <PaymentForm/>
    </div>
  )
}

export default page