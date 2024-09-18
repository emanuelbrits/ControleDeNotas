import { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import NavBar from "../../components/navbar";
import DeleteAlunoModal from "./components/DeleteAlunoModal";
import ModalEditAluno from "./components/EditAlunoModal";
import ModalExcluirAluno from "./components/DeleteAlunoModal";
import ModalAluno from "./components/ModalAddDisciplina";
import './styleAlunos.css';
import { Link } from "react-router-dom";

interface Disciplina {
    id: number;
    nome: string;
}

export interface Aluno {
    id: number;
    nome: string;
    email: string;
    disciplinas: Disciplina[];
}

const AlunosPage: React.FC = () => {
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
    const [modalType, setModalType] = useState<'edit' | 'delete' | null>(null);

    useEffect(() => {
        async function fetchAlunos() {
            try {
                const response = await fetch('http://localhost:3000/alunos');
                if (!response.ok) throw new Error('Network response was not ok');
                const data: Aluno[] = await response.json();
                setAlunos(data);
            } catch (error) {
                console.error('Erro ao obter alunos:', error);
            }
        }
        fetchAlunos();
    }, []);

    const filteredAlunos = alunos.filter(aluno =>
        aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAlunos.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleClickEdit = (aluno: Aluno) => {
        setSelectedAluno(aluno);
        const modal = document.getElementById('modal-edit-aluno') as HTMLDialogElement;
        modal?.showModal();
    };

    const handleClickDelete = (aluno: Aluno) => {
        setSelectedAluno(aluno);
        setModalType('delete');
    };

    const handleSaveAluno = async (aluno: Aluno) => {
        try {
            const response = await fetch(`http://localhost:3000/alunos/${aluno.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(aluno),
            });

            if (!response.ok) throw new Error('Failed to update aluno');
            const updatedAluno = await response.json();
            setAlunos(alunos.map(a => (a.id === updatedAluno.id ? updatedAluno : a)));
            setModalType(null);
        } catch (error) {
            console.error('Erro ao salvar aluno:', error);
        }
    };

    const handleDeleteAluno = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3000/aluno/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar aluno');
            }

            // Remove o professor da lista
            setAlunos(alunos.filter(aluno => aluno.id !== id));
        } catch (error) {
            console.error('Erro ao deletar aluno:', error);
        }
    };

    return (
        <>
            <NavBar />
            <ModalEditAluno idAluno={selectedAluno?.id} nomeAluno={selectedAluno?.nome} emailAluno={selectedAluno?.email} onSave={updatedAluno => {
                setAlunos(alunos.map(aluno =>
                    aluno.id === updatedAluno.id ? updatedAluno : aluno
                ));
            }} />
            <ModalExcluirAluno idAluno={selectedAluno?.id!} nomeAluno={selectedAluno?.nome!} onDelete={handleDeleteAluno} />
            <div>
                <div className="buscaModal">
                    <div className="form-control">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input input-bordered w-24 md:w-auto"
                        />
                    </div>
                    <ModalAluno onSave={(newAluno: Aluno) => {
                        setAlunos([...alunos, newAluno]);
                    }} />
                </div>
                <div className="overflow-x-auto">
                    <table className="table" id="tableAlunos">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Disciplinas</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((aluno) => (
                                <tr key={aluno.id}>
                                    <td id="VerAluno">
                                        {aluno.nome}
                                        <button className="btn" id="botaoBoletim"><Link to={`/aluno/${aluno.id}`} id="areaBotao">
                                            Ver Boletim
                                        </Link></button>
                                    </td>
                                    <td>{aluno.email}</td>
                                    <td>
                                        <div className="collapse" id="botaoDisciplinas">
                                            <input type="checkbox" />
                                            <div className="collapse-title text-xl font-small">Ver Disciplinas</div>
                                            <div className="collapse-content" id="disciplinas">
                                                {aluno.disciplinas.map((disciplina) => (
                                                    <Link
                                                        to={`/disciplinas/${disciplina.id}`}
                                                        key={disciplina.id}
                                                        className="text-blue-500 hover:underline"
                                                    >
                                                        {disciplina.nome}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                    <td id="botoesEditarExcluir">
                                        <button className="btn" onClick={() => handleClickEdit(aluno)}><MdEdit /></button>
                                        <button className="btn" onClick={() => {
                                            setSelectedAluno(aluno);
                                            const modal = document.getElementById('modal-excluir-aluno') as HTMLDialogElement;
                                            modal?.showModal();
                                        }}><FaTrashAlt /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredAlunos.length > itemsPerPage && (
                        <div className="pagination">
                            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                                {'<'} Anterior
                            </button>
                            <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastItem >= filteredAlunos.length}>
                                Próxima {'>'}
                            </button>
                        </div>
                    )}
                </div>
                {modalType === 'delete' && selectedAluno && (
                    <DeleteAlunoModal
                        aluno={selectedAluno}
                        onDelete={handleDeleteAluno}
                        onClose={() => setModalType(null)}
                    />
                )}
            </div>
        </>
    );
};

export default AlunosPage;