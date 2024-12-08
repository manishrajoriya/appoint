'use client'

import { useActionState, useState } from 'react'
import { useFormState } from 'react-dom'
import { createAdmin } from '@/lib/action'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Trash2 } from 'lucide-react'

const initialState = {
  error: {
    name: undefined,
    mobileNo: undefined,
    email: undefined,
    whatsapp_id: undefined,
    uniqueName: undefined
  },
  success: false,
  message: ''
}

export default function AdminOnboarding() {
  const [state, formAction] = useActionState(createAdmin, initialState)
  const [mobileNumbers, setMobileNumbers] = useState([''])

  const addMobileNumber = () => {
    setMobileNumbers([...mobileNumbers, ''])
  }

  const removeMobileNumber = (index: number) => {
    setMobileNumbers(mobileNumbers.filter((_, i) => i !== index))
  }

  const updateMobileNumber = (index: number, value: string) => {
    const updatedNumbers = [...mobileNumbers]
    updatedNumbers[index] = value
    setMobileNumbers(updatedNumbers)
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Admin Onboarding</CardTitle>
          <CardDescription>Please fill in your details to create an admin account.</CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
              {state?.error?.name && <p className="text-sm text-red-500">{state.error.name}</p>}
            </div>
            <div className="space-y-2">
              <Label>Mobile Numbers</Label>
              {mobileNumbers.map((number, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    name={`mobileNo[${index}]`}
                    value={number}
                    onChange={(e) => updateMobileNumber(index, e.target.value)}
                    placeholder="e.g., +1234567890"
                    required
                  />
                  {index > 0 && (
                    <Button type="button" variant="outline" size="icon" onClick={() => removeMobileNumber(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addMobileNumber}>
                <PlusCircle className="h-4 w-4 mr-2" /> Add Mobile Number
              </Button>
              {state?.error?.mobileNo && <p className="text-sm text-red-500">{state.error.mobileNo}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
              {state?.error?.email && <p className="text-sm text-red-500">{state.error.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp_id">WhatsApp ID (optional)</Label>
              <Input id="whatsapp_id" name="whatsapp_id" />
              {state?.error?.whatsapp_id && <p className="text-sm text-red-500">{state.error.whatsapp_id}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="uniqueName">Unique Name (optional)</Label>
              <Input id="uniqueName" name="uniqueName" />
              {state?.error?.uniqueName && <p className="text-sm text-red-500">{state.error.uniqueName}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Create Admin Account</Button>
          </CardFooter>
        </form>
      </Card>
      {state?.success && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
          Admin account created successfully!
        </div>
      )}
    </div>
  )
}

