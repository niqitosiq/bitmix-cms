/*
  Warnings:

  - You are about to drop the column `schemaReferenceId` on the `PropValue` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PropValue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT,
    "schemaReferenceAlias" TEXT,
    "schemaReferenceField" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "propId" TEXT,
    CONSTRAINT "PropValue_schemaReferenceAlias_fkey" FOREIGN KEY ("schemaReferenceAlias") REFERENCES "Schema" ("alias") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_PropValue" ("createdAt", "id", "propId", "schemaReferenceField", "updatedAt", "value") SELECT "createdAt", "id", "propId", "schemaReferenceField", "updatedAt", "value" FROM "PropValue";
DROP TABLE "PropValue";
ALTER TABLE "new_PropValue" RENAME TO "PropValue";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
