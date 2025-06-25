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
import AdminSignin from '../pages/Admin/AdminSignin';

function Layout() {
  return (

      <>
          <Nav />
          <Outlet />
          <Footer />
      </>

  );


}
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/dashboard/admin", element: <AdminDashboard /> },
      { path: "/admin/addStudent", element: <AddStudent /> },
      { path: "/admin/addClass", element: <AddClass /> },
      { path: "/admin/addTeacher", element: <AddTeacher /> },
      { path: "/admin/addPrinciple", element: <AddPrinciple /> },
      { path: "/admin/editStudent", element: <EditStudent /> },
      { path: "/admin/editTeacher", element: <EditTeacher /> },

  
    ]
  },
  { path: "/signin/admin", element: <AdminSignin /> },

 
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;