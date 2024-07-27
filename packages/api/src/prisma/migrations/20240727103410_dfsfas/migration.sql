/*
  Warnings:

  - You are about to drop the column `uniqueId` on the `Schema` table. All the data in the column will be lost.
  - Added the required column `alias` to the `Schema` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Schema" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alias" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "frameId" TEXT NOT NULL,
    "parentSchemaId" TEXT,
    CONSTRAINT "Schema_frameId_fkey" FOREIGN KEY ("frameId") REFERENCES "Frame" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Schema_parentSchemaId_fkey" FOREIGN KEY ("parentSchemaId") REFERENCES "Schema" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Schema" ("createdAt", "frameId", "id", "parentSchemaId", "updatedAt") SELECT "createdAt", "frameId", "id", "parentSchemaId", "updatedAt" FROM "Schema";
DROP TABLE "Schema";
ALTER TABLE "new_Schema" RENAME TO "Schema";
CREATE UNIQUE INDEX "Schema_alias_key" ON "Schema"("alias");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
