import { useEffect, useState } from "react";
import NavBar from "../../components/navbar";
import ModalDisciplina from "./components/modalDisciplina";
import ModalEditDisciplina from "./components/modalEditDisciplina";
import ModalExcluirDisciplina from "./components/modalExcluirDisciplina";
import "./styleDisciplinas.css";
import { FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import ModalAlunosDisciiplina, { Aluno } from "./components/modalAlunosDisciplinas";

export interface Disciplina {
    id: number;
    nome: string;
    professorId: number;
    alunos: { id: number; nome: string }[];
    professor: {
        id: number;
        nome: string;
        email: string;
    };
}

function DisciplinasPage() {
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
    const [disciplinaAtual, setDisciplinaAtual] = useState<Disciplina | null>(null);

    async function getDisciplinas() {
        try {
            const response = await fetch('http://localhost:3000/disciplinas', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            const disciplinas: Disciplina[] = data.map((disciplina: any) => ({
                id: disciplina.id,
                nome: disciplina.nome,
                professorId: disciplina.professorId,
                alunos: disciplina.alunos || [],
                professor: {
                    id: disciplina.professor.id,
                    nome: disciplina.professor.nome,
                    email: disciplina.professor.email
                }
            }));

            setDisciplinas(disciplinas);
        } catch (error) {
            console.error('Erro ao obter disciplinas:', error);
        }
    }

    useEffect(() => {
        getDisciplinas();
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [searchTerm, setSearchTerm] = useState('');

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const filteredDisciplinas = disciplinas.filter(disciplina =>
        disciplina.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentItems = filteredDisciplinas.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleSearchChange = (event: any) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleClickEdit = (disciplina: Disciplina) => {
        setDisciplinaAtual(disciplina);
        document.getElementById('my_modal_2')?.showModal();
    };

    const handleDeleteDisciplina = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3000/disciplina/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar disciplina');
            }

            setDisciplinas(disciplinas.filter(disciplina => disciplina.id !== id));
        } catch (error) {
            console.error('Erro ao deletar disciplina:', error);
        }
    };

    const [selectedDisciplinaId, setSelectedDisciplinaId] = useState<number | null>(null);
    const [alunosModalVisible, setAlunosModalVisible] = useState(false);

    const handleOpenAlunosModal = (disciplinaId: number) => {
        setSelectedDisciplinaId(disciplinaId);
        setAlunosModalVisible(true);
    };

    const handleSaveAlunos = async (disciplinaId: number, alunosSelecionados: Aluno[]) => {
        try {
            const response = await fetch(`http://localhost:3000/disciplina/${disciplinaId}/alunos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ alunos: alunosSelecionados.map(aluno => aluno.id) }), // Envia os IDs dos alunos no corpo
            });

            if (!response.ok) {
                const errorData = await response.json(); // Captura a resposta de erro do servidor
                throw new Error(`Erro ao atualizar alunos: ${errorData.error}`);
            }

            const updatedDisciplina = await response.json();
            // Atualiza a lista de disciplinas na página
            setDisciplinas((prevDisciplinas) =>
                prevDisciplinas.map((disciplina) =>
                    disciplina.id === disciplinaId ? updatedDisciplina : disciplina
                )
            );
        } catch (error) {
            console.error('Erro ao salvar alunos:', error);
        }
    };

    return (
        <>
            <NavBar />
            <ModalEditDisciplina
                idDisciplina={disciplinaAtual?.id || 0}
                nomeDisciplina={disciplinaAtual?.nome || ''}
                professorId={disciplinaAtual?.professor.id || 0}
                onSave={(updatedDisciplina) => {
                    setDisciplinas(disciplinas.map(disciplina =>
                        disciplina.id === updatedDisciplina.id ? updatedDisciplina : disciplina
                    ));
                }} />
            <ModalExcluirDisciplina idDisciplina={disciplinaAtual?.id || 0} nomeDisciplina={disciplinaAtual?.nome || ''} onDelete={handleDeleteDisciplina} />
            <div className="buscaModal">
                <div className="form-control">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="input input-bordered w-24 md:w-auto"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                <ModalDisciplina onSave={(newDisciplina: Disciplina) => {
                    setDisciplinas([...disciplinas, newDisciplina]);
                }} />
            </div>
            <div className="overflow-x-auto">
                <table className="table" id="tableDisciplinas">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Professor</th>
                            <th>Alunos</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((disciplina) => (
                            <tr key={disciplina.id}>
                                <td>{disciplina.nome}</td>
                                <td>{disciplina.professor?.nome || 'Recarregue a página'}</td>
                                <td>
                                    <div className="collapse" id="botaoAlunos">
                                        <input type="checkbox" />
                                        <div className="collapse-title text-xl font-small">Ver Alunos</div>
                                        <div className="collapse-content">
                                            {disciplina.alunos.map((aluno) => (
                                                <p key={aluno.id}>{aluno.nome}</p>
                                            ))}
                                            <button onClick={() => handleOpenAlunosModal(disciplina.id)}>Atualizar Alunos</button>
                                        </div>
                                    </div>
                                </td>
                                <td id="botoesEditarExcluir">
                                    <button className="btn" onClick={() => handleClickEdit(disciplina)}><MdEdit /></button>
                                    <button className="btn" onClick={() => {
                                        setDisciplinaAtual(disciplina);
                                        document.getElementById('modalExcluirDisciplina')?.showModal();
                                    }}><FaTrashAlt /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredDisciplinas.length > itemsPerPage && (
                    <div className="pagination">
                        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                            {'<'}Anterior
                        </button>
                        <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastItem >= filteredDisciplinas.length}>
                            Próxima{'>'}
                        </button>
                    </div>
                )}
                {alunosModalVisible && selectedDisciplinaId && (
                    <ModalAlunosDisciiplina
                        disciplinaId={selectedDisciplinaId}
                        alunosDisciplina={disciplinas.find(d => d.id === selectedDisciplinaId)?.alunos || []} // Certifique-se de que os alunos sejam passados corretamente
                        onSave={handleSaveAlunos}
                        onClose={() => setAlunosModalVisible(false)}
                    />
                )}

            </div>
        </>
    );
}

export default DisciplinasPage;
