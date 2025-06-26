import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const USERS_API =
  "https://attendance-system-express.onrender.com/users/users/signin";
export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async () => {
    if (!email || !password) {
      return Swal.fire("Error", "All Fields Required", "error");
    }

    try {
      console.log("Attempting login with:", { email }); // Debug log

      const res = await axios.post(USERS_API, {
        email: email,
        password: password,
      });

      console.log("Login response:", res.data); // Debug log

      // Check if we got a token (successful login)
      if (res.data && res.data.token) {
        // Store token for API calls
        localStorage.setItem("token", res.data.token);

        // Decode JWT token to get user information
        try {
          // JWT tokens have 3 parts separated by dots: header.payload.signature
          const tokenParts = res.data.token.split(".");
          if (tokenParts.length === 3) {
            // Decode the payload (base64)
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log("JWT payload:", payload);

            // Extract user information from JWT payload
            const user = {
              id: payload.userId || payload.id,
              email: payload.email || email,
              name: payload.name || email.split("@")[0],
              role: payload.role || "student", // Use role from JWT
              token: res.data.token,
            };

            console.log("Created user object:", user);
            console.log("User ID:", user.id);
            console.log("User role:", user.role);

            localStorage.setItem("user", JSON.stringify(user));

            // Verify storage immediately
            const storedUser = localStorage.getItem("user");
            console.log("Stored user string:", storedUser);
            console.log("Parsed stored user:", JSON.parse(storedUser));

            Swal.fire({
              icon: "success",
              title: "Login Successful!",
              timer: 1500,
              showConfirmButton: false,
            });

            setTimeout(() => {
              if (user.role === "admin") {
                navigate("/admin/dashboard");
              } else if (user.role === "teacher") {
                navigate("/teacher/dashboard");
              } else if (user.role === "student") {
                navigate("/student/dashboard");
              } else if (user.role === "principle") {
                navigate("/principle/dashboard");
              } else {
                console.log("Unknown role:", user.role);
                // Default to student dashboard
                navigate("/student/dashboard");
              }
            }, 1500);
          } else {
            console.log("Invalid JWT token format");
            Swal.fire("Error", "Invalid token format", "error");
          }
        } catch (jwtError) {
          console.error("Error decoding JWT:", jwtError);
          // Fallback to basic user object
          const user = {
            email: email,
            name: email.split("@")[0],
            role: "student", // default role
            token: res.data.token,
          };

          localStorage.setItem("user", JSON.stringify(user));

          Swal.fire({
            icon: "success",
            title: "Login Successful!",
            timer: 1500,
            showConfirmButton: false,
          });

          setTimeout(() => {
            navigate("/student/dashboard");
          }, 1500);
        }
      } else {
        console.log("Login failed - invalid response:", res.data);
        Swal.fire(
          "Error",
          "Login failed. Please check your credentials.",
          "error"
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response?.data);

      if (error.response?.status === 401) {
        Swal.fire("Error", "Invalid email or password", "error");
      } else if (error.response?.status === 404) {
        Swal.fire({
          icon: "error",
          title: "Login endpoint not found",
          text: "The backend authentication service is not accessible.",
          footer: `<small>Backend URL: https://attendance-system-express.onrender.com/users/users/signin</small>`,
        });
      } else if (error.response?.status === 500) {
        Swal.fire({
          icon: "error",
          title: "Server Error",
          html: `
            <p>The backend server returned an internal error.</p>
            <p><strong>Possible causes:</strong></p>
            <ul style="text-align: left; display: inline-block;">
              <li>No users exist in the database</li>
              <li>Database connection issues</li>
              <li>User credentials don't match</li>
            </ul>
            <p><strong>Backend URL:</strong> https://attendance-system-express.onrender.com/users/users/signin</p>
          `,
          confirmButtonText: "OK",
        });
      } else if (error.code === "NETWORK_ERROR" || !error.response) {
        Swal.fire({
          icon: "error",
          title: "Network Error",
          text: "Unable to connect to the backend server. Please check your internet connection.",
          footer: `<small>Trying to connect to: https://attendance-system-express.onrender.com</small>`,
        });
      } else {
        const errorMsg =
          error.response?.data?.message || error.message || "Login failed";
        Swal.fire("Error", errorMsg, "error");
      }
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
        </div>
      </div>
    </>
  );
}
