/*
  Warnings:

  - You are about to drop the column `available` on the `Equipment` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Equipment` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Equipment` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Equipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Equipment" DROP COLUMN "available",
DROP COLUMN "category",
DROP COLUMN "quantity",
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."EquipmentCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "EquipmentCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Equipment" ADD CONSTRAINT "Equipment_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."EquipmentCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
