/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "admin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "jobId" INTEGER,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "updateAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "customerId" INTEGER,
    "locationId" INTEGER NOT NULL,
    "payment" TEXT NOT NULL,
    "photos" TEXT NOT NULL,
    "customerLink" TEXT NOT NULL,
    "discount" INTEGER,
    "closingDate" TIMESTAMP(3),
    "eventDate" TIMESTAMP(3),
    "gift" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
