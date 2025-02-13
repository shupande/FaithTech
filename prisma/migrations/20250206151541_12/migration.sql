-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ContactForm" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "attachments" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ContactForm" ("attachments", "company", "createdAt", "email", "firstName", "id", "lastName", "message", "notes", "phone", "status", "subject", "updatedAt") SELECT "attachments", "company", "createdAt", "email", "firstName", "id", "lastName", "message", "notes", "phone", "status", "subject", "updatedAt" FROM "ContactForm";
DROP TABLE "ContactForm";
ALTER TABLE "new_ContactForm" RENAME TO "ContactForm";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
