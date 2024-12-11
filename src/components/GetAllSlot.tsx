"use client"

import { useState, useEffect } from "react"
import { getAllSlots } from "@/lib/actions/user.action"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from 'lucide-react'
import { format } from "date-fns"

type Slot = {
  id: string
  adminId: string
  startTime: Date
  endTime: Date
  isBooked: boolean
  userId: string | null
}

export default function DisplayAllSlots() {
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const fetchedSlots = await getAllSlots()
        setSlots(fetchedSlots)
      } catch (error) {
        console.error("Error fetching slots:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSlots()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Appointment Slots</h1>
      {slots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.map((slot) => (
            <Card key={slot.id} className={slot.isBooked ? "bg-red-50" : "bg-green-50"}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">
                    {format(new Date(slot.startTime), "MMMM d, yyyy")}
                  </span>
                  <Badge variant={slot.isBooked ? "destructive" : "default"}>
                    {slot.isBooked ? "Booked" : "Available"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <span className="text-sm text-gray-600">
                      {format(new Date(slot.startTime), "h:mm a")} -{" "}
                      {format(new Date(slot.endTime), "h:mm a")}
                    </span>
                  </div>
                  {slot.isBooked && (
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span className="text-sm text-gray-600">
                        Booked by User ID: {slot.userId}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center p-6">
          <p className="text-xl text-gray-600">No slots available at the moment.</p>
        </Card>
      )}
    </div>
  )
}

