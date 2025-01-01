import React from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';

interface CalendarProps {
  availableSlots: string[];
  onSlotSelect: (slot: string) => void;
}

export function Calendar({ availableSlots, onSlotSelect }: CalendarProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {availableSlots.map((slot) => (
        <Button
          key={slot}
          onClick={() => onSlotSelect(slot)}
          variant="outline"
          className="p-2"
        >
          {format(parseISO(slot), 'h:mm a')}
        </Button>
      ))}
    </div>
  );
}

