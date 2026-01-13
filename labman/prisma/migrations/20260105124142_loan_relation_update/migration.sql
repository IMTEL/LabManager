/*
  Warnings:

  - A unique constraint covering the columns `[activeLoanId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Loan_itemId_key";

-- AlterTable
ALTER TABLE "public"."Item" ADD COLUMN     "activeLoanId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Item_activeLoanId_key" ON "public"."Item"("activeLoanId");
