"use client";

import { useState, useEffect } from "react";
import { saveAvailability, fetchAvailability } from "@/lib/action";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type fetchedAvailability = {
    startTime: string;
    endTime: string;
    id: string;
    adminId: string;
    dayOfWeek: number;
    timeSlots: string[];
    createdAt: Date;
    updatedAt: Date;
}

export default function AdminAvailability() {
  const [availability, setAvailability] = useState<{ dayOfWeek: number; startTime: string; endTime: string }[]>([]);

  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const fetchedAvailability = await fetchAvailability();
        setAvailability(fetchedAvailability);
      } catch (error) {
        console.error(error);
      }
    };

    loadAvailability();
  }, []);

  const handleSave = async () => {
    try {
      await saveAvailability(availability);
      alert("Availability saved successfully!");
    } catch (error) {
      console.error("Error saving availability:", error);
      alert("Failed to save availability");
    }
  };

  const handleChange = (index: number, field: keyof typeof availability[number], value: string | number) => {
    const updatedAvailability = [...availability];
    updatedAvailability[index][field] = value;
    setAvailability(updatedAvailability);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Set Availability</h1>
      {availability.map((slot, index) => (
        <div key={index} className="mb-4 flex items-center space-x-4">
          <select
            title="day of week"
            value={slot.dayOfWeek}
            onChange={(e) => handleChange(index, "dayOfWeek", parseInt(e.target.value))}
            className="p-2 border rounded"
          >
            {daysOfWeek.map((day, i) => (
              <option key={i} value={i}>
                {day}
              </option>
            ))}
          </select>
          <input
            title="start time"
            type="time"
            value={slot.startTime}
            onChange={(e) => handleChange(index, "startTime", e.target.value)}
            className="p-2 border rounded"
          />
          <input
           title="end time"
            type="time"
            value={slot.endTime}
            onChange={(e) => handleChange(index, "endTime", e.target.value)}
            className="p-2 border rounded"
          />
        </div>
      ))}
      <button
        onClick={() => setAvailability([...availability, { dayOfWeek: 0, startTime: "", endTime: "" }])}
        className="px-4 py-2 bg-gray-300 text-black rounded"
      >
        Add Slot
      </button>
      <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded ml-4">
        Save
      </button>
    </div>
  );
}
