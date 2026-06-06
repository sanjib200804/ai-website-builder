import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useSelector } from 'react-redux'
import DashBoard from './pages/DashBoard'
import Generate from './pages/Generate'
import Editor from './pages/Editor'
import { Toaster } from 'react-hot-toast'

// High-quality engineering practice: Abstract protection logic
const ProtectedRoute = ({ isAllowed, children }) => {
  if (!isAllowed) {
    return <Navigate to='/' replace />
  }
  return children
}

const App = () => {
  useGetCurrentUser()
  const { userData } = useSelector(state => state.user)

  return (
    <BrowserRouter>
      <Toaster position='top-right' reverseOrder={false} />
      <Routes>
        {/* Public Route: Always accessible */}
        <Route path='/' element={<Home />} />

        {/* Private Routes: Wrapped for clarity */}
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute isAllowed={!!userData}>
              <DashBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/generate'
          element={
            <ProtectedRoute isAllowed={!!userData}>
              <Generate />
            </ProtectedRoute>
          }
        />
        <Route
          path='/editor/:id'
          element={
            <ProtectedRoute isAllowed={!!userData}>
              <Editor />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
