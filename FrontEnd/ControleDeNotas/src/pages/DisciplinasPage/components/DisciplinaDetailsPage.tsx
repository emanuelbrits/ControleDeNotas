import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "../../../components/navbar";
import { Aluno } from "../../AlunosPage/AlunosPage";
import "./DisciplinaDetailsPage.css"

const DisciplinaDetailsPage: React.FC = () => {
    const { disciplinaId } = useParams<{ disciplinaId: string }>();
    const [disciplina, setDisciplina] = useState<{ nome: string; professor: { nome: string }; alunos: (Aluno & { boletins: { nota1: number; nota2: number; nota3: number }[] })[] } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [editingAlunoId, setEditingAlunoId] = useState<number | null>(null);
    const [notasEditadas, setNotasEditadas] = useState<{ [alunoId: number]: { nota1: number; nota2: number; nota3: number } }>({});

    useEffect(() => {
        async function fetchDisciplina() {
            try {
                const response = await fetch(`http://localhost:3000/disciplina/${disciplinaId}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setDisciplina(data);
            } catch (error) {
                console.error('Erro ao obter disciplina:', error);
            }
        }
        fetchDisciplina();
    }, [disciplinaId]);

    const filteredAlunos = disciplina?.alunos?.filter((aluno: Aluno) =>
        aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAlunos.slice(indexOfFirstItem, indexOfLastItem);

    // Função para lidar com a edição
    const handleEdit = (alunoId: number) => {
        setEditingAlunoId(alunoId);
        const boletim = disciplina?.alunos.find((aluno) => aluno.id === alunoId)?.boletins[0];
        if (boletim) {
            setNotasEditadas({
                [alunoId]: { nota1: boletim.nota1, nota2: boletim.nota2, nota3: boletim.nota3 }
            });
        }
    };

    // Função para salvar as notas editadas
    const handleSave = async (alunoId: number) => {
        const updatedNotas = notasEditadas[alunoId];
        try {
            const response = await fetch(`http://localhost:3000/disciplina/${disciplinaId}/boletim/${alunoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nota1: updatedNotas.nota1,
                    nota2: updatedNotas.nota2,
                    nota3: updatedNotas.nota3,
                }),
            });
            if (!response.ok) throw new Error('Failed to save notas');
            setEditingAlunoId(null);
            // Atualizar a página ou disciplina após salvar
            // Recarregar a disciplina para refletir as alterações
            const updatedResponse = await fetch(`http://localhost:3000/disciplina/${disciplinaId}`);
            const updatedData = await updatedResponse.json();
            setDisciplina(updatedData);
        } catch (error) {
            console.error('Erro ao salvar notas:', error);
        }
    };


    // Função para lidar com alterações nos inputs
    const handleInputChange = (alunoId: number, notaKey: keyof { nota1: number; nota2: number; nota3: number }, value: number) => {
        setNotasEditadas((prevNotas) => ({
            ...prevNotas,
            [alunoId]: {
                ...prevNotas[alunoId],
                [notaKey]: value,
            },
        }));
    };

    return (
        <>
            <NavBar />
            <div>
                {disciplina ? (
                    <>
                        <div className="detalhesDisciplina">
                            <h1>Disciplina: {disciplina.nome}</h1>
                            <h2>Professor: {disciplina.professor.nome}</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table" id="tableProfessores">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Nota 1</th>
                                        <th>Nota 2</th>
                                        <th>Nota 3</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((aluno) => (
                                        <tr key={aluno.id}>
                                            <td>{aluno.nome}</td>
                                            {editingAlunoId === aluno.id ? (
                                                <>
                                                    <td>
                                                        <input id="inputNotas"
                                                            type="number"
                                                            value={notasEditadas[aluno.id]?.nota1 ?? 0}
                                                            onChange={(e) =>
                                                                handleInputChange(aluno.id, 'nota1', parseFloat(e.target.value))
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        <input id="inputNotas"
                                                            type="number"
                                                            value={notasEditadas[aluno.id]?.nota2 ?? 0}
                                                            onChange={(e) =>
                                                                handleInputChange(aluno.id, 'nota2', parseFloat(e.target.value))
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        <input id="inputNotas"
                                                            type="number"
                                                            value={notasEditadas[aluno.id]?.nota3 ?? 0}
                                                            onChange={(e) =>
                                                                handleInputChange(aluno.id, 'nota3', parseFloat(e.target.value))
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        <button onClick={() => handleSave(aluno.id)}>Salvar</button>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td>{aluno.boletins[0]?.nota1 ?? 0}</td>
                                                    <td>{aluno.boletins[0]?.nota2 ?? 0}</td>
                                                    <td>{aluno.boletins[0]?.nota3 ?? 0}</td>
                                                    <td>
                                                        <button onClick={() => handleEdit(aluno.id)}>Editar</button>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <p>Carregando...</p>
                )}
            </div>
        </>
    );
};

export default DisciplinaDetailsPage;
