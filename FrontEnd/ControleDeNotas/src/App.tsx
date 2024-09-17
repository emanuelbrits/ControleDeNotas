import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import ProfessoresPage from './pages/ProfessoresPage/professoresPage'
import DisciplinasPage from './pages/DisciplinasPage/DisciplinasPage'
import AlunosPage from './pages/AlunosPage/AlunosPage'

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index path='/' element={<ProfessoresPage></ProfessoresPage>}></Route>
          <Route index path='/disciplinas' element={<DisciplinasPage></DisciplinasPage>}></Route>
          <Route index path='/alunos' element={<AlunosPage></AlunosPage>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
