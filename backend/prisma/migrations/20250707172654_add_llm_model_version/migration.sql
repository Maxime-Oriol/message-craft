-- CreateTable
CREATE TABLE "llm_model_version" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "model_name" TEXT NOT NULL,
    "trained_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_count" INTEGER NOT NULL,
    "score_validation" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "llm_model_version_pkey" PRIMARY KEY ("id")
);
