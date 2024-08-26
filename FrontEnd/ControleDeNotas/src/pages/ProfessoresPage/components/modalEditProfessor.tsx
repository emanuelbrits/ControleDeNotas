import { useEffect, useState } from 'react';
import './styleModalProfessores.css';
import { Professor } from '../professoresPage';

interface ModalEditProfessorProps {
  idProfessor?: number;
  nomeProfessor?: string;
  emailProfessor?: string;
  onSave: (professor: Professor) => void; // Aceitar objeto completo do tipo Professor
}

function ModalEditProfessor({ idProfessor, nomeProfessor, emailProfessor, onSave }: ModalEditProfessorProps) {
  const [nome, setNome] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    if (idProfessor && nomeProfessor && emailProfessor) {
      setNome(nomeProfessor);
      setEmail(emailProfessor);
    }
  }, [idProfessor, nomeProfessor, emailProfessor]);

  const handleSave = async () => {
    if (idProfessor) {
      try {
        const response = await fetch(`http://localhost:3000/professor/${idProfessor}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nome, email }),
        });

        if (!response.ok) {
          throw new Error('Failed to update professor');
        }

        const updatedProfessor = await response.json();

        const professorCompleto: Professor = {
          id: updatedProfessor.id,
          nome: updatedProfessor.nome,
          email: updatedProfessor.email,
          disciplinas: updatedProfessor.disciplinas || [], // Garantir que disciplinas está presente, mesmo que vazio
        };

        onSave(professorCompleto);
        handleClose();
      } catch (error) {
        console.error('Failed to save professor:', error);
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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input
            type="text"
            className="grow"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            type="text"
            className="grow"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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

export default ModalEditProfessor;

