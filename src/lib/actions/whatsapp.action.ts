"use server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prisma";




// export async function getAllSlotsWhatsapp({ userId }: { userId: string }) {

//   await prisma.admin.findUnique({
//     where: {
//       user: {
//         id: userId
//       },
//     },
//   });
//   const slots = await prisma.slot.findMany({
//     where: { adminId: userId },
//     include: {
//       admin: true, // Include admin details if needed
//     },
//     orderBy: {
//       startTime: "asc",
//     },
//   });

//   return slots;
// }