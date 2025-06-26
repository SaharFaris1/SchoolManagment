import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  House,
  UserPlus,
  UserRound,
  LogOut,
  Menu,
  X
} from "lucide-react";

export default function AdminSideBar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();

  const handleAddUser = (role) => {
    navigate(`/admin/add-${role}`);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        navigate("/signin");

        Swal.fire(
          "Logged out!",
          "You have been successfully logged out.",
          "success"
        );
      }
    });
  };

  return (
    <>
   
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-indigo-700 text-white p-2 rounded-md shadow-md hover:bg-indigo-800 transition duration-300"
          aria-label="Toggle Sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>


      <div
        className={`fixed md:static md:flex md:w-64 md:h-full h-full w-64 bg-white shadow-xl border-r border-gray-200 flex-col z-40 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6 flex flex-col h-full justify-between">
      
          <div className="inline-flex items-center gap-3 mb-6">
            <House className="text-black"/>
            <h2 className="text-xl font-bold ">Admin </h2>
          </div>

          <hr className="h-[1px] bg-gray-300 my-4" />

      
          <nav className="flex flex-col gap-2 flex-grow">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded"
              onClick={() => setSidebarOpen(false)}
            >
              <House size={16} />
              <span>Home</span>
            </Link>

            <Link
              to="/admin/add-principle"
              className="inline-flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded"
              onClick={() => setSidebarOpen(false)}
            >
              <UserPlus size={16} />
              <span>Add Principle</span>
            </Link>

            <Link
              to="/admin/add-class"
              className="inline-flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded"
              onClick={() => setSidebarOpen(false)}
            >
              <UserPlus size={16} />
              <span>Add Class</span>
            </Link>

            <button
              onClick={() => handleAddUser("student")}
              className="inline-flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded"
            >
              <UserPlus size={16} />
              <span>Add Student</span>
            </button>

            <button
              onClick={() => handleAddUser("teacher")}
              className="inline-flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded"
            >
              <UserRound size={16} />
              <span>Add Teacher</span>
            </button>

            <hr className="h-[1px] bg-gray-300 my-4" />

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-3 px-3 py-2 mt-auto hover:bg-red-100 rounded text-red-600"
            >
              <LogOut size={16} color="#e53e3e" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>

  
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
}
