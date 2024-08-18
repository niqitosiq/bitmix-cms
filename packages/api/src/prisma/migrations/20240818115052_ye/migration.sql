-- CreateTable
CREATE TABLE "Site" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "schemaId" TEXT NOT NULL,
    "siteId" TEXT,
    CONSTRAINT "Page_schemaId_fkey" FOREIGN KEY ("schemaId") REFERENCES "Schema" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Page_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PropValue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT,
    "schemaReferenceAlias" TEXT,
    "schemaReferenceField" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "type" TEXT,
    "propId" TEXT,
    CONSTRAINT "PropValue_schemaReferenceAlias_fkey" FOREIGN KEY ("schemaReferenceAlias") REFERENCES "Schema" ("alias") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Prop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "schemaId" TEXT,
    "propValueId" TEXT,
    CONSTRAINT "Prop_schemaId_fkey" FOREIGN KEY ("schemaId") REFERENCES "Schema" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Prop_propValueId_fkey" FOREIGN KEY ("propValueId") REFERENCES "PropValue" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Schema" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alias" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "frameId" TEXT NOT NULL,
    CONSTRAINT "Schema_frameId_fkey" FOREIGN KEY ("frameId") REFERENCES "Frame" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VisibleProp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "frameId" TEXT NOT NULL,
    CONSTRAINT "VisibleProp_frameId_fkey" FOREIGN KEY ("frameId") REFERENCES "Schema" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Frame" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "categoryId" TEXT,
    "isBase" BOOLEAN NOT NULL DEFAULT false,
    "code" TEXT,
    CONSTRAINT "Frame_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CustomFrame" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "schemaId" TEXT,
    CONSTRAINT "CustomFrame_schemaId_fkey" FOREIGN KEY ("schemaId") REFERENCES "Schema" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ChildrenSchema" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ChildrenSchema_A_fkey" FOREIGN KEY ("A") REFERENCES "Schema" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ChildrenSchema_B_fkey" FOREIGN KEY ("B") REFERENCES "Schema" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Prop_propValueId_key" ON "Prop"("propValueId");

-- CreateIndex
CREATE UNIQUE INDEX "Schema_alias_key" ON "Schema"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "Frame_name_key" ON "Frame"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Frame_type_key" ON "Frame"("type");

-- CreateIndex
CREATE UNIQUE INDEX "CustomFrame_schemaId_key" ON "CustomFrame"("schemaId");

-- CreateIndex
CREATE UNIQUE INDEX "_ChildrenSchema_AB_unique" ON "_ChildrenSchema"("A", "B");

-- CreateIndex
CREATE INDEX "_ChildrenSchema_B_index" ON "_ChildrenSchema"("B");
