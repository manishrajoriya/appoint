"use client";

import { defineAvailability } from "@/lib/actions/user.action"; // Import the server action
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
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <label>Start Time:</label>
      <input title="Start Time" type="datetime-local" onChange={(e) => setStartTime(e.target.value)} />

      <label>End Time:</label>
      <input title="End Time" type="datetime-local" onChange={(e) => setEndTime(e.target.value)} />

      <label>Slot Duration (minutes):</label>
      <input
        title="Slot Duration (minutes)"
        type="number"
        value={slotDuration}
        onChange={(e) => setSlotDuration(Number(e.target.value))}
      />

      <button type="submit">Define Availability</button>
    </form>
  );
}

export default DefineAvailability;
