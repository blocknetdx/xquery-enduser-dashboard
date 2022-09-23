import React from 'react'
import { ThemeProvider } from "@mui/material/styles"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { light, dark } from "./theme"
import { useSelector } from 'react-redux'
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"
import './App.css'

import { Dashboard, Login } from "./pages"
import { useAccountCenter, useConnectWallet } from '@web3-onboard/react'
import { useEagerConnect, useVerifySignature } from './hooks'

const App = () => {
  const { preConnect } = useEagerConnect()

  const [{ wallet }] = useConnectWallet()
  const updateAccountCenter = useAccountCenter()
  updateAccountCenter({ position: 'bottomRight' })
  const { loading, signature, setDirect } = useVerifySignature()
  const mode = useSelector((state) => state.toogle.darkMode)

  return (
    <ThemeProvider theme={mode === 'true' ? dark : light}>
      <BrowserRouter>
        <Routes>
          {
            !preConnect && <>
              <Route path="/login" element={!wallet || !signature ? <Login loading={loading} setDirect={setDirect} /> : <Navigate replace to="/" />} />
              <Route path="/" element={wallet && signature ? <Dashboard signature={signature} /> : <Navigate replace to="/login" />} />
            </>
          }
          {/* <Route path='/' element={<Navigate replace to="/login" />} />
          <Route path='/login' element={<Navigate replace to="/" />} /> */}
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </ThemeProvider>
  )
}

export default App
