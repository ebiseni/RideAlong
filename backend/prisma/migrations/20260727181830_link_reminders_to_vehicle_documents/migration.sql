/*
  Warnings:

  - The values [COMPLETED] on the enum `ReminderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `description` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `documentType` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `expiryDate` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Reminder` table. All the data in the column will be lost.
  - Added the required column `vehicleDocumentId` to the `Reminder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReminderStatus_new" AS ENUM ('PENDING', 'SENT', 'DISMISSED');
ALTER TABLE "public"."Reminder" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Reminder" ALTER COLUMN "status" TYPE "ReminderStatus_new" USING ("status"::text::"ReminderStatus_new");
ALTER TYPE "ReminderStatus" RENAME TO "ReminderStatus_old";
ALTER TYPE "ReminderStatus_new" RENAME TO "ReminderStatus";
DROP TYPE "public"."ReminderStatus_old";
ALTER TABLE "Reminder" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropIndex
DROP INDEX "Reminder_expiryDate_idx";

-- DropIndex
DROP INDEX "Reminder_reminderDate_idx";

-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "description",
DROP COLUMN "documentType",
DROP COLUMN "expiryDate",
DROP COLUMN "title",
ADD COLUMN     "vehicleDocumentId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "plateNumber" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleDocument" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VehicleDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Reminder_vehicleDocumentId_idx" ON "Reminder"("vehicleDocumentId");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleDocument" ADD CONSTRAINT "VehicleDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleDocument" ADD CONSTRAINT "VehicleDocument_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_vehicleDocumentId_fkey" FOREIGN KEY ("vehicleDocumentId") REFERENCES "VehicleDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;
