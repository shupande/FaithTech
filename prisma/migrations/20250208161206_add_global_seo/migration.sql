-- CreateTable
CREATE TABLE "GlobalSEO" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "siteName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "keywords" TEXT,
    "ogImage" TEXT,
    "favicon" TEXT,
    "robotsTxt" TEXT,
    "googleVerification" TEXT,
    "bingVerification" TEXT,
    "customMetaTags" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
