/*
  Warnings:

  - You are about to drop the column `assignedAt` on the `JobPayment` table. All the data in the column will be lost.
  - You are about to drop the column `assignedBy` on the `JobPayment` table. All the data in the column will be lost.
  - You are about to drop the column `dayOfPayment` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `firstDate` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `giftGiver` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `installmentDate` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `lastDate` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `observation` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `times` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `description` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobPayment" DROP COLUMN "assignedAt",
DROP COLUMN "assignedBy",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dayOfPayment" TIMESTAMP(3),
ADD COLUMN     "firstDate" TIMESTAMP(3),
ADD COLUMN     "giftGiver" TEXT,
ADD COLUMN     "installmentDate" INTEGER,
ADD COLUMN     "lastDate" TIMESTAMP(3),
ADD COLUMN     "observation" TEXT,
ADD COLUMN     "times" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "dayOfPayment",
DROP COLUMN "firstDate",
DROP COLUMN "giftGiver",
DROP COLUMN "installmentDate",
DROP COLUMN "lastDate",
DROP COLUMN "observation",
DROP COLUMN "times",
ADD COLUMN     "description" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "JobPayment_jobId_idx" ON "JobPayment"("jobId");

-- CreateIndex
CREATE INDEX "JobPayment_paymentId_idx" ON "JobPayment"("paymentId");
