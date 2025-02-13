/*
  Warnings:

  - You are about to drop the `CompetitorAnalysis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KeywordRanking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PageMetric` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SEOReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SEOSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CompetitorAnalysis";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "KeywordRanking";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PageMetric";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SEOReport";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SEOSettings";
PRAGMA foreign_keys=on;
