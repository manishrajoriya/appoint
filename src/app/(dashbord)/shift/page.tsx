'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { createDays, findAllDays, removeTimeSlot } from '@/lib/actions/time';
import {  storeDayWithSlots } from '@/lib/actions/user.action';


type DayShift = {
  id: number;
  name: string;
  adminId: string;
  shift: {
    id: number;
    start: string;
    end: string;
    adminId: string;
    dayId: number;
  }[];
};

// Constants
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function OwnerAvailability() {
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [slots, setSlots] = useState<DayShift[]>([]);

  // Fetch time slots on mount
  useEffect(() => {
    async function fetchTimeSlots() {
      try {
        const slots = await findAllDays();
        setSlots(slots);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch time slots.",
          variant: "destructive",
        });
      }
    }
    fetchTimeSlots();
  }, []);

  // Add Time Slot
  const addTimeSlot = async () => {
    if (!startTime || !endTime) {
      return toast({
        title: "Error",
        description: "Please enter both start and end times.",
        variant: "destructive",
      });
    }

    if (startTime >= endTime) {
      return toast({
        title: "Error",
        description: "End time must be after start time.",
        variant: "destructive",
      });
    }

    try {
      await storeDayWithSlots({
        name: selectedDay,
        slots: [{ start: startTime, end: endTime }],
      });
      // setStartTime('');
      // setEndTime('');

      toast({
        title: "Success",
        description: "Time slot added successfully.",
      });

      // Refresh slots
      const updatedSlots = await findAllDays();
      setSlots(updatedSlots);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add time slot. Please try again.",
        variant: "destructive",
      });
      console.error('Failed to add time slot:', error);
    }
  };

  // Remove Time Slot
  const removeTimeSlots = async (dayId:number, id:number, dayname:string) => {
    try {
      await removeTimeSlot(id, dayId, dayname);

      toast({
        title: "Success",
        description: "Time slot removed successfully.",
      });

      // Refresh slots
      const updatedSlots = await findAllDays();
      setSlots(updatedSlots);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove time slot. Please try again.",
        variant: "destructive",
      });
      console.error('Failed to remove time slot:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Set Your Availability</h2>

      {/* Create Days Button */}
      <div>
        <Button onClick={createDays}>Create Days</Button>
      </div>

      {/* Day and Time Selection */}
      <div className="space-y-4">
        <Select onValueChange={setSelectedDay} defaultValue={selectedDay}>
          <SelectTrigger>
            <SelectValue placeholder="Select a day" />
          </SelectTrigger>
          <SelectContent>
            {daysOfWeek.map(day => (
              <SelectItem key={day} value={day}>
                {day}
              </SelectItem>
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

      {/* Display Slots */}
      <div>
        <h2 className="text-2xl font-bold">Your Availability</h2>
        <div className="space-y-4">
          {slots.map((day) => (
            <div key={day.id} className="border p-4 rounded-md">
              <h3 className="font-semibold mb-2">{day.name}</h3>
              {day.shift.length === 0 ? (
                <p className="text-sm text-gray-500">No time slots set</p>
              ) : (
                <ul className="space-y-2">
                  {day.shift.map((slot) => (
                    <li key={slot.id} className="flex justify-between items-center">
                      <span>
                        {slot.start} - {slot.end}
                      </span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeTimeSlots(day.id, slot.id, day.name)}
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
    </div>
  );
}
