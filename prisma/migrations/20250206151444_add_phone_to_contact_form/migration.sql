/*
  Warnings:

  - Added the required column `phone` to the `ContactForm` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
PRAGMA foreign_keys=OFF;

-- 创建临时表
CREATE TABLE "ContactForm_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT 'Not provided',
    "company" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "attachments" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- 复制数据
INSERT INTO "ContactForm_new" ("id", "firstName", "lastName", "email", "company", "subject", "message", "status", "attachments", "notes", "createdAt", "updatedAt")
SELECT "id", "firstName", "lastName", "email", "company", "subject", "message", "status", "attachments", "notes", "createdAt", "updatedAt"
FROM "ContactForm";

-- 删除旧表
DROP TABLE "ContactForm";

-- 重命名新表
ALTER TABLE "ContactForm_new" RENAME TO "ContactForm";

PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
