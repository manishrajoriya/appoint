"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface TimeSlot {
  id: number
  startTime: string
  endTime: string
}

export default function AdminTimeSlotsForm() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  const addTimeSlot = () => {
    if (startTime && endTime) {
      setTimeSlots([...timeSlots, { id: Date.now(), startTime, endTime }])
      setStartTime('')
      setEndTime('')
    }
  }

  const removeTimeSlot = (id: number) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitted time slots:', timeSlots)
    // Here you would typically send the data to your backend
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add Available Time Slots</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                type="time"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                type="time"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="button" onClick={addTimeSlot} className="w-full">
            Add Time Slot
          </Button>
          <div className="space-y-2">
            {timeSlots.map((slot) => (
              <div key={slot.id} className="flex justify-between items-center bg-secondary p-2 rounded">
                <span>
                  {slot.startTime} - {slot.endTime}
                </span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeTimeSlot(slot.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" onClick={handleSubmit}>
          Save Time Slots
        </Button>
      </CardFooter>
    </Card>
  )
}

