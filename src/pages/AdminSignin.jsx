import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
// import { Link, useNavigate } from "react-router";

const USERS_API = "https://685a896b9f6ef9611156cfd9.mockapi.io/Users";
export default function AdminSignin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
                const user = JSON.parse(localStorage.getItem("user"));
      
                if (user?.email === "admin@gmail.com" && user?.password === "admin123") {
                //   navigate("/admin");
                } else if (user?.role === "teacher") {
                //   navigate("/teacher");
                } else {
                //   navigate("/student");
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
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold  mb-6 text-center">
    Login
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block  font-medium text-gray-700 mb-1">
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
            <label className="block  font-medium text-gray-700 mb-1">
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
            className="w-full  bg-gray-900   hover:bg-gray-700 text-white font-medium py-2 rounded-lg transition-colors"
          >
   Login
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?
          {/* <Link
            to="/signup"
            className="text-[#3da9fc] hover:text-[#3da9fc7a] font-medium"
          >
            Sign up
          </Link> */}
        </div>
      </div>
    </div>
  </>
);
}

