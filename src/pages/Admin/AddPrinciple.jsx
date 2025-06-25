import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AdminSideBar from "../../components/Admin/SideBar";
function AddPrinciple() {
  const navigate = useNavigate();


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [classId, setClassId] = useState("");
  const [classes, setClasses] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);


  useEffect(() => {
    fetch("https://685a896b9f6ef9611156cfd9.mockapi.io/Class") 
      .then((res) => res.json())
      .then(setClasses)
      .catch((error) => {
        console.error("فشل في جلب الفصول", error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "All Fields Required",
        confirmButtonText: "Ok",
      });
    }

    try {
      const response = await fetch(
        "https://685a896b9f6ef9611156cfd9.mockapi.io/Users", 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role: "principle",
            classId, 
          }),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: " Added Success",
          showConfirmButton: false,
          timer: 1500,
        });

        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1500);
      } else {
        throw new Error("Response not OK");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "فشل في الاتصال",
        text: error.message,
        confirmButtonText: "Ok",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
        <div className="hidden md:block w-64 h-screen sticky top-0 left-0">
      <AdminSideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <main className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 m-6">
          <h1 className="text-2xl font-bold mb-4"> Add Principle</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* اسم المشرف */}
            <div>
              <label className="block font-semibold mb-2">Name</label>
              <input
                type="text"
                placeholder=" name "
                className="w-full border px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* البريد الإلكتروني */}
            <div>
              <label className="block font-semibold mb-2"> Email</label>
              <input
                type="email"
                placeholder="email"
                className="w-full border px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* كلمة المرور */}
            <div>
              <label className="block font-semibold mb-2"> Password</label>
              <input
                type="password"
                placeholder="password"
                className="w-full border px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* اختيار الفصل */}
            <div>
              <label className="block font-semibold mb-2"> Assign class</label>
              <select
                className="w-full border px-4 py-2 rounded-xl"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
              >
                <option value=""> Choose class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {/* زر الإرسال */}
            <button
              type="submit"
              className="w-full bg-sky-700 hover:bg-sky-800 text-white px-4 py-2 rounded-xl transition"
            >
             Add
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default AddPrinciple;