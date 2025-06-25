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
import Signin from '../pages/Signin';
import EditPrinciple from '../pages/Admin/EditPrinciple';
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
      { path: "/admin/add-student", element: <AddStudent /> },
      { path: "/admin/add-teacher", element: <AddTeacher /> },
      { path: "/admin/add-principle", element: <AddPrinciple /> },
      { path: "/admin/edit-student/:id", element: <EditStudent /> },
      { path: "/admin/edit-teacher/:id", element: <EditTeacher /> },
      { path: "/admin/add-class", element: <AddClass /> },
      { path: "/admin/edit-principal/:id", element: <EditPrinciple /> },

    
     


  
    ]
  },
  { path: "/signin", element: <Signin /> },

 
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;