import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import ProfessoresPage from './pages/ProfessoresPage/professoresPage'
import DisciplinasPage from './pages/DisciplinasPage/DisciplinasPage'
import AlunosPage from './pages/AlunosPage/AlunosPage'
import DisciplinaDetailsPage from './pages/DisciplinasPage/components/DisciplinaDetailsPage'
import BoletimPage from './pages/AlunosPage/components/BoletimPage'

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index path='/' element={<ProfessoresPage></ProfessoresPage>}></Route>
          <Route index path='/disciplinas' element={<DisciplinasPage></DisciplinasPage>}></Route>
          <Route index path='/alunos' element={<AlunosPage></AlunosPage>}></Route>
          <Route path="/disciplinas/:disciplinaId" element={<DisciplinaDetailsPage />} />
          <Route path="/aluno/:alunoId" element={<BoletimPage></BoletimPage>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
