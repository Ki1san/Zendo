import './App.css'
import { ThemeProvider } from '@emotion/react'
import {theme} from './theme/Palette'
import DashBoard from './components/DashBoard'
import Header from './components/Header'
import DeleteModal from './components/DeleteModal'
import { Route, Routes } from 'react-router-dom'
import Board from './components/Board'

function App() {

  return (
    <ThemeProvider theme={theme}>
      <Header />

      <Routes>
        <Route path="/" element={<DashBoard />} />
        <Route path= '/board/:id' element={<Board />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
