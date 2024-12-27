"use server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prisma";



export async function defineAvailability({
  
  startTime,
  endTime,
  slotDuration,
}: {
  
  startTime: string;
  endTime: string;
  slotDuration: number;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized - Please sign in");
  }
  const slots = [];
  let currentStart = new Date(startTime);
  let currentEnd = new Date(startTime);

  while (currentEnd < new Date(endTime)) {
    currentEnd = new Date(currentStart.getTime() + slotDuration * 60 * 1000);
    if (currentEnd > new Date(endTime)) break;

    slots.push({
      adminId : userId,
      startTime: currentStart,
      endTime: currentEnd,
      day: currentStart.toDateString(),
    });
    currentStart = currentEnd;
  }

  await prisma.slot.createMany({ data: slots });

  return { success: true };
}

export async function bookSlot({ slotId }: { slotId: string }) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized - Please sign in");
  }
  const slot = await prisma.slot.findUnique({ where: { id: slotId } });

  if (!slot || slot.isBooked) {
    throw new Error("Slot is not available");
  }

  await prisma.slot.update({
    where: { id: slotId },
    data: {
      isBooked: true,
      userId,
    },
  });

  return { success: true };
}

export async function getAllSlots() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized - Please sign in");
  }
  const slots = await prisma.slot.findMany({
    where: { adminId: userId },
    include: {
      admin: true, // Include admin details if needed
    },
    orderBy: {
      startTime: "asc",
    },
  });

  return slots;
}





export async function generateSlotsForDate(dateString: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized - Please sign in");
  }
  const date = new Date(dateString); // Input: "YYYY-MM-DD"
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayOfWeek = days[date.getUTCDay()];

  const config = await prisma.config.findUnique({ where: { day: dayOfWeek } });
  if (!config) throw new Error(`No slot configuration found for ${dayOfWeek}`);

  const { startTime, endTime, interval } = config;

  // Parse time strings
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const start = new Date(date);
  start.setUTCHours(startHour, startMinute, 0, 0);

  const end = new Date(date);
  end.setUTCHours(endHour, endMinute, 0, 0);

  // Generate slots
  let current = start;
  const slots = [];
  while (current < end) {
    const next = new Date(current.getTime() + interval * 60000); // Add interval
    slots.push({
      day: dayOfWeek,
      startTime: current.toISOString(),
      endTime: next.toISOString(),
      date,
      adminId: userId,
    });
    current = next;
  }

  // Save to database
  await prisma.slot.createMany({ data: slots });

  return { message: `Slots generated successfully for ${dayOfWeek}` };
}



export async function createTimeSlot({ day, slots }: { day: string; slots: { start: string; end: string }[] }) {
  if (!day || !slots || !Array.isArray(slots) || slots.length === 0) {
    throw new Error('Day and a valid array of time slots are required.');
  }
console.log("slots",slots, day);

  const newTimeSlots = await prisma.$transaction(
    slots.map(slot =>
      prisma.timeSlot.create({
        data: {
          day,
          start: slot.start,
          end: slot.end,
        },
      })
    )
  );
console.log("newTimeSlots",newTimeSlots);

  return newTimeSlots;
}

// Delete a time slot
export async function deleteTimeSlot(id: string) {
  if (!id) {
    throw new Error('ID is required to delete a time slot.');
  }

  await prisma.timeSlot.delete({
    where: { id },
  });
  return { message: 'Time slot deleted successfully' };
}

// Update a time slot
export async function updateTimeSlot(id: string, { start, end }: { start?: string; end?: string }) {
  if (!id || (!start && !end)) {
    throw new Error('ID and at least one field (start or end) are required to update a time slot.');
  }

  const updatedTimeSlot = await prisma.timeSlot.update({
    where: { id },
    data: {
      ...(start && { start }),
      ...(end && { end }),
    },
  });
  return updatedTimeSlot;
}

interface Slot {
  start: string;
  end: string;
}

interface DayWithSlots {
  name: string;
  slots: Slot[];
}

// Server Action to store a day with its slots
export async function storeDayWithSlots(data: DayWithSlots) {
  try {
    const { name, slots } = data;
console.log(name, slots.map((slot) => ({ start: slot.start, end: slot.end })));

    // Create or find the day
    const day = await prisma.day.findUnique({
      where: { name },
     
    });
    if (!day) {
      throw new Error('Day not found');
    }
console.log(day);

    // Add slots to the day
    await prisma.shift.createMany({
      data: slots.map((slot) => ({
        start: slot.start,
        end: slot.end,
        dayId: day.id,
      })),
    });

    console.log('Day and slots saved successfully');
    return { success: true, message: 'Day and slots saved successfully' };
  } catch (error) {
    console.error('Failed to save day and slots:', error);
    return { success: false, message: 'Failed to save day and slots' };
  }
}