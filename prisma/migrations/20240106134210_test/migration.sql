/*
  Warnings:

  - You are about to drop the column `actualTime` on the `Bug` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedTime` on the `Bug` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "TimeLength" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bugId" INTEGER NOT NULL,
    "weeks" INTEGER NOT NULL,
    "days" INTEGER NOT NULL,
    "hours" INTEGER NOT NULL,
    "minutes" INTEGER NOT NULL,
    CONSTRAINT "TimeLength_bugId_fkey" FOREIGN KEY ("bugId") REFERENCES "Bug" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TimeLength_bugId_fkey" FOREIGN KEY ("bugId") REFERENCES "Bug" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
    CONSTRAINT "Bug_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Bug" ("assigneeId", "createdAt", "description", "environmentId", "id", "isRegression", "priorityId", "reporterId", "severityId", "statusId", "stepsToReproduce", "title", "updatedAt") SELECT "assigneeId", "createdAt", "description", "environmentId", "id", "isRegression", "priorityId", "reporterId", "severityId", "statusId", "stepsToReproduce", "title", "updatedAt" FROM "Bug";
DROP TABLE "Bug";
ALTER TABLE "new_Bug" RENAME TO "Bug";
CREATE UNIQUE INDEX "Bug_estimatedTimeId_key" ON "Bug"("estimatedTimeId");
CREATE UNIQUE INDEX "Bug_actualTimeId_key" ON "Bug"("actualTimeId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "TimeLength_bugId_key" ON "TimeLength"("bugId");
