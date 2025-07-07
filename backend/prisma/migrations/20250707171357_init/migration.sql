-- CreateTable
CREATE TABLE "contact_message" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "other" TEXT,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "craft_message" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "intent" TEXT NOT NULL,
    "generated" TEXT NOT NULL,
    "message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "craft_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "llm_dataset" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "message_id" UUID NOT NULL,
    "similarity_cosine" DOUBLE PRECISION NOT NULL,
    "distance_levenshtein" INTEGER NOT NULL,
    "score_reliability" DOUBLE PRECISION NOT NULL,
    "pii_message" TEXT,
    "validated" BOOLEAN NOT NULL DEFAULT false,
    "needs_validation" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "llm_dataset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "llm_dataset" ADD CONSTRAINT "llm_dataset_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "craft_message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
