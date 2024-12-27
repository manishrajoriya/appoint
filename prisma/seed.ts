// import { auth } from '@clerk/nextjs/server';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
//   const {userId} = await auth()

//   if (!userId) {
//     throw new Error('Unauthorized - Please sign in');
//   }
//   for (const day of daysOfWeek) {
//     await prisma.day.upsert({
//       where: { name: day , adminId: userId },
//       update: {},
//       create: { name: day , adminId: userId },
//     });
//   }

//   console.log('✅ Days of the week have been pre-populated!');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
