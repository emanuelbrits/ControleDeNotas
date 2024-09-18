import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "../../../components/navbar";
import { Disciplina } from "../../DisciplinasPage/DisciplinasPage";
import "./styleBoletim.css"
import jsPDF from "jspdf";
import "jspdf-autotable";

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

    // Função para gerar o PDF
    const gerarPDF = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(16);
        doc.text(`Boletim do Aluno: ${aluno?.nome}`, 10, 10);
        doc.setFontSize(12);
        
        const tableColumn = ["Disciplina", "Nota 1", "Nota 2", "Nota 3", "Média", "Situação"];
        const tableRows: any[] = [];

        aluno?.disciplinas.forEach((disciplina) => {
            const notas = disciplina.boletins[0];
            const media = ((notas?.nota1 + notas?.nota2 + notas?.nota3) / 3).toFixed(2);
            const situacao = media >= 7 ? "Aprovado" : "Reprovado";
            
            const disciplinaData = [
                disciplina.nome,
                notas?.nota1 ?? 0,
                notas?.nota2 ?? 0,
                notas?.nota3 ?? 0,
                media,
                situacao,
            ];
            tableRows.push(disciplinaData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save(`boletim-${aluno?.nome}.pdf`);
    };

    return (
        <>
            <NavBar />
            <div>
                {aluno ? (
                    <>
                        <div className="detalhesaluno">
                            <h1>Nome: {aluno.nome}</h1>
                            <button onClick={gerarPDF} className="btn btn-primary">Gerar PDF</button>
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
                                                    <p>Aprovado</p>
                                                ) : (
                                                    <p>Reprovado</p>
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
