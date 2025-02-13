/*
  Warnings:

  - You are about to drop the column `fullDescription` on the `Product` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "SectionContent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "badge" TEXT,
    "actions" TEXT,
    "image" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "description" TEXT NOT NULL,
    "features" TEXT NOT NULL DEFAULT '',
    "specifications" TEXT NOT NULL DEFAULT '',
    "models" TEXT NOT NULL DEFAULT '',
    "images" TEXT,
    "files" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("category", "createdAt", "description", "features", "files", "id", "images", "models", "name", "price", "slug", "specifications", "status", "updatedAt") SELECT "category", "createdAt", "description", "features", "files", "id", "images", "models", "name", "price", "slug", "specifications", "status", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "SectionContent_name_key" ON "SectionContent"("name");
