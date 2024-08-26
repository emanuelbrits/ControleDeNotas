import React from 'react';

interface ModalExcluirDisciplinaProps {
    idDisciplina: number;
    nomeDisciplina: string;
    onDelete: (id: number) => void;
}

function ModalExcluirDisciplina({ idDisciplina, nomeDisciplina, onDelete }: ModalExcluirDisciplinaProps) {
    const handleDelete = () => {
        onDelete(idDisciplina);
        document.getElementById('modalExcluirDisciplina')?.close();
    };

    const handleClose = () => {
        document.getElementById('modalExcluirDisciplina')?.close();
    };

    return (
        <dialog id="modalExcluirDisciplina" className="modal">
            <div className="modal-box">
                <p>Tem certeza de que deseja excluir a disciplina <strong>{nomeDisciplina}</strong>?</p>
                <div className="modal-action">
                    <button className="btn btn-error" onClick={handleClose}>Cancelar</button>
                    <button className="btn btn-success" onClick={handleDelete}>Confirmar</button>
                </div>
            </div>
        </dialog>
    );
}

export default ModalExcluirDisciplina;
