import "./NavBarStyle.css"

function NavBar() {

    return (
        <div className="navbar bg-base-300" id="navbar">
            <a className="btn btn-ghost text-xl" href="/">Professores</a>
            <a className="btn btn-ghost text-xl" href="alunos">Alunos</a>
            <a className="btn btn-ghost text-xl" href="/disciplinas">Disciplinas</a>
        </div>
    )
}

export default NavBar
