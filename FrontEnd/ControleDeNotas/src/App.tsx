import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import ProfessoresPage from './pages/ProfessoresPage/professoresPage'

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index path='/' element={<ProfessoresPage></ProfessoresPage>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
