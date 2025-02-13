-- AlterTable
ALTER TABLE "News" ADD COLUMN "tags" TEXT;
ALTER TABLE "News" ADD COLUMN "excerpt" TEXT;

-- CreateIndex
CREATE INDEX "News_tags_idx" ON "News"("tags"); 