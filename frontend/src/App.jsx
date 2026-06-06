import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useSelector } from 'react-redux'
import DashBoard from './pages/DashBoard'
import Generate from './pages/Generate'
import Editor from './pages/Editor'
import { Toaster } from 'react-hot-toast'

const App = () => {
  useGetCurrentUser()
  const { userData } = useSelector(state => state.user)
  return (
    <BrowserRouter>
      <Toaster position='top-right' reverseOrder={false} />
      <Routes>
        {/* If logged in, visiting the root should take you to the dashboard */}
        <Route
          path='/'
          element={userData ? <Navigate to='/dashboard' replace /> : <Home />}
        />

        <Route
          path='/dashboard'
          element={userData ? <DashBoard /> : <Navigate to='/' replace />}
        />

        <Route
          path='/generate'
          element={userData ? <Generate /> : <Navigate to='/' replace />}
        />
        <Route
          path='/editor/:id'
          element={userData ? <Editor /> : <Navigate to='/' replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
