import "./NavBarStyle.css"

function NavBar() {

    return (
        <div className="navbar bg-base-300" id="navbar">
            <a className="btn btn-ghost text-xl">Professores</a>
            <a className="btn btn-ghost text-xl">Alunos</a>
            <a className="btn btn-ghost text-xl">Disciplinas</a>
        </div>
    )
}

export default NavBar
