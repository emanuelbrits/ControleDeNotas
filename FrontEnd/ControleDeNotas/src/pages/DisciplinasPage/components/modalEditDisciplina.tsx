import { useEffect, useState } from 'react';
import { Professor } from '../../ProfessoresPage/professoresPage'; // Ajuste o caminho conforme necessário

interface ModalEditDisciplinaProps {
    idDisciplina?: number;
    nomeDisciplina?: string;
    professorId?: number;
    onSave: (disciplina: Disciplina) => void; // Aceitar objeto completo do tipo Disciplina
}

interface Disciplina {
    id: number;
    nome: string;
    professor: Professor;
    alunos: number[];
}

function ModalEditDisciplina({ idDisciplina, nomeDisciplina, professorId, onSave }: ModalEditDisciplinaProps) {
    const [nome, setNome] = useState<string>('');
    const [selectedProfessor, setSelectedProfessor] = useState<Professor | undefined>(undefined);
    const [professores, setProfessores] = useState<Professor[]>([]);

    useEffect(() => {
        // Fetch professores when component mounts
        const fetchProfessores = async () => {
            try {
                const response = await fetch('http://localhost:3000/professores');
                const data = await response.json();
                setProfessores(data);
            } catch (error) {
                console.error('Failed to fetch professors:', error);
            }
        };

        fetchProfessores();
    }, []);

    useEffect(() => {
        if (idDisciplina) {
            setNome(nomeDisciplina || '');
            const professor = professores.find(p => p.id === professorId);
            setSelectedProfessor(professor);
        }
    }, [idDisciplina, nomeDisciplina, professorId, professores]);

    const handleSave = async () => {
        if (idDisciplina && selectedProfessor) {
            try {
                const response = await fetch(`http://localhost:3000/disciplina/${idDisciplina}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nome, professorId: selectedProfessor.id }),
                });

                if (!response.ok) {
                    throw new Error('Failed to update disciplina');
                }

                const updatedDisciplina = await response.json();
                onSave(updatedDisciplina);
                handleClose();
            } catch (error) {
                console.error('Failed to save disciplina:', error);
            }
        }
    };

    const handleClose = () => {
        const modal = document.getElementById('my_modal_2');
        if (modal) (modal as HTMLDialogElement).close();
    };

    return (
        <dialog id="my_modal_2" className="modal">
            <div className="modal-box">
                <label className="input input-bordered flex items-center gap-2" id="campoNome">
                    <input
                        type="text"
                        className="grow"
                        placeholder="Nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    <select
                        className="grow"
                        value={selectedProfessor?.id || ''}
                        onChange={(e) => {
                            const selectedId = Number(e.target.value);
                            const professor = professores.find(p => p.id === selectedId);
                            setSelectedProfessor(professor);
                        }}
                    >
                        <option value="">Selecione o Professor</option>
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
                            <button className="btn btn-error" onClick={handleClose}>
                                Cancelar
                            </button>
                        </form>
                    </div>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-success" onClick={handleSave}>
                                Salvar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </dialog>
    );
}

export default ModalEditDisciplina;
