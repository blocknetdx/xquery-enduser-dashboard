import React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { light, dark } from './theme'
import { useSelector } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import { Dashboard, Login } from './pages'
import { useAccountCenter } from '@web3-onboard/react'

const App = () => {
  const updateAccountCenter = useAccountCenter()
  updateAccountCenter({ position: 'bottomRight' })
  const mode = useSelector(state => state.toogle.darkMode)

  return (
    <ThemeProvider theme={mode === 'true' ? dark : light}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          {/* <Route path='/' element={<Navigate replace to="/login" />} />
          <Route path='/login' element={<Navigate replace to="/" />} /> */}
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </ThemeProvider>
  )
}

export default App
