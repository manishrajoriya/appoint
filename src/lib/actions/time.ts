"use server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prisma";


export async function createDays() {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const {userId} = await auth()

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