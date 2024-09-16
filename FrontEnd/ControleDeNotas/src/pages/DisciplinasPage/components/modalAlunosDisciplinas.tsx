import { useEffect, useState } from "react";

export interface Aluno {
    id: number;
    nome: string;
}

interface ModalAlunosProps {
    disciplinaId: number;
    alunosDisciplina: Aluno[]; // Agora recebe os alunos com id e nome
    onSave: (disciplinaId: number, alunosSelecionados: Aluno[]) => void;
    onClose: () => void;
}


function ModalAlunosDisciiplina({ disciplinaId, alunosDisciplina, onSave, onClose }: ModalAlunosProps) {
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [alunosSelecionados, setAlunosSelecionados] = useState<Aluno[]>(alunosDisciplina); // Agora com objetos Aluno

    useEffect(() => {
        async function fetchAlunos() {
            try {
                const response = await fetch('http://localhost:3000/alunos');
                const data = await response.json();
                setAlunos(data);
            } catch (error) {
                console.error('Erro ao obter alunos:', error);
            }
        }
        fetchAlunos();
    }, []);

    const handleSelectAluno = (aluno: Aluno) => {
        const alreadySelected = alunosSelecionados.some((a) => a.id === aluno.id);
        setAlunosSelecionados((prevState) =>
            alreadySelected
                ? prevState.filter((a) => a.id !== aluno.id) // Remove se já estiver selecionado
                : [...prevState, aluno] // Adiciona se não estiver selecionado
        );
    };

    const handleSave = () => {
        onSave(disciplinaId, alunosSelecionados);
        onClose();
    };

    return (
        <dialog open className="modal">
            <div className="modal-box">
                <h2>Atualizar Alunos</h2>
                <ul>
                    {alunos.map((aluno) => (
                        <li key={aluno.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={alunosSelecionados.some((a) => a.id === aluno.id)} // Checa se o aluno já foi selecionado
                                    onChange={() => handleSelectAluno(aluno)}
                                />
                                {aluno.nome}
                            </label>
                        </li>
                    ))}
                </ul>
                <div className="modal-action">
                    <button className="btn" onClick={onClose}>Cancelar</button>
                    <button className="btn btn-success" onClick={handleSave}>Salvar</button>
                </div>
            </div>
        </dialog>
    );
}

export default ModalAlunosDisciiplina
