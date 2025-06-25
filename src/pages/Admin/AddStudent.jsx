import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AdminSideBar from "../../components/Admin/SideBar";

function AddStudent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [classId, setClassId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("https://685a896b9f6ef9611156cfd9.mockapi.io/Class") 
      .then((res) => res.json())
      .then(setClasses);

    fetch("https://685a896b9f6ef9611156cfd9.mockapi.io/Users") 
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((user) => user.role === "teacher");
        setTeachers(filtered);
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

      const studentRes = await fetch(
        "https://685a896b9f6ef9611156cfd9.mockapi.io/Users", 
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            role: "student",
            classId,
            teacherId,
          }),
        }
      );

      const newStudent = await studentRes.json(); 

     
      if (classId && studentRes.ok) {
        await fetch("https://685bc72989952852c2daf0c8.mockapi.io/CalssStudents",  {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            classId,
            studentId: newStudent.id, 
          }),
        });
      }

   
      Swal.fire({
        icon: "success",
        title: "Student added successfully!",
        timer: 1500,
        showConfirmButton: false
      });

      setTimeout(() => {
        window.location.href = "/admin/dashboard";
      }, 1500);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "فشل في الاتصال",
        text: error.message,
        confirmButtonText: "Ok"
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
                placeholder="email"
                className="w-full border px-4 py-2 rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Password</label>
              <input
                type="password"
                placeholder="password"
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
                <option value="">Assign Class</option>
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
                <option value="">Assign Teacher</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-sky-800 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition"
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