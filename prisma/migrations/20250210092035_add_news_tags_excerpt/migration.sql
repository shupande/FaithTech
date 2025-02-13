-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_News" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "publishDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coverImage" TEXT,
    "attachments" TEXT,
    "tags" TEXT,
    "excerpt" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_News" ("attachments", "category", "content", "coverImage", "createdAt", "excerpt", "id", "publishDate", "slug", "status", "tags", "title", "updatedAt") SELECT "attachments", "category", "content", "coverImage", "createdAt", "excerpt", "id", "publishDate", "slug", "status", "tags", "title", "updatedAt" FROM "News";
DROP TABLE "News";
ALTER TABLE "new_News" RENAME TO "News";
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");
CREATE INDEX "News_status_idx" ON "News"("status");
CREATE INDEX "News_category_idx" ON "News"("category");
CREATE INDEX "News_tags_idx" ON "News"("tags");
CREATE INDEX "News_publishDate_idx" ON "News"("publishDate");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
