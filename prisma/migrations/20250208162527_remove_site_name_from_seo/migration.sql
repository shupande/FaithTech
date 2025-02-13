/*
  Warnings:

  - You are about to drop the column `siteName` on the `GlobalSEO` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GlobalSEO" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "keywords" TEXT,
    "ogImage" TEXT,
    "robotsTxt" TEXT,
    "googleVerification" TEXT,
    "bingVerification" TEXT,
    "customMetaTags" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_GlobalSEO" ("bingVerification", "createdAt", "customMetaTags", "description", "googleVerification", "id", "keywords", "ogImage", "robotsTxt", "updatedAt") SELECT "bingVerification", "createdAt", "customMetaTags", "description", "googleVerification", "id", "keywords", "ogImage", "robotsTxt", "updatedAt" FROM "GlobalSEO";
DROP TABLE "GlobalSEO";
ALTER TABLE "new_GlobalSEO" RENAME TO "GlobalSEO";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
