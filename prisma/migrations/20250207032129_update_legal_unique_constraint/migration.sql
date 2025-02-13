/*
  Warnings:

  - A unique constraint covering the columns `[type,slug]` on the table `Legal` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Legal_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "Legal_type_slug_key" ON "Legal"("type", "slug");
