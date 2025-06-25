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

  // دالة الإضافة ← إعادة التوجيه إلى صفحة Add Student أو Teacher
  const handleAddUser = (role) => {
    navigate(`/admin/add-${role}`);
    setSidebarOpen(false);
  };

  // دالة تسجيل الخروج ← مع SweetAlert2
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
      {/* زر الفتح ← فقط على الجوال */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-indigo-700 text-white p-2 rounded-md shadow-md hover:bg-indigo-800 transition"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* الشريط الجانبي ← يظهر دائمًا على الشاشات الكبيرة */}
      <div
        className={`fixed inset-y-0 left-0 z-30 md:relative md:translate-x-0 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col`}
      >
        <div className="p-6 flex flex-col h-full">
          {/* عنوان الإدارة */}
          <div className="inline-flex items-center gap-3 mb-6">
            <House color="#076452" />
            <h2 className="text-xl font-bold text-[#076452]">Admin Panel</h2>
          </div>

          <hr className="h-[1px] bg-gray-300 my-4" />

          {/* القائمة الجانبية */}
          <nav className="flex flex-col gap-2 flex-grow">
            {/* الصفحة الرئيسية */}
            <Link
              to="/admin"
              className="inline-flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded"
              onClick={() => setSidebarOpen(false)}
            >
              <House size={16} />
              <span>Home</span>
            </Link>

            {/* إضافة فصل دراسي */}
            <Link
              to="/admin/addClass"
              className="inline-flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded"
              onClick={() => setSidebarOpen(false)}
            >
              <UserPlus size={16} />
              <span>Add Class</span>
            </Link>

            {/* إضافة طالب */}
            <button
              onClick={() => handleAddUser("student")}
              className="inline-flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded"
            >
              <UserPlus size={16} />
              <span>Add Student</span>
            </button>

            {/* إضافة معلم */}
            <button
              onClick={() => handleAddUser("teacher")}
              className="inline-flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded"
            >
              <UserRound size={16} />
              <span>Add Teacher</span>
            </button>

            <hr className="h-[1px] bg-gray-300 my-4" />

            {/* تسجيل الخروج */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-3 px-3 py-2 mt-auto hover:bg-red-100 rounded text-red-600"
            >
              <LogOut size={16} color="#e53e3e" />
              <span>Sign Out</span>
            </button>
          </nav>
        </div>
      </div>

      {/* الطبقة الخارجية ← عند فتح الشريط على الجوال */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
}