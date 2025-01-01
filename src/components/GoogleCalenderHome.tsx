'use client';

import { useState } from 'react';
import { Calendar } from '@/components/Calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addMinutes, format, parseISO } from 'date-fns';

export default function GoogleCalenderHome() {
  const [date, setDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [summary, setSummary] = useState('');

  const fetchAvailableSlots = async () => {
    const response = await fetch(`/api/available-slots?date=${date}`);
    const data = await response.json();
    setAvailableSlots(data.availableSlots);
  };

  const bookAppointment = async () => {
    if (!selectedSlot || !summary) return;

    const startTime = selectedSlot;
    const endTime = addMinutes(parseISO(selectedSlot), 30).toISOString();

    const response = await fetch('/api/book-appointment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startTime, endTime, summary }),
    });

    const data = await response.json();

    if (data.appointment) {
      alert('Appointment booked successfully!');
      setSelectedSlot('');
      setSummary('');
      fetchAvailableSlots();
    } else {
      alert('Failed to book appointment. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Book an Appointment</h1>
      <div className="mb-4">
        <Label htmlFor="date">Select a date:</Label>
        <Input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Button onClick={fetchAvailableSlots} className="mt-2">
          Find Available Slots
        </Button>
      </div>
      {availableSlots.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Available Slots:</h2>
          <Calendar availableSlots={availableSlots} onSlotSelect={setSelectedSlot} />
        </div>
      )}
      {selectedSlot && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Book Appointment:</h2>
          <p>Selected Time: {format(parseISO(selectedSlot), 'MMMM d, yyyy h:mm a')}</p>
          <Label htmlFor="summary">Appointment Summary:</Label>
          <Input
            type="text"
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Enter appointment details"
          />
          <Button onClick={bookAppointment} className="mt-2">
            Book Appointment
          </Button>
        </div>
      )}
    </div>
  );
}

