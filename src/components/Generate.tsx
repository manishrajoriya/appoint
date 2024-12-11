"use client";
import { generateSlotsForDate } from "@/lib/actions/user.action";
import { useState } from "react";

export default function SlotManager() {
  const [date, setDate] = useState("");

  const handleGenerateSlots = async () => {
    if (!date) {
      alert("Please select a date");
      return;
    }

    const response = await generateSlotsForDate(date);
    alert(response.message);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Slot Manager</h1>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="mt-4 p-2 border rounded"
      />
      <button
        onClick={handleGenerateSlots}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Generate Slots
      </button>
    </div>
  );
}
