/*
  Warnings:

  - The `mobileNo` column on the `Admin` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `AvailableSlots` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AvailableSlots" DROP CONSTRAINT "AvailableSlots_adminId_fkey";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "mobileNo",
ADD COLUMN     "mobileNo" TEXT[];

-- DropTable
DROP TABLE "AvailableSlots";

-- CreateTable
CREATE TABLE "AdminAvailability" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminAvailability_id_key" ON "AdminAvailability"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AdminAvailability_adminId_dayOfWeek_key" ON "AdminAvailability"("adminId", "dayOfWeek");

-- AddForeignKey
ALTER TABLE "AdminAvailability" ADD CONSTRAINT "AdminAvailability_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
