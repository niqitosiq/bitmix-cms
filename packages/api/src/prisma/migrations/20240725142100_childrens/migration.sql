-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Schema" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "frameId" INTEGER NOT NULL,
    "parentSchemaId" INTEGER,
    CONSTRAINT "Schema_frameId_fkey" FOREIGN KEY ("frameId") REFERENCES "Frame" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Schema_id_fkey" FOREIGN KEY ("id") REFERENCES "Schema" ("parentSchemaId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Schema" ("createdAt", "frameId", "id", "updatedAt") SELECT "createdAt", "frameId", "id", "updatedAt" FROM "Schema";
DROP TABLE "Schema";
ALTER TABLE "new_Schema" RENAME TO "Schema";
CREATE UNIQUE INDEX "Schema_parentSchemaId_key" ON "Schema"("parentSchemaId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
