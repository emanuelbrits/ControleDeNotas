/*
  Warnings:

  - You are about to drop the `_AlunoToDisciplina` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_AlunoToDisciplina";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "DisciplinaOnAluno" (
    "disciplinaId" INTEGER NOT NULL,
    "alunoId" INTEGER NOT NULL,

    PRIMARY KEY ("disciplinaId", "alunoId"),
    CONSTRAINT "DisciplinaOnAluno_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DisciplinaOnAluno_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
