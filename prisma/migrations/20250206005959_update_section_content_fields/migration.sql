-- AlterTable
ALTER TABLE "Page" ADD COLUMN "hero" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SectionContent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "badge" TEXT,
    "actions" TEXT,
    "image" TEXT,
    "media" TEXT,
    "features" TEXT,
    "mapPoints" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SectionContent" ("actions", "badge", "createdAt", "description", "id", "image", "name", "status", "title", "updatedAt") SELECT "actions", "badge", "createdAt", "description", "id", "image", "name", "status", "title", "updatedAt" FROM "SectionContent";
DROP TABLE "SectionContent";
ALTER TABLE "new_SectionContent" RENAME TO "SectionContent";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
