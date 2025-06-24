import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
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