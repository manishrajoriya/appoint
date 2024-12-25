'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { XCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function FailurePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const errorCode = searchParams.get('errorCode')
  const errorDescription = searchParams.get('errorDescription')

  useEffect(() => {
    if (!errorCode || !errorDescription) {
      router.push('/')
    }
  }, [errorCode, errorDescription, router])

  if (!errorCode || !errorDescription) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[380px]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl">Payment Failed</CardTitle>
          <CardDescription>There was an issue processing your payment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Error Code:</span>
              <span className="font-medium">{errorCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Error Description:</span>
              <span className="font-medium text-right flex-1 ml-4">{errorDescription}</span>
            </div>
          </div>
          <Button className="w-full" onClick={() => router.push('/')}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

