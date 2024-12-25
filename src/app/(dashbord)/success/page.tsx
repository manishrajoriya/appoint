'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const paymentId = searchParams.get('paymentId')
  const orderId = searchParams.get('orderId')

  useEffect(() => {
    if (!paymentId || !orderId) {
      router.push('/')
    }
  }, [paymentId, orderId, router])

  if (!paymentId || !orderId) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[380px]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>Your payment has been processed successfully</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment ID:</span>
              <span className="font-medium">{paymentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID:</span>
              <span className="font-medium">{orderId}</span>
            </div>
          </div>
          <Button className="w-full" onClick={() => router.push('/')}>
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

