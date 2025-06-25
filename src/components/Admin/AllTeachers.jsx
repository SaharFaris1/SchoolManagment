import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

function AllTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");

 
  useEffect(() => {
    fetch("https://685a896b9f6ef9611156cfd9.mockapi.io/Users") 
      .then((res) => res.json())
      .then((data) => {
        setTeachers(data.filter((u) => u.role === "teacher"));
      });

    fetch("https://685a896b9f6ef9611156cfd9.mockapi.io/Class") 
      .then((res) => res.json())
      .then(setClasses);
  }, []);


  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
      try {
        await fetch(`https://685a896b9f6ef9611156cfd9.mockapi.io/Users/${id}`,  {
          method: "DELETE"
        });
        setTeachers((prev) => prev.filter((t) => t.id !== id));
        Swal.fire("Deleted!", "Teacher has been deleted successfully.", "success");
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };


  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(search.toLowerCase()) ||
      teacher.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">All Teachers</h1>

  
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg mb-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

   
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-sm sm:text-base">Name</th>
                <th className="py-3 px-4 text-left text-sm sm:text-base">Email</th>
                <th className="py-3 px-4 text-left text-sm sm:text-base"> Class</th>
                <th className="py-3 px-4 text-right text-sm sm:text-base">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => {
                  const teacherClass = classes.find((cls) => cls.id === teacher.classId);

                  return (
                    <tr key={teacher.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="py-3 px-4 text-sm sm:text-base">{teacher.name}</td>
                      <td className="py-3 px-4 text-sm sm:text-base">{teacher.email}</td>
                      <td className="py-3 px-4 text-sm sm:text-base">
                        {teacherClass ? teacherClass.name : "Not Assigned"}
                      </td>
                      <td className="py-3 px-4 flex justify-end gap-2 text-sm sm:text-base">
                        <button
                          onClick={() => {
                        // link navigate
                          }}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(teacher.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="py-6 px-4 text-center text-gray-500 text-sm sm:text-base">
                    No teachers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* عرض بيانات الطالب في نموذج Card للشاشة الصغيرة */}
        
        </div>
      </div>
 
  );
}

export default AllTeachers;