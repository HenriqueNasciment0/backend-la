/*
  Warnings:

  - Added the required column `revoked` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RefreshToken" ADD COLUMN     "revoked" BOOLEAN NOT NULL;
