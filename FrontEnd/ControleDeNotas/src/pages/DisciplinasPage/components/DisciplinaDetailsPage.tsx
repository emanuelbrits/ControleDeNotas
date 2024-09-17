import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "../../../components/navbar";
import { Aluno } from "../../AlunosPage/AlunosPage";

const DisciplinaDetailsPage: React.FC = () => {
    const { disciplinaId } = useParams<{ disciplinaId: string }>();
    const [disciplina, setDisciplina] = useState<{ nome: string; alunos: Aluno[] } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);

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

    // Verificar se disciplina não é null antes de acessar alunos
    const filteredAlunos = disciplina?.alunos?.filter((aluno: Aluno) =>
        aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAlunos.slice(indexOfFirstItem, indexOfLastItem);

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
                        <table className="table" id="tableProfessores">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Nota 1</th>
                                    <th>Nota 2</th>
                                    <th>Nota 3</th>
                                    <th>Nota 4</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((aluno) => (
                                    <tr key={aluno.id}>
                                        <td>{aluno.nome}</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <p>Carregando...</p>
                )}
            </div>
        </>
    );
};

export default DisciplinaDetailsPage;
