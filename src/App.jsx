import { useState } from 'react'
import './App.css'
import Router from './router/Router'
import AdminSignin from './pages/AdminSignin'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <AdminSignin/>
    </>
  )
}

export default App
