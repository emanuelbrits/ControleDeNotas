import './styleModalProfessores.css';

interface ModalExcluirProfessorProps {
    idProfessor: number;
    nomeProfessor: string;
    onDelete: (id: number) => void;
}

function ModalExcluirProfessor({ idProfessor, nomeProfessor, onDelete }: ModalExcluirProfessorProps) {
    const handleDelete = () => {
        onDelete(idProfessor);
        handleClose();
    };

    const handleClose = () => {
        const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
        if (modal) {
            modal.close();
        }
    };

    return (
        <dialog id="my_modal_3" className="modal">
            <div className="modal-box">
                <h1>Deseja realmente excluir o(a) professor(a) {nomeProfessor}?</h1>
                <div className="botoes">
                    <div className="modal-action">
                        <button className="btn btn-error" onClick={handleClose}>Não</button>
                    </div>
                    <div className="modal-action">
                        <button className="btn btn-success" onClick={handleDelete}>Sim</button>
                    </div>
                </div>
            </div>
        </dialog>
    );
}

export default ModalExcluirProfessor;