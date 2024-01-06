/*
  Warnings:

  - You are about to drop the `BugDependency` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BugDependency";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_BugToBug" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_BugToBug_A_fkey" FOREIGN KEY ("A") REFERENCES "Bug" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BugToBug_B_fkey" FOREIGN KEY ("B") REFERENCES "Bug" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_BugToBug_AB_unique" ON "_BugToBug"("A", "B");

-- CreateIndex
CREATE INDEX "_BugToBug_B_index" ON "_BugToBug"("B");
