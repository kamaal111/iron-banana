-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "team" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_team_key" ON "User"("team");
