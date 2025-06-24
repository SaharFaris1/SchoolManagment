import { useState } from 'react'
import './App.css'
import Router from './router/Router'

import AdminSignin from './pages/Admin/AdminSignin'
import AddStudent from './pages/Admin/AddStudent'
import AddTeacher from './pages/Admin/AddTeacher'
import AddClass from './pages/Admin/AddClass'
import AddPrinciple from './pages/Admin/AddPrinciple'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
  <AddPrinciple/>
    </>
  )
}

export default App
