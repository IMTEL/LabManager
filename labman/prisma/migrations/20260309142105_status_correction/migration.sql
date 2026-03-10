/*
  Warnings:

  - Made the column `status` on table `Borrower` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `Equipment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `Loan` required. This step will fail if there are existing NULL values in that column.

*/
UPDATE "Borrower" SET "status" = 'Active' WHERE "status" IS NULL;
UPDATE "Equipment" SET "status" = 'Active' WHERE "status" IS NULL;

-- AlterTable
ALTER TABLE "Borrower" ALTER COLUMN "status" SET NOT NULL;

-- AlterTable
ALTER TABLE "Equipment" ALTER COLUMN "status" SET NOT NULL;

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "status" SET NOT NULL;

-- AlterTable
ALTER TABLE "Loan" ALTER COLUMN "status" SET NOT NULL;
