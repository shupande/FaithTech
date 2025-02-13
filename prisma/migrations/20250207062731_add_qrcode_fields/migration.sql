-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_social_media" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "qrCode" TEXT,
    "hasQrCode" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_social_media" ("createdAt", "displayOrder", "icon", "id", "isActive", "platform", "updatedAt", "url") SELECT "createdAt", "displayOrder", "icon", "id", "isActive", "platform", "updatedAt", "url" FROM "social_media";
DROP TABLE "social_media";
ALTER TABLE "new_social_media" RENAME TO "social_media";
CREATE UNIQUE INDEX "social_media_platform_url_key" ON "social_media"("platform", "url");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
