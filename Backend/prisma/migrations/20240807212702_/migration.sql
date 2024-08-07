/*
  Warnings:

  - You are about to drop the `DisciplinaOnAluno` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "DisciplinaOnAluno";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_AlunoToDisciplina" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AlunoToDisciplina_A_fkey" FOREIGN KEY ("A") REFERENCES "Aluno" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AlunoToDisciplina_B_fkey" FOREIGN KEY ("B") REFERENCES "Disciplina" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_AlunoToDisciplina_AB_unique" ON "_AlunoToDisciplina"("A", "B");

-- CreateIndex
CREATE INDEX "_AlunoToDisciplina_B_index" ON "_AlunoToDisciplina"("B");
