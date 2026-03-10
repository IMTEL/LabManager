-- AlterTable
ALTER TABLE "Borrower" ADD COLUMN     "status" TEXT;

-- AlterTable
ALTER TABLE "Equipment" ADD COLUMN     "status" TEXT;

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "status" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Loan" ALTER COLUMN "status" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" TEXT;
