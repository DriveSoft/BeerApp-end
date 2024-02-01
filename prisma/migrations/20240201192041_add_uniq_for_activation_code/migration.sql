/*
  Warnings:

  - A unique constraint covering the columns `[activationCode]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Customer_activationCode_key" ON "Customer"("activationCode");
