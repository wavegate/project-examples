-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TimeLength" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bugId" INTEGER NOT NULL,
    "weeks" INTEGER,
    "days" INTEGER,
    "hours" INTEGER,
    "minutes" INTEGER,
    CONSTRAINT "TimeLength_bugId_fkey" FOREIGN KEY ("bugId") REFERENCES "Bug" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TimeLength_bugId_fkey" FOREIGN KEY ("bugId") REFERENCES "Bug" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TimeLength" ("bugId", "days", "hours", "id", "minutes", "weeks") SELECT "bugId", "days", "hours", "id", "minutes", "weeks" FROM "TimeLength";
DROP TABLE "TimeLength";
ALTER TABLE "new_TimeLength" RENAME TO "TimeLength";
CREATE UNIQUE INDEX "TimeLength_bugId_key" ON "TimeLength"("bugId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
