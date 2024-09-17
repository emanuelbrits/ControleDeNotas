import { useState } from 'react';

interface ModalAlunoProps {
  onSave: (aluno: { id: number; nome: string; email: string; disciplinas: string[] }) => void;
}

function ModalAluno({ onSave }: ModalAlunoProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  const handleAdd = async () => {
    try {
      const response = await fetch('http://localhost:3000/aluno', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email }),
      });

      if (!response.ok) {
        throw new Error('Failed to add aluno');
      }

      const newAluno = await response.json();
      onSave({ ...newAluno, disciplinas: [] }); // Adiciona um array vazio de disciplinas
      handleClose();
    } catch (error) {
      console.error('Failed to add aluno:', error);
    }
  };

  const handleClose = () => {
    setNome('');
    setEmail('');
    const modal = document.getElementById('modal-add-aluno');
    if (modal) (modal as HTMLDialogElement).close();
  };

  return (
    <>
      <button className="btn" onClick={() => document.getElementById('modal-add-aluno').showModal()}>Adicionar Aluno</button>
      <dialog id="modal-add-aluno" className="modal">
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

export default ModalAluno;
