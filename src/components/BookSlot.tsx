"use client";

import { useState, useEffect } from "react";
import { bookSlot } from "@/lib/actions/user.action"; // Import the server action

function BookSlot({ adminId }) {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const fetchSlots = async () => {
      const res = await fetch(`/api/admin/slots?adminId=${adminId}`);
      const data = await res.json();
      setSlots(data);
    };
    fetchSlots();
  }, [adminId]);

  const handleBooking = async (slotId) => {
    try {
      await bookSlot({ slotId, userId: 1 }); // Replace 1 with actual user ID
      alert("Slot booked successfully!");
      setSlots(slots.filter((slot) => slot.id !== slotId)); // Optimistically update UI
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Available Slots</h1>
      {slots.map((slot) => (
        <div key={slot.id}>
          <p>{new Date(slot.startTime).toLocaleString()} - {new Date(slot.endTime).toLocaleString()}</p>
          <button onClick={() => handleBooking(slot.id)}>Book</button>
        </div>
      ))}
    </div>
  );
}

export default BookSlot;
