import { useEffect, useState } from "react";
import "../styleDisciplinas.css"

interface Professor {
    id: number;
    nome: string;
}

interface ModalDisciplinaProps {
    onSave: (newDisciplina: Disciplina) => void;
}

interface Disciplina {
    id: number;
    nome: string;
    professorId: number;
    alunos: number[];
}

function ModalDisciplina({ onSave }: ModalDisciplinaProps) {
    const [professores, setProfessores] = useState<Professor[]>([]);
    const [nome, setNome] = useState('');
    const [professorId, setProfessorId] = useState<number | null>(null);
    const [alunos, setAlunos] = useState<number[]>([]);

    useEffect(() => {
        async function fetchProfessores() {
            try {
                const response = await fetch('http://localhost:3000/professores');
                const data = await response.json();
                setProfessores(data);
            } catch (error) {
                console.error('Erro ao obter professores:', error);
            }
        }
        fetchProfessores();
    }, []);

    const handleAddDisciplina = async () => {
        try {
            const response = await fetch('http://localhost:3000/disciplina', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome,
                    professorId,
                    alunos,
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao adicionar disciplina');
            }

            const data = await response.json();
            console.log('Disciplina adicionada:', data);
            // Atualiza a lista de disciplinas na página principal
            onSave(data);
            document.getElementById('my_modal_1')?.close();
        } catch (error) {
            console.error('Erro ao adicionar disciplina:', error);
        }
    };

    const modalmy_modal_1 = document.getElementById('modalExcluirDisciplina') as HTMLDialogElement;

    return (
        <>
            <button className="btn" onClick={() => modalmy_modal_1?.showModal()}>
                Adicionar Disciplina
            </button>
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                    <label className="input input-bordered flex items-center gap-2" id='campoNome'>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70">
                            <path
                                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                        </svg>
                        <input type="text" className="grow" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70">
                            <path
                                d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                            <path
                                d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                        </svg>
                        <select className="grow" value={professorId ?? ''} onChange={(e) => setProfessorId(parseInt(e.target.value))}>
                            <option value="">Selecionar Professor</option>
                            {professores.map((professor) => (
                                <option key={professor.id} value={professor.id}>
                                    {professor.nome}
                                </option>
                            ))}
                        </select>
                    </label>
                    <div className="botoes">
                        <div className="modal-action">
                            <form method="dialog">
                                <button className="btn btn-error">Cancelar</button>
                            </form>
                        </div>
                        <div className="modal-action">
                            <button className="btn btn-success" onClick={handleAddDisciplina}>Adicionar</button>
                        </div>
                    </div>
                </div>
            </dialog>
        </>
    );
}

export default ModalDisciplina;
