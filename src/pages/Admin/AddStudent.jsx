import { useEffect, useState } from "react";
import Swal from "sweetalert2";
function AddStudent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [classId, setClassId] = useState("");
  const [classes, setClasses] = useState([]);
  useEffect(() => {
    fetch("https://685a896b9f6ef9611156cfd9.mockapi.io/Class") 
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setClasses(data); 
      })
      .catch((error) => {
        console.error("فشل في جلب الكلاسات", error);
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            classId,
            password,
            role: "student",
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
          //navigate("/admin");
        }, 1500);
      } else {
        Swal.fire({
          icon: "error",
          title: "An error occurred while adding",
          confirmButtonText: "Ok",
        });
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
    <div className="flex min-h-screen">

    <div className="flex-1 flex flex-col align-center">
      <main className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="p-6 max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Add Students </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="font-semibold">Student Name</label>
            <input
              type="text"
              placeholder=" student name"
              className="w-full border px-4 py-2 rounded-xl"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
             <label className="font-semibold">Student Email</label>
            <input
              type="email"
              placeholder="student email"
              className="w-full border px-4 py-2 rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
             <label className="font-semibold">Student Password</label>
            <input
              type="password"
              placeholder="password"
              className="w-full border px-4 py-2 rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
             <label className="font-semibold p-2">Assign Class</label>
            <select
              className="w-full border px-4 py-2 rounded-xl"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
            >
              
              <option value=""> Choose Class</option>
              {classes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="w-full bg-gray-900 text-white px-4 py-2 rounded-xl cursor-pointer"
            >
              Add Student
            </button>
          </form>
        </div>
      </main>
    </div>
  </div>
);
}

export default AddStudent