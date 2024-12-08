-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_userId_fkey";

-- DropForeignKey
ALTER TABLE "AvailableSlots" DROP CONSTRAINT "AvailableSlots_adminId_fkey";

-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "mobileNo" SET NOT NULL,
ALTER COLUMN "mobileNo" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "AvailableSlots" ALTER COLUMN "adminId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "AvailableSlots_adminId_idx" ON "AvailableSlots"("adminId");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailableSlots" ADD CONSTRAINT "AvailableSlots_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
