interface ModalExcluirAlunoProps {
    idAluno: number;
    nomeAluno?: string;
    onDelete: (id: number) => void;
}

function ModalExcluirAluno({ idAluno, nomeAluno, onDelete }: ModalExcluirAlunoProps) {
    const handleDelete = () => {
        onDelete(idAluno);
        handleClose();
    };

    const handleClose = () => {
        const modal = document.getElementById('modal-excluir-aluno') as HTMLDialogElement;
        if (modal) {
            modal.close();
        }
    };

    return (
        <dialog id="modal-excluir-aluno" className="modal">
            <div className="modal-box">
                <h1>Deseja realmente excluir o(a) aluno(a) {nomeAluno}?</h1>
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

export default ModalExcluirAluno;