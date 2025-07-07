/*
  Warnings:

  - The primary key for the `ContactMessage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ContactMessage` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `CraftMessage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `CraftMessage` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ContactMessage" DROP CONSTRAINT "ContactMessage_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CraftMessage" DROP CONSTRAINT "CraftMessage_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "CraftMessage_pkey" PRIMARY KEY ("id");
