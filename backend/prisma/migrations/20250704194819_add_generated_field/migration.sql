/*
  Warnings:

  - Added the required column `generated` to the `CraftMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CraftMessage" ADD COLUMN     "generated" TEXT NOT NULL;
