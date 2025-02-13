-- CreateTable
CREATE TABLE "SEOReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "score" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "issues" JSONB NOT NULL,
    "metrics" JSONB NOT NULL
);

-- CreateTable
CREATE TABLE "PageMetric" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "keywords" TEXT,
    "score" INTEGER NOT NULL,
    "issues" JSONB NOT NULL,
    "reportId" TEXT NOT NULL,
    CONSTRAINT "PageMetric_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "SEOReport" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KeywordRanking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "keyword" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "change" INTEGER NOT NULL,
    "lastChecked" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CompetitorAnalysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "competitor" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "strength" TEXT NOT NULL,
    "metrics" JSONB NOT NULL
);

-- CreateTable
CREATE TABLE "SEOSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "targetKeywords" JSONB NOT NULL,
    "competitors" JSONB NOT NULL,
    "checkFrequency" TEXT NOT NULL DEFAULT 'daily',
    "lastCheck" DATETIME,
    "notifications" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "PageMetric_url_idx" ON "PageMetric"("url");

-- CreateIndex
CREATE INDEX "PageMetric_reportId_idx" ON "PageMetric"("reportId");

-- CreateIndex
CREATE INDEX "KeywordRanking_keyword_idx" ON "KeywordRanking"("keyword");

-- CreateIndex
CREATE INDEX "CompetitorAnalysis_domain_idx" ON "CompetitorAnalysis"("domain");
