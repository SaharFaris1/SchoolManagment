import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const USERS_API = "https://685a896b9f6ef9611156cfd9.mockapi.io/Users";
export default function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleLogin = async () => {
        if (!email || !password) {
          return Swal.fire("Error", "  All Fields Requireds", "error");
        }
        try {
            const res = await axios.get(
              `${USERS_API}?email=${email}&password=${password}`
            );
            const users = res.data;
            if (users.length > 0) {
              const user = users[0];
      
              localStorage.setItem("user", JSON.stringify(user));
      
              Swal.fire({
                icon: "success",
                title: "Login Successful!  ",
                timer: 1500,
                showConfirmButton: false,
              });
      
             
  setTimeout(() => {
    if (user.role === "admin") {
      navigate("/admin/dashboard");
    } else if (user.role === "teacher") {
      navigate("/teacher/class");
    } else if (user.role === "student") {
      navigate("/student/attendance");
    }
  }, 1500);
} else {
              Swal.fire("Error", "البريد أو كلمة المرور غير صحيحة", "error");
            }
          } catch {
            Swal.fire("Error", "حدث خطأ أثناء تسجيل الدخول", "error");
          }
        };
  return (
    <>
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white  rounded-xl shadow-lg p-8">
         <div className="flex flex-col items-center ">
          <img
          src="https://5.imimg.com/data5/RX/NO/MY-24297425/eacademics-school-28complete-school-management-software-with-mobile-app-29.png"
          alt="School Management Logo"
          className="h-30 w-30"
        />
        <h2 className="text-2xl font-bold text-sky-900 mb-6 text-center">
    Welcome Bakc!
    
        </h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block  font-medium text-sky-900 mb-1">
              Email
            </label>
            <input
              value={email}
              placeholder="email Address"
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-gray-400 focus:outline-none focus:border-gray-900 bg-transparent"
            />
          </div>

          <div>
            <label className="block text-sky-900 font-medium mb-1">
              Password
            </label>
            <input
              value={password}
              type="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-gray-400 focus:outline-none focus:border-gray-900 bg-transparent"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full  bg-sky-900   hover:bg-sky-700 text-white font-medium py-2 rounded-lg transition-colors"
          >
Sign in
          </button>
        </div>

        {/* <div className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?
          {/* <Link
            to="/signup"
            className="text-[#3da9fc] hover:text-[#3da9fc7a] font-medium"
          >
            Sign up
          </Link> */}
      
      </div>
    </div>
  </>
);
}

