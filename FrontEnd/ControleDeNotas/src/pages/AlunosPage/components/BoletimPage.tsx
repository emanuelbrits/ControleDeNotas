import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "../../../components/navbar";
import { Disciplina } from "../../DisciplinasPage/DisciplinasPage";

const BoletimPage: React.FC = () => {
    const { alunoId } = useParams<{ alunoId: string }>();
    const [aluno, setAluno] = useState<{ nome: string; disciplinas: (Disciplina & { boletins: { nota1: number; nota2: number; nota3: number }[] })[] } | null>(null);

    useEffect(() => {
        async function fetchAluno() {
            try {
                const response = await fetch(`http://localhost:3000/aluno/${alunoId}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setAluno(data);
            } catch (error) {
                console.error('Erro ao obter aluno:', error);
            }
        }
        fetchAluno();
    }, [alunoId]);

    return (
        <>
            <NavBar />
            <div>
                {aluno ? (
                    <>
                        <div className="detalhesaluno">
                            <h1>Nome: {aluno.nome}</h1>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table" id="tableProfessores">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Nota 1</th>
                                        <th>Nota 2</th>
                                        <th>Nota 3</th>
                                        <th>Media</th>
                                        <th>Situacao</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {aluno.disciplinas.map((disciplina) => (
                                        <tr key={disciplina.id}>
                                            <td>{disciplina.nome}</td>
                                            <td>{disciplina.boletins[0]?.nota1 ?? 0}</td>
                                            <td>{disciplina.boletins[0]?.nota2 ?? 0}</td>
                                            <td>{disciplina.boletins[0]?.nota3 ?? 0}</td>
                                            <td>{((disciplina.boletins[0]?.nota1 + disciplina.boletins[0]?.nota2 + disciplina.boletins[0]?.nota3) / 3).toFixed(2)}</td>
                                            <td>
                                                {((disciplina.boletins[0]?.nota1 + disciplina.boletins[0]?.nota2 + disciplina.boletins[0]?.nota3) / 3) >= 7 ? (
                                                    <>
                                                        <p>Aprovado</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p>Reprovado</p>
                                                    </>
                                                )}
                                            </td>
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

export default BoletimPage;
