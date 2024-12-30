import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, CreditCard, Calendar, Hash } from 'lucide-react'

export default function PaymentDashboard() {
  // Mock data for the payment details
  const paymentDetails = {
    amount: "₹999",
    date: "2023-12-29",
    transactionId: "TRX123456789",
    paymentMethod: "Visa **** 1234",
    status: "Successful"
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Payment Details</CardTitle>
            <Badge variant="success" className="text-sm">
              {paymentDetails.status}
            </Badge>
          </div>
          <CardDescription>
            Thank you for your payment. Here are the details of your transaction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <DetailItem
              icon={<CreditCard className="h-5 w-5 text-gray-500" />}
              label="Amount Paid"
              value={paymentDetails.amount}
            />
            <DetailItem
              icon={<Calendar className="h-5 w-5 text-gray-500" />}
              label="Payment Date"
              value={paymentDetails.date}
            />
            <DetailItem
              icon={<Hash className="h-5 w-5 text-gray-500" />}
              label="Transaction ID"
              value={paymentDetails.transactionId}
            />
            <DetailItem
              icon={<CreditCard className="h-5 w-5 text-gray-500" />}
              label="Payment Method"
              value={paymentDetails.paymentMethod}
            />
          </div>
          <div className="mt-6 flex items-center justify-center text-green-600">
            <CheckCircle className="h-6 w-6 mr-2" />
            <span className="text-lg font-semibold">Payment Successful</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center space-x-4 py-2">
      {icon}
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-base font-semibold">{value}</p>
      </div>
    </div>
  )
}

