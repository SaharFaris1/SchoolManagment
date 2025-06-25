import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import AdminSideBar from "../../components/Admin/SideBar";
function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [classId, setClassId] = useState("");
  const [classes, setClasses] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);


  useEffect(() => {
    fetch(`https://685a896b9f6ef9611156cfd9.mockapi.io/Users/${id}`) 
      .then((res) => res.json())
      .then((data) => {
        setName(data.name || "");
        setEmail(data.email || "");
        setPassword(data.password || "");
        setClassId(data.classId || "");
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "فشل في جلب البيانات",
          text: error.message,
          confirmButtonText: "Ok",
        });
      });

   
    fetch("https://685a896b9f6ef9611156cfd9.mockapi.io/Class") 
      .then((res) => res.json())
      .then(setClasses);
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Enter Student Name",
        confirmButtonText: "Ok",
      });
    }

    try {
    
      const userResponse = await fetch(
        `https://685a896b9f6ef9611156cfd9.mockapi.io/Users/${id}`, 
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role: "student", 
            classId,         
          }),
        }
      );

      if (!userResponse.ok) throw new Error("فشل في تحديث بيانات الطالب");


      const classStudentRes = await fetch(
        `https://685bc72989952852c2daf0c8.mockapi.io/CalssStudents?studentId=${id}`
      );
      const classStudentsData = await classStudentRes.json();
      const existingRecord = classStudentsData[0]; 

      if (existingRecord) {
    
        await fetch(
          `https://685bc72989952852c2daf0c8.mockapi.io/CalssStudents/${existingRecord.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              studentId: id,
              classId,
            }),
          }
        );
      } else {
      
        await fetch("https://685bc72989952852c2daf0c8.mockapi.io/CalssStudents", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId: id,
            classId,
          }),
        });
      }


      Swal.fire({
        icon: "success",
        title: "Updated Success",
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1500);

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "فشل في تحديث الطالب",
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
          <h1 className="text-2xl font-bold mb-4">Edit Student</h1>
          <form onSubmit={handleUpdate} className="space-y-4">
       
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

            {/* البريد الإلكتروني */}
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

            {/* كلمة المرور */}
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

            {/* اختيار الفصل */}
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

            {/* زر التحديث */}
            <button
              type="submit"
              className="w-full bg-sky-700 text-white px-4 py-2 rounded-xl hover:bg-sky-800 transition"
            >
              Update Student
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default EditStudent;