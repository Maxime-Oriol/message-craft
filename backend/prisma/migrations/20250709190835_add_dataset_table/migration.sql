/*
  Warnings:

  - Added the required column `pii_factor` to the `llm_dataset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "craft_message" ADD COLUMN     "transferred_to_dataset" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "llm_dataset" ADD COLUMN     "pii_factor" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "distance_levenshtein" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "score_reliability" DROP NOT NULL;
