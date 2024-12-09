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

export async function bookSlot({ slotId, userId }: { slotId: string; userId: string }) {
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