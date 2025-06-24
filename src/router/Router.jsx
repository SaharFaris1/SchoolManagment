import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import Home from '../pages/Home';
import Layout from '../components/Layout';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },

  
    ]
  },

 
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;