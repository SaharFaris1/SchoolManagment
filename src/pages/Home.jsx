import React from "react";
import { Link } from "react-router-dom";

export default function HomeScreen() {
  const isAuth = localStorage.getItem("isAuthenticated") === "true";
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  let dashboardPath = "/";
  if (user?.role === "admin") dashboardPath = "/admin";
  else if (user?.role === "teacher") dashboardPath = "/teacher";
  else if (user?.role === "student") dashboardPath = "/student";

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-sky-100 flex flex-col">

      <div className="flex justify-center py-10">
        <img
          src=""
          alt="School Management Logo"
          className=""
        />
      </div>

 
      <div className="flex-grow flex items-center justify-center z-10 px-4">
        <div className="text-center max-w-xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold drop-shadow-xs text-sky-900">
            School Management System
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-sky-900">
            A comprehensive system for managing students, teachers, and classes. 
            Login for students, teachers, and admins — everything in one place.
          </p>

       
          <div className="mt-10 lg:mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
                  to="/signin"
                  className="inline-block px-20 py-3 bg-sky-900 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-950 transition transform hover:scale-105"
                >
                  Login
                </Link>
          </div>
        </div>
      </div>

      {/* قسم التعريف بالنظام - نصوص توضيحية */
      }
      {/* <div className="bg-white py-12 px-6 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">About the System</h2>
          <p className="text-gray-600 mb-4">
            This school management system allows administrators, teachers, and students to manage their information efficiently.
          </p>
          <p className="text-gray-600 mb-6">
            Admins can add or remove students and teachers, assign them to classes, and monitor attendance.
            Teachers can track student progress, while students can view their records and attendances.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 text-left md:text-center">
            <div className="bg-sky-50 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800">For Admins</h3>
              <p className="text-sm text-gray-600 mt-2">
                Manage students, teachers, classes, and attendance reports easily from a single interface.
              </p>
            </div>

            <div className="bg-sky-50 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800">For Teachers</h3>
              <p className="text-sm text-gray-600 mt-2">
                Keep track of your students, classes, and attendance with just a few clicks.
              </p>
            </div>

            {/* <div className="bg-sky-50 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800">For Students</h3>
              <p className="text-sm text-gray-600 mt-2">
                View your attendance, class info, and personal details securely.
              </p>
            </div> */}
          {/* </div>
        </div>
      </div> */} 
    </div>
  );
}