/*
  Warnings:

  - You are about to drop the `_AlunoToDisciplina` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_AlunoToDisciplina";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Boletim" (
    "alunoId" INTEGER NOT NULL,
    "disciplinaId" INTEGER NOT NULL,
    "nota1" REAL NOT NULL,
    "nota2" REAL NOT NULL,
    "nota3" REAL NOT NULL,

    PRIMARY KEY ("alunoId", "disciplinaId"),
    CONSTRAINT "Boletim_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Boletim_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_AlunoDisciplina" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AlunoDisciplina_A_fkey" FOREIGN KEY ("A") REFERENCES "Aluno" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AlunoDisciplina_B_fkey" FOREIGN KEY ("B") REFERENCES "Disciplina" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_AlunoDisciplina_AB_unique" ON "_AlunoDisciplina"("A", "B");

-- CreateIndex
CREATE INDEX "_AlunoDisciplina_B_index" ON "_AlunoDisciplina"("B");
