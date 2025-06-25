import React, { useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import Swal from "sweetalert2";

function EditTeacher() {
    const { id } = useParams(); 
    //const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [classId, setClassId] = useState("");
    const [classes, setClasses] = useState([]);
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
    }, [id]);
  
  
    useEffect(() => {
      fetch("https://685a896b9f6ef9611156cfd9.mockapi.io/Class") 
        .then((res) => res.json())
        .then((data) => {
          setClasses(data);
        })
        .catch((error) => {
          console.error("فشل في جلب الكلاسات", error);
        });
    }, []);
    const handleUpdate = async (e) => {
        e.preventDefault();
    
        if (!name.trim()) {
          return Swal.fire({
            icon: "warning",
            title: "Enter Name",
            confirmButtonText: "Ok",
          });
        }
    
        try {
          const response = await fetch(
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
                classId,
              }),
            }
          );
    
          if (response.ok) {
            Swal.fire({
              icon: "success",
              title: "Student updated successfully",
              showConfirmButton: false,
              timer: 1500,
            });
    
            setTimeout(() => {
             // navigate("/admin"); 
            }, 1500);
          } else {
            throw new Error("Response not OK");
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Failed to update student",
            text: error.message,
            confirmButtonText: "Ok",
          });
        }
      };
  return (
    <div className="flex min-h-screen bg-gray-100">
    <div className="flex-1 flex flex-col justify-center items-center">
      <main className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 m-6">
        <h1 className="text-2xl font-bold mb-4">Edit Teacher</h1>
        <form onSubmit={handleUpdate} className="space-y-4">

          <div>
            <label className="block font-semibold mb-2">Teacher Name</label>
            <input
              type="text"
              placeholder=" teacher name"
              className="w-full border px-4 py-2 rounded-xl"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>


          <div>
            <label className="block font-semibold mb-2">Email</label>
            <input
              type="email"
              placeholder="email address"
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
              <option value=""> Assign Class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

        
          <button
            type="submit"
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition"
          >
            Update Teacher
          </button>
        </form>
      </main>
    </div>
  </div>
  )
}

export default EditTeacher