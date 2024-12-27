import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  for (const day of daysOfWeek) {
    await prisma.day.upsert({
      where: { name: day },
      update: {},
      create: { name: day },
    });
  }

  console.log('✅ Days of the week have been pre-populated!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
