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
    });
    current = next;
  }

  // Save to database
  await prisma.slot.createMany({ data: slots });

  return { message: `Slots generated successfully for ${dayOfWeek}` };
}