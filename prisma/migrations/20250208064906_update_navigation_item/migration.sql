-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NavigationItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "parentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "NavigationItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "NavigationItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_NavigationItem" ("active", "createdAt", "id", "label", "order", "parentId", "type", "updatedAt", "url") SELECT "active", "createdAt", "id", "label", "order", "parentId", "type", "updatedAt", "url" FROM "NavigationItem";
DROP TABLE "NavigationItem";
ALTER TABLE "new_NavigationItem" RENAME TO "NavigationItem";
CREATE INDEX "NavigationItem_parentId_idx" ON "NavigationItem"("parentId");
CREATE INDEX "NavigationItem_type_idx" ON "NavigationItem"("type");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
