/*
  Warnings:

  - You are about to drop the `PinnedProp` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PinnedProp";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "VisibleProp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "frameId" TEXT NOT NULL,
    CONSTRAINT "VisibleProp_frameId_fkey" FOREIGN KEY ("frameId") REFERENCES "Schema" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
