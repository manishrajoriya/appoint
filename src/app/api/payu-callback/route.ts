import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const formData = await request.formData()
  const status = formData.get('status')
  const txnId = formData.get('txnid')
  const amount = formData.get('amount')
  const productInfo = formData.get('productinfo')

  // Verify the payment status and update your database accordingly
  if (status === 'success') {
    console.log(`Payment successful for transaction ${txnId}`)
    // Update your database to mark the order as paid
    // Send a confirmation email to the customer
  } else {
    console.log(`Payment failed for transaction ${txnId}`)
    // Update your database to mark the order as failed
    // Optionally, send a notification to the customer about the failed payment
  }

  // Redirect the user to a appropriate page based on the payment status
  const redirectUrl = status === 'success' 
    ? '/payment-success' 
    : '/payment-failed'

  return NextResponse.redirect(new URL(redirectUrl, request.url))
}

