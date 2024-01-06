/*
  Warnings:

  - You are about to drop the column `actualBugId` on the `TimeLength` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedBugId` on the `TimeLength` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bug" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "stepsToReproduce" TEXT,
    "reporterId" TEXT NOT NULL,
    "assigneeId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isRegression" BOOLEAN NOT NULL DEFAULT false,
    "severityId" INTEGER,
    "priorityId" INTEGER,
    "statusId" INTEGER,
    "environmentId" INTEGER,
    "estimatedTimeId" INTEGER,
    "actualTimeId" INTEGER,
    CONSTRAINT "Bug_severityId_fkey" FOREIGN KEY ("severityId") REFERENCES "Severity" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Bug_priorityId_fkey" FOREIGN KEY ("priorityId") REFERENCES "Priority" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Bug_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Bug_environmentId_fkey" FOREIGN KEY ("environmentId") REFERENCES "Environment" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Bug_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Bug_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Bug_estimatedTimeId_fkey" FOREIGN KEY ("estimatedTimeId") REFERENCES "TimeLength" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Bug_actualTimeId_fkey" FOREIGN KEY ("actualTimeId") REFERENCES "TimeLength" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Bug" ("actualTimeId", "assigneeId", "createdAt", "description", "environmentId", "estimatedTimeId", "id", "isRegression", "priorityId", "reporterId", "severityId", "statusId", "stepsToReproduce", "title", "updatedAt") SELECT "actualTimeId", "assigneeId", "createdAt", "description", "environmentId", "estimatedTimeId", "id", "isRegression", "priorityId", "reporterId", "severityId", "statusId", "stepsToReproduce", "title", "updatedAt" FROM "Bug";
DROP TABLE "Bug";
ALTER TABLE "new_Bug" RENAME TO "Bug";
CREATE UNIQUE INDEX "Bug_estimatedTimeId_key" ON "Bug"("estimatedTimeId");
CREATE UNIQUE INDEX "Bug_actualTimeId_key" ON "Bug"("actualTimeId");
CREATE TABLE "new_TimeLength" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "weeks" INTEGER,
    "days" INTEGER,
    "hours" INTEGER,
    "minutes" INTEGER
);
INSERT INTO "new_TimeLength" ("days", "hours", "id", "minutes", "weeks") SELECT "days", "hours", "id", "minutes", "weeks" FROM "TimeLength";
DROP TABLE "TimeLength";
ALTER TABLE "new_TimeLength" RENAME TO "TimeLength";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
