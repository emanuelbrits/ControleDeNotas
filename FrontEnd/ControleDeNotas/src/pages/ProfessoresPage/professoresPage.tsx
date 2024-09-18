import { useEffect, useState } from "react";
import NavBar from "../../components/navbar";
import ModalEditProfessor from "./components/modalEditProfessor";
import ModalProfessor from "./components/modalProfessor";
import './styleProfessoresPage.css';
import ModalExcluirProfessor from "./components/modalExcluirProfessor";
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export interface Professor {
  id: number;
  nome: string;
  email: string;
  disciplinas: string[];
}

function ProfessoresPage() {

  const [professores, setProfessores] = useState<Professor[]>([]);
  const [professorAtual, setProfessorAtual] = useState<Professor | null>(null);

  async function getProfessores() {
    try {
      const response = await fetch('http://localhost:3000/professores', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setProfessores(data);
    } catch (error) {
      console.error('Erro ao obter professores:', error);
    }
  }

  useEffect(() => {
    getProfessores();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredProfessores = professores.filter(professor =>
    professor.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentItems = filteredProfessores.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleClickEdit = (professor: Professor) => {
    setProfessorAtual(professor);
    const modal = document.getElementById('my_modal_2') as HTMLDialogElement;
    modal?.showModal();
  };

  const handleDeleteProfessor = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/professor/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar professor');
      }

      // Remove o professor da lista
      setProfessores(professores.filter(professor => professor.id !== id));
    } catch (error) {
      console.error('Erro ao deletar professor:', error);
    }
  };

  return (
    <>
      <NavBar />
      <ModalEditProfessor idProfessor={professorAtual?.id} nomeProfessor={professorAtual?.nome} emailProfessor={professorAtual?.email} onSave={updatedProfessor => {
        setProfessores(professores.map(professor =>
          professor.id === updatedProfessor.id ? updatedProfessor : professor
        ));
      }} />
      <ModalExcluirProfessor idProfessor={professorAtual?.id!} nomeProfessor={professorAtual?.nome!} onDelete={handleDeleteProfessor} />
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
        <ModalProfessor onSave={(newProfessor: Professor) => {
          setProfessores([...professores, newProfessor]);
        }} />
      </div>
      <div className="overflow-x-auto">
        <table className="table" id="tableProfessores">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Disciplinas</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((professor) => (
              <tr key={professor.id}>
                <td>{professor.nome}</td>
                <td>{professor.email}</td>
                <td>
                  <div className="collapse" id="botaoDisciplinas">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-small">Ver Disciplinas</div>
                    <div className="collapse-content" id="disciplinas">
                      {professor.disciplinas.map((disciplina) => (
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
                  <button className="btn" onClick={() => handleClickEdit(professor)}><MdEdit /></button>
                  <button className="btn" onClick={() => {
                    setProfessorAtual(professor);
                    const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
                    modal?.showModal();
                  }}><FaTrashAlt /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProfessores.length > itemsPerPage && (
          <div className="pagination">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              {'<'}Anterior
            </button>
            <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastItem >= filteredDisciplinas.length}>
              Próxima{'>'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default ProfessoresPage;
