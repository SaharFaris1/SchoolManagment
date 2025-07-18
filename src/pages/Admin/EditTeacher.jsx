import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import AdminSideBar from "../../components/Admin/SideBar";
function EditTeacher() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [classId, setClassId] = useState("");
  const [classes, setClasses] = useState([]);
  const [existingRecord, setExistingRecord] = useState(null); // لحفظ السجل القديم إن وُجد


  useEffect(() => {
    fetch(`https://685a896b9f6ef9611156cfd9.mockapi.io/Users/${id}`) 
      .then((res) => res.json())
      .then((data) => {
        setName(data.name || "");
        setEmail(data.email || "");
        setPassword(data.password || "");
        setClassId(data.classId || "");

       
        return fetch(
          `https://685bc72989952852c2daf0c8.mockapi.io/ClassTeacher?teacherId=${id}`
        );
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setExistingRecord(data[0]); 
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "فشل في جلب البيانات",
          text: error.message,
          confirmButtonText: "Ok",
        });
      });
  }, [id]);


  useEffect(() => {
    fetch("https://685a896b9f6ef9611156cfd9.mockapi.io/Class")
      .then((res) => res.json())
      .then(setClasses)
      .catch((error) => console.error("   Erroor ", error));
  }, []);


  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Enter Teacher Name",
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
            role: "teacher",
            classId,
          }),
        }
      );

      if (!userResponse.ok) throw new Error("فشل في تحديث بيانات المعلم");

   
      if (classId) {
        if (existingRecord && existingRecord.id) {
     
          await fetch(
            `https://685bc72989952852c2daf0c8.mockapi.io/ClassTeacher/${existingRecord.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                teacherId: id,
                classId,
              }),
            }
          );
        } else {
       
          await fetch(
            "https://685bc72989952852c2daf0c8.mockapi.io/ClassTeacher",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                teacherId: id,
                classId,
              }),
            }
          );
        }
      }


      Swal.fire({
        icon: "success",
        title: "Updated Successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1500);

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: " Error   ",
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
          <h1 className="text-2xl font-bold mb-4">Edit Teacher</h1>
          <form onSubmit={handleUpdate} className="space-y-4">

          
            <div>
              <label className="block font-semibold mb-2">Teacher Name</label>
              <input
                type="text"
                placeholder="Enter teacher name"
                className="w-full border px-4 py-2 rounded-xl"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>


            <div>
              <label className="block font-semibold mb-2">Email</label>
              <input
                type="email"
                placeholder="teacher@example.com"
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
                <option value="">Assign Class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

          
            <button
              type="submit"
              className="w-full bg-sky-700 text-white px-4 py-2 rounded-xl hover:bg-sky-800 transition"
            >
              Update Teacher
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default EditTeacher;