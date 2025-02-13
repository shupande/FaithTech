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
    "thumbnail" TEXT,
    "features" TEXT,
    "mapPoints" TEXT,
    "featureTitle" TEXT,
    "featureSubtitle" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SectionContent" ("actions", "badge", "createdAt", "description", "features", "id", "image", "mapPoints", "media", "name", "status", "thumbnail", "title", "updatedAt") SELECT "actions", "badge", "createdAt", "description", "features", "id", "image", "mapPoints", "media", "name", "status", "thumbnail", "title", "updatedAt" FROM "SectionContent";
DROP TABLE "SectionContent";
ALTER TABLE "new_SectionContent" RENAME TO "SectionContent";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
