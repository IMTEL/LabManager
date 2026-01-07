/*
  Warnings:

  - Made the column `itemId` on table `Loan` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Loan" DROP CONSTRAINT "Loan_itemId_fkey";

-- AlterTable
ALTER TABLE "public"."Loan" ALTER COLUMN "itemId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Loan" ADD CONSTRAINT "Loan_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
