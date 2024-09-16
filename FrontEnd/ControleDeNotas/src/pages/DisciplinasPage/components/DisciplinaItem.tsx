import { useState } from "react";

interface Disciplina {
    id: number;
    nome: string;
    professorId: number;
    alunos: number[];
}

interface DisciplinaProps {
    disciplina: Disciplina;
    onAddAluno: (disciplinaId: number, aluno: string) => void;
}

function DisciplinaItem({ disciplina, onAddAluno }: DisciplinaProps) {
    const [isModalOpen, setIsModalOpen] = useState(false); // Controla o estado do modal
    const [alunoNome, setAlunoNome] = useState('');

    // Função que adiciona o aluno
    const handleAddAluno = () => {
        onAddAluno(disciplina.id, alunoNome); // Adiciona o aluno na disciplina
        setAlunoNome(''); // Limpa o campo após adicionar
        setIsModalOpen(false); // Fecha o modal
    };

    return (
        <div className="disciplina-item">
            <h3>{disciplina.nome}</h3>
            <p>Alunos: {disciplina.alunos.join(', ')}</p> {/* Exibe os alunos */}
            
            {/* Botão para abrir o modal */}
            <button className="btn" onClick={() => setIsModalOpen(true)}>
                Adicionar Aluno
            </button>

            {/* Modal para adicionar aluno */}
            {isModalOpen && (
                <dialog id={`modal_${disciplina.id}`} className="modal modal-open">
                    <div className="modal-box">
                        <h2>Adicionar Aluno para {disciplina.nome}</h2>
                        <label className="input input-bordered flex items-center gap-2">
                            <input
                                type="text"
                                className="grow"
                                placeholder="Nome do Aluno"
                                value={alunoNome}
                                onChange={(e) => setAlunoNome(e.target.value)} // Atualiza o nome do aluno
                            />
                        </label>
                        <div className="modal-action">
                            <button className="btn btn-error" onClick={() => setIsModalOpen(false)}>
                                Cancelar
                            </button>
                            <button className="btn btn-success" onClick={handleAddAluno}>
                                Adicionar
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
}

export default DisciplinaItem;
