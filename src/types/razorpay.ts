export interface RazorpayPayment {
  id: string
  entity: string
  amount: number
  currency: string
  status: string
  order_id: string
  method: string
  captured: boolean
  description: string
  created_at: number
}

export interface RazorpayError {
  code: string
  description: string
  source: string
  step: string
  reason: string
}

