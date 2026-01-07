/*
  Warnings:

  - You are about to drop the column `loanId` on the `Item` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[itemId]` on the table `Loan` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Item" DROP CONSTRAINT "Item_loanId_fkey";

-- DropIndex
DROP INDEX "public"."Item_loanId_key";

-- AlterTable
ALTER TABLE "public"."Borrower" ALTER COLUMN "creationDate" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Item" DROP COLUMN "loanId";

-- AlterTable
ALTER TABLE "public"."Loan" ADD COLUMN     "itemId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Loan_itemId_key" ON "public"."Loan"("itemId");

-- AddForeignKey
ALTER TABLE "public"."Loan" ADD CONSTRAINT "Loan_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
