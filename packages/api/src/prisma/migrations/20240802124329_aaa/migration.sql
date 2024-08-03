-- CreateTable
CREATE TABLE "PinnedProp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "frameId" TEXT NOT NULL,
    CONSTRAINT "PinnedProp_frameId_fkey" FOREIGN KEY ("frameId") REFERENCES "Frame" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
