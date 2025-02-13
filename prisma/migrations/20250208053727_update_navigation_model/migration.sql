/*
  Warnings:

  - You are about to drop the column `status` on the `Navigation` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Navigation` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Navigation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "items" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Navigation" ("createdAt", "id", "items", "type", "updatedAt") SELECT "createdAt", "id", "items", "type", "updatedAt" FROM "Navigation";
DROP TABLE "Navigation";
ALTER TABLE "new_Navigation" RENAME TO "Navigation";
CREATE UNIQUE INDEX "Navigation_type_key" ON "Navigation"("type");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
