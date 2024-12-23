'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

type TimeSlot = {
  id: string
  start: string
  end: string
}

type Availability = {
  [key: string]: TimeSlot[]
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function OwnerAvailability() {
  const [availability, setAvailability] = useState<Availability>(() => {
    const initialAvailability: Availability = {}
    daysOfWeek.forEach(day => {
      initialAvailability[day] = []
    })
    console.log(initialAvailability);
    return initialAvailability
  })

  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0])
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  const addTimeSlot = () => {
    if (!startTime || !endTime) {
      toast({
        title: "Error",
        description: "Please enter both start and end times.",
        variant: "destructive",
      })
      return
    }

    if (startTime >= endTime) {
      toast({
        title: "Error",
        description: "End time must be after start time.",
        variant: "destructive",
      })
      return
    }

    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      start: startTime,
      end: endTime,
    }

    setAvailability(prev => ({
      ...prev,
      [selectedDay]: [...prev[selectedDay], newSlot],
    }))

    setStartTime('')
    setEndTime('')

    toast({
      title: "Success",
      description: "Time slot added successfully.",
    })
  }

  const removeTimeSlot = (day: string, id: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: prev[day].filter(slot => slot.id !== id),
    }))

    toast({
      title: "Success",
      description: "Time slot removed successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Set Your Availability</h2>
      
      <div className="space-y-4">
        <Select onValueChange={setSelectedDay} defaultValue={selectedDay}>
          <SelectTrigger>
            <SelectValue placeholder="Select a day" />
          </SelectTrigger>
          <SelectContent>
            {daysOfWeek.map(day => (
              <SelectItem key={day} value={day}>{day}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={addTimeSlot}>Add Time Slot</Button>
      </div>

      <div className="space-y-4">
        {daysOfWeek.map(day => (
          <div key={day} className="border p-4 rounded-md">
            <h3 className="font-semibold mb-2">{day}</h3>
            {availability[day].length === 0 ? (
              <p className="text-sm text-gray-500">No time slots set</p>
            ) : (
              <ul className="space-y-2">
                {availability[day].map(slot => (
                  <li key={slot.id} className="flex justify-between items-center">
                    <span>{slot.start} - {slot.end}</span>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removeTimeSlot(day, slot.id)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

