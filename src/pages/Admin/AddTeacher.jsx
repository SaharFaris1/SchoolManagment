import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import AdminSideBar from "../../components/Admin/SideBar";
function AddTeacher() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [classId, setClassId] = useState("");
  const [classes, setClasses] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

 
  useEffect(() => {
    fetch("https://685a896b9f6ef9611156cfd9.mockapi.io/Class") 
      .then((res) => res.json())
      .then(setClasses);
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
  
      const userResponse = await fetch(
        "https://685a896b9f6ef9611156cfd9.mockapi.io/Users", 
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            role: "teacher",
            classId, 
          }),
        }
      );

      if (!userResponse.ok) throw new Error("فشل في إضافة المعلم");

      const newTeacher = await userResponse.json(); 

     
      if (classId) {
        await fetch("https://685bc72989952852c2daf0c8.mockapi.io/ClassTeacher",  {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            classId: classId,
            teacherId: newTeacher.id 
          })
        });
      }

 
      Swal.fire({
        icon: "success",
        title: "Teacher added successfully!",
        timer: 1500,
        showConfirmButton: false
      });

      setTimeout(() => {
        window.location.href = "/admin/dashboard";
      }, 1500);

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to connect to the server",
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
          <h1 className="text-2xl font-bold mb-4">Add Teacher</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
      
            <div>
              <label className="block font-semibold mb-2">Teacher Name</label>
              <input
                type="text"
                placeholder=" name"
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
                <option value="">Choose Class</option>
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
              Add Teacher
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default AddTeacher;