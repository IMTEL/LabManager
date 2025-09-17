-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "secretHash" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
