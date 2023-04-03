/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "AmocrmUsers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amocrmId" TEXT NOT NULL,
    "extensionNumber" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AmocrmUsers_amocrmId_key" ON "AmocrmUsers"("amocrmId");

-- CreateIndex
CREATE UNIQUE INDEX "AmocrmUsers_extensionNumber_key" ON "AmocrmUsers"("extensionNumber");
