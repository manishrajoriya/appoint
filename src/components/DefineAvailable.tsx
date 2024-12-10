"use client";

import { defineAvailability } from "@/lib/actions/user.action";
import { useState } from "react";

function DefineAvailability() {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slotDuration, setSlotDuration] = useState(30);

  const handleSubmit = async () => {
    try {
      await defineAvailability({
        // Replace with actual admin ID
        startTime,
        endTime,
        slotDuration,
      });
      alert("Availability defined successfully!");
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Define Availability</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time:</label>
            <input
              id="startTime"
              title="Start Time"
              type="datetime-local"
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                         focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time:</label>
            <input
              id="endTime"
              title="End Time"
              type="datetime-local"
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                         focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <label htmlFor="slotDuration" className="block text-sm font-medium text-gray-700">Slot Duration (minutes):</label>
            <input
              id="slotDuration"
              title="Slot Duration (minutes)"
              type="number"
              value={slotDuration}
              onChange={(e) => setSlotDuration(Number(e.target.value))}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                         focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            Define Availability
          </button>
        </form>
      </div>
    </div>
  );
}

export default DefineAvailability;

