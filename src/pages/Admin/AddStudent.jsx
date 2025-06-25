import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

function AddStudent() {
  // حالة المستخدم
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [classId, setClassId] = useState("");
  const [teacherId, setTeacherId] = useState("");

  // البيانات من MockAPI
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  // جلب الفصول والمعلمين عند التحميل
  useEffect(() => {
    // جلب الفصول (classes)
    fetch("https://685a896b9f6ef9611156cfd9.mockapi.io/Class") 
      .then((res) => res.json())
      .then(setClasses)
      .catch((error) => {
        console.error("فشل في جلب الفصول", error);
      });

    // جلب المعلمين (teachers)
    fetch("https://685a896b9f6ef9611156cfd9.mockapi.io/Users") 
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((user) => user.role === "teacher");
        setTeachers(filtered);
      })
      .catch((error) => {
        console.error("فشل في جلب المعلمين", error);
      });
  }, []);

  // إرسال البيانات
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            classId,
            teacherId,
            role: "student"
          }),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Student added successfully",
          showConfirmButton: false,
          timer: 1500,
        });

        setTimeout(() => {
          navigate("/admin/dashboard")
        }, 1500);
      } else {
        throw new Error("Response not OK");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to connect to the server",
        text: error.message,
        confirmButtonText: "Ok",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col justify-center items-center">
        <main className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 m-6">
          <h1 className="text-2xl font-bold mb-4">Add Student</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
      
            <div>
              <label className="block font-semibold mb-2">Student Name</label>
              <input
                type="text"
                placeholder="Enter student name"
                className="w-full border px-4 py-2 rounded-xl"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

      
            <div>
              <label className="block font-semibold mb-2">Email</label>
              <input
                type="email"
                placeholder="student@example.com"
                className="w-full border px-4 py-2 rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

    
            <div>
              <label className="block font-semibold mb-2">Password</label>
              <input
                type="password"
                placeholder="********"
                className="w-full border px-4 py-2 rounded-xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>


            <div>
              <label className="block font-semibold mb-2">Assign Class</label>
              <select
                className="w-full border px-4 py-2 rounded-xl"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
              >
                <option value=""> Assign Class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

        
            <div>
              <label className="block font-semibold mb-2">Assign Teacher</label>
              <select
                className="w-full border px-4 py-2 rounded-xl"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
              >
                <option value="">Assign Teacher </option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

       
            <button
              type="submit"
              className="w-full bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition"
            >
              Add Student
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default AddStudent;