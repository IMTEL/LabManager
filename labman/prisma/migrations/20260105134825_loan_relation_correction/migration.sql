-- AddForeignKey
ALTER TABLE "public"."Item" ADD CONSTRAINT "Item_activeLoanId_fkey" FOREIGN KEY ("activeLoanId") REFERENCES "public"."Loan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
