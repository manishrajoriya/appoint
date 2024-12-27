"use server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prisma";


export async function createDays() {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const {userId} = await auth()
console.log(userId);

  if (!userId) {
    throw new Error('Unauthorized - Please sign in');
  }
 const  admin = await prisma.admin.findUnique({ where: { id: userId } });
  if (!admin) {
    throw new Error('Unauthorized - Please sign in as an admin');
  }

   for (const day of daysOfWeek) {
    await prisma.day.upsert({
      where: {   name: day, adminId: admin.id  },
      update: {}, // No updates for existing records
      create: {
        name: day,
        adminId: admin.id,
      },
    });
  }

  console.log('✅ Days of the week have been pre-populated!');
}

export async function findTimeSlotsByDay(day: string) {
  const {userId} = await auth()

  if (!userId) {
    throw new Error('Unauthorized - Please sign in');
  }
  const admin = await prisma.admin.findUnique({ where: { id: userId } });
  if (!admin) {
    throw new Error('Unauthorized - Please sign in as an admin');
  }

  const shift = await prisma.shift.findMany({
    where: {
     day: {
      name: day,
     },
     adminId: admin.id
    },
  });
  console.log("shift",shift);
  
  return shift;
}

export async function findAllDays() {
  const {userId} = await auth()

  if (!userId) {
    throw new Error('Unauthorized - Please sign in');
  }
  const admin = await prisma.admin.findUnique({ where: { id: userId } });
  if (!admin) {
    throw new Error('Unauthorized - Please sign in as an admin');
  }

  const days = await prisma.day.findMany({
    where: {
     adminId: admin.id
    },
    include: {
      shift: true,
    }
  });
  console.log("days",days);
  
  return days;
}

export async function removeTimeSlot(id: number, dayId: number, dayname: string) {
  try {
    // Authentication
    const { userId } = await auth();
    if (!userId) {
      throw new Error('Unauthorized - Please sign in');
    }

    // Verify Admin
    const admin = await prisma.admin.findUnique({
      where: { id: userId },
    });

    if (!admin) {
      throw new Error('Unauthorized - Please sign in as an admin');
    }

    // Delete Time Slot
    const deletedShift = await prisma.shift.deleteMany({
      where: {
        id,
        adminId: admin.id,
        day: {
          name: dayname,
          id: dayId,
        }
      },
    });

    if (deletedShift.count === 0) {
      throw new Error('Time slot not found or you do not have permission to delete it.');
    }

    return { success: true, message: 'Time slot removed successfully' };
  } catch (error: any) {
    console.error('Error removing time slot:', error.message || error);
    throw new Error(`Failed to remove time slot: ${error.message || 'Unknown error'}`);
  }
}