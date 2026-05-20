import './App.css'
import { ThemeProvider } from '@emotion/react'
import {theme} from './theme/Palette'
import DashBoard from './components/DashBoard'
import Header from './components/Header'
import DeleteModal from './components/DeleteModal'

function App() {
  
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <DashBoard />
      <DeleteModal />
    </ThemeProvider>
  )
}

export default App
