import { useState } from 'react'
import './App.css'
import EditTeacher from './pages/Admin/EditTeacher'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AllStudent from './components/Admin/AllStudent'
import AllTeachers from './components/Admin/AllTeachers'
import AppRouter from './router/Router'

function App() {
  return (
    <>
  <AppRouter/>
    </>
  )
}

export default App
