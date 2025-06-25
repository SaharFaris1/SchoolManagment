import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import Home from '../pages/Home';
import AddStudent from '../pages/Admin/AddStudent';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AddClass from '../pages/Admin/AddClass';
import AddTeacher from '../pages/Admin/AddTeacher';
import AddPrinciple from '../pages/Admin/AddPrinciple';
import EditStudent from '../pages/Admin/EditStudent';
import EditTeacher from '../pages/Admin/EditTeacher';

import Nav from '../components/Nav';
import Footer  from '../components/Footer';
import AdminSideBar from '../components/Admin/SideBar';
import Signin from '../pages/Signin';
function Layout() {
  return (
      <>
          <Outlet />
         
      </>
  );
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/admin/dashboard", element: <AdminDashboard /> },
      { path: "/admin/addstudent", element: <AddStudent /> },
      { path: "/admin/addClass", element: <AddClass /> },
      { path: "/admin/addteacher", element: <AddTeacher /> },
      { path: "/admin/addprinciple", element: <AddPrinciple /> },
      { path: "/admin/editStudent", element: <EditStudent /> },
      { path: "/admin/editTeacher", element: <EditTeacher /> },
      { path: "/admin/addclass", element: <AddClass /> },
    
     


  
    ]
  },
  { path: "/signin", element: <Signin /> },

 
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;