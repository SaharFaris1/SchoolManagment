import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

function AllStudent() {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
 
    fetch("https://685a896b9f6ef9611156cfd9.mockapi.io/Users") 
      .then((res) => res.json())
      .then((data) => {
        setStudents(data.filter((u) => u.role === "student"));
       
      });


    fetch("https://685a896b9f6ef9611156cfd9.mockapi.io/Class") 
      .then((res) => res.json())
      .then(setClasses);
  }, []);

  
  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete this student?",
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


        setStudents((prev) => prev.filter((u) => u.id !== id));


        Swal.fire("Deleted!", "Student has been deleted successfully.", "success");
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

 
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">

        <main className="p-6 overflow-auto">
          <h1 className="text-2xl font-bold mb-4">All Students</h1>

       
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border px-4 py-2 rounded-xl mb-4"
          />

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow-md">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">Assigned Class</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                 
                    const studentClass = classes.find(
                      (cls) => cls.id === student.classId
                    );

                    return (
                      <tr key={student.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{student.name}</td>
                        <td className="py-2 px-4">{student.email}</td>
                        <td className="py-2 px-4">
                          {studentClass ? studentClass.name : "Not Assigned"}
                        </td>
                        <td className="py-2 px-4 flex space-x-2 space-x-reverse">
                          <button
                            onClick={() => {
                          
                             //  window.location.href = `/admin/edit-student/${student.id}`;
                            }}
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(student.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AllStudent;