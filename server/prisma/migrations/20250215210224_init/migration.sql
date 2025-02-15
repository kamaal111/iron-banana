-- CreateTable
CREATE TABLE "Scores" (
    "team" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "score" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Scores_team_key" ON "Scores"("team");
