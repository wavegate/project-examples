/*
  Warnings:

  - You are about to drop the column `bugId` on the `TimeLength` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Bug_actualTimeId_key";

-- DropIndex
DROP INDEX "Bug_estimatedTimeId_key";

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TimeLength" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "weeks" INTEGER,
    "days" INTEGER,
    "hours" INTEGER,
    "minutes" INTEGER,
    "estimatedBugId" INTEGER,
    "actualBugId" INTEGER,
    CONSTRAINT "TimeLength_estimatedBugId_fkey" FOREIGN KEY ("estimatedBugId") REFERENCES "Bug" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TimeLength_actualBugId_fkey" FOREIGN KEY ("actualBugId") REFERENCES "Bug" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TimeLength" ("days", "hours", "id", "minutes", "weeks") SELECT "days", "hours", "id", "minutes", "weeks" FROM "TimeLength";
DROP TABLE "TimeLength";
ALTER TABLE "new_TimeLength" RENAME TO "TimeLength";
CREATE UNIQUE INDEX "TimeLength_estimatedBugId_key" ON "TimeLength"("estimatedBugId");
CREATE UNIQUE INDEX "TimeLength_actualBugId_key" ON "TimeLength"("actualBugId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
