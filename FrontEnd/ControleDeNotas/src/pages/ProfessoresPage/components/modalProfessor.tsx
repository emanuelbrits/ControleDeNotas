import { useState } from 'react';
import './styleModalProfessores.css';

interface ModalProfessorProps {
  onSave: (professor: { id: number; nome: string; email: string; disciplinas: string[] }) => void;
}

function ModalProfessor({ onSave }: ModalProfessorProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  const handleAdd = async () => {
    try {
      const response = await fetch('http://localhost:3000/professor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email }),
      });

      if (!response.ok) {
        throw new Error('Failed to add professor');
      }

      const newProfessor = await response.json();
      onSave({ ...newProfessor, disciplinas: [] }); // Adiciona um array vazio de disciplinas
      handleClose();
    } catch (error) {
      console.error('Failed to add professor:', error);
    }
  };

  const handleClose = () => {
    setNome('');
    setEmail('');
    const modal = document.getElementById('my_modal_1');
    if (modal) (modal as HTMLDialogElement).close();
  };

  const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
  modal?.showModal();

  return (
    <>
      <button className="btn" onClick={() => modal?.showModal()}>Adicionar Professor</button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <label className="input input-bordered flex items-center gap-2" id='campoNome'>
            <input
              type="text"
              className="grow"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
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
                <button className="btn btn-error" onClick={handleClose}>Cancelar</button>
              </form>
            </div>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn btn-success" onClick={handleAdd}>Adicionar</button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default ModalProfessor;
