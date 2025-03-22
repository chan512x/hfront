import { useState } from 'react'
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Lpage from './Lpage'
import Ap from './SignUI'
import SignUp from './SignUp'
import Login from './Login'
import Mpage from './Mpage'
import { AuthProvider } from './context/authcontext'
import ProtectedRoute from './PrivateRoutes'
function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Lpage />} /> 
        <Route path="/login" element={<Login />} /> 
        <Route path="/signup" element={<SignUp />} /> 
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Mpage />
          </ProtectedRoute>
        } /> 
      </Routes>
    </Router>
    </AuthProvider>
  )
}

export default App
