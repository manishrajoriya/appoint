"use client";

import { useState, useEffect } from "react";
import { getAllSlots } from "@/lib/actions/user.action"; // Import the server action

type Slot = {
    id: string;
    adminId: string;
    startTime: Date;
    endTime: Date;
    isBooked: boolean;
    userId: string | null;
};

function DisplayAllSlots() {
  const [slots, setSlots] = useState<Slot[]>([]);

  // Fetch slots when the component mounts
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const slots = await getAllSlots();
        setSlots(slots);
      } catch (error) {
        console.error("Error fetching slots:", error);
      }
    };

    fetchSlots();
  }, []);

  return (
    <div>
      <h1>All Slots</h1>
      {slots.length > 0 ? (
        slots.map((slot) => (
          <div
            key={slot.id}
            className={`p-4 mb-4 rounded border ${
              slot.isBooked ? "bg-red-200" : "bg-green-200"
            }`}
          >
            <p>
              <strong>Start Time:</strong>{" "}
              {new Date(slot.startTime).toLocaleString()}
            </p>
            <p>
              <strong>End Time:</strong> {new Date(slot.endTime).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {slot.isBooked ? "Booked" : "Available"}
            </p>
            {slot.isBooked && <p><strong>Booked By User ID:</strong> {slot.userId}</p>}
          </div>
        ))
      ) : (
        <p>No slots available.</p>
      )}
    </div>
  );
}

export default DisplayAllSlots;
