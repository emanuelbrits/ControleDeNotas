import NavBar from "../../components/navbar"
import ModalProfessor from "./components/modalProfessor";
import './styleProfessoresPage.css'
import { MdEdit } from "react-icons/md";

function ProfessoresPage() {

  const professores = [
    {
      "id": 1,
      "nome": "Ana Silva",
      "email": "ana.silva@example.com",
      "disciplinas": ["Matemática", "Física"]
    },
    {
      "id": 2,
      "nome": "Carlos Pereira",
      "email": "carlos.pereira@example.com",
      "disciplinas": ["História", "Geografia"]
    },
    {
      "id": 3,
      "nome": "Mariana Costa",
      "email": "mariana.costa@example.com",
      "disciplinas": ["Biologia", "Química"]
    },
    {
      "id": 4,
      "nome": "José Santos",
      "email": "jose.santos@example.com",
      "disciplinas": ["Literatura", "Português"]
    },
    {
      "id": 5,
      "nome": "Luciana Rocha",
      "email": "luciana.rocha@example.com",
      "disciplinas": ["Inglês", "Espanhol"]
    }
  ]


  return (
    <>
      <NavBar></NavBar>
      <div className="buscaModal">
        <div className="form-control">
          <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
        </div>
        <ModalProfessor></ModalProfessor>
      </div>
      <div className="overflow-x-auto">
        <table className="table" id="tableProfessores">
          {/* head */}
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Disciplinas</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {professores.map((professor) => (
              <tr key={professor.id} className="hover:bg-blue-400">
                <td>{professor.nome}</td>
                <td>{professor.email}</td>
                <td><div className="collapse" id="botaoDisciplinas">
                  <input type="checkbox" />
                  <div className="collapse-title text-xl font-small">Ver Disciplinas</div>
                  <div className="collapse-content">
                    {professor.disciplinas.map((disciplina) => (
                      <p>{disciplina}</p>
                    ))}
                  </div>
                </div></td>
                <td><MdEdit /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default ProfessoresPage
