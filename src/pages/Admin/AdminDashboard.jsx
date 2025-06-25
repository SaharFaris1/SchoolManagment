import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaUserGraduate, FaChalkboardTeacher, FaUserTie, FaSchool } from "react-icons/fa";

import AdminSideBar from "../../components/Admin/SideBar";
import DashboardStats from "../../components/Admin/DashboardStats";
export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classStudents, setClassStudents] = useState([]);
  const [classTeachers, setClassTeachers] = useState([]);
 

  // Serach
  const [searchTeacher, setSearchTeacher] = useState("");
  const [searchStudent, setSearchStudent] = useState("");
  const [searchClass, setSearchClass] = useState("");

  // student default view
  const [view, setView] = useState("students"); 

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // display all student for each class
  const [expandedClassId, setExpandedClassId] = useState(null);

  // fetch data from MockAPI
  useEffect(() => {
    fetch("https://685a896b9f6ef9611156cfd9.mockapi.io/Users") 
      .then((res) => res.json())
      .then(setUsers);

    fetch("https://685a896b9f6ef9611156cfd9.mockapi.io/Class") 
      .then((res) => res.json())
      .then(setClasses);

    fetch("https://685bc72989952852c2daf0c8.mockapi.io/CalssStudents") 
      .then((res) => res.json())
      .then(setClassStudents);

    fetch("https://685bc72989952852c2daf0c8.mockapi.io/ClassTeacher") 
      .then((res) => res.json())
      .then(setClassTeachers);
  }, []);

  // define roles
  const studentsList = users.filter(u => u.role === "student");
  const teachersList = users.filter(u => u.role === "teacher");
  const principalsList = users.filter(u => u.role === "principle");

  // filter for search 
  const filteredStudents = studentsList.filter(student =>
    student.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
    student.email.toLowerCase().includes(searchStudent.toLowerCase())
  );

  const filteredTeachers = teachersList.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTeacher.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTeacher.toLowerCase())
  );

  const filteredPrincipals = principalsList.filter(principal =>
    principal.name.toLowerCase().includes(searchTeacher.toLowerCase()) ||
    principal.email.toLowerCase().includes(searchTeacher.toLowerCase())
  );

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchClass.toLowerCase()) ||
    cls.description?.toLowerCase().includes(searchClass.toLowerCase())
  );

  // delete user
  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: " sure? ",
      text: "لن يمكنك استرجاع هذا المستخدم بعد الحذف!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: " Delete",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
      try {
        await fetch(`https://685a896b9f6ef9611156cfd9.mockapi.io/Users/${id}`,  {
          method: "DELETE"
        });
        setUsers(prev => prev.filter(u => u.id !== id));
        Swal.fire(" Deleted Success!", " Deleted has been Successful  .", "success");
      } catch (error) {
        Swal.fire(" error", error.message, "error");
      }
    }
  };

  // delete class
  const handleDeleteClass = async (classId) => {
    const result = await Swal.fire({
      title: " Sure? ",
      text: "لن يمكنك استرجاع هذا الفصل بعد الحذف!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: " Delete",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
      try {
        await fetch(`https://685a896b9f6ef9611156cfd9.mockapi.io/Class/${classId}`,  {
          method: "DELETE"
        });
        setClasses((prev) => prev.filter(cls => cls.id !== classId));
        Swal.fire(" Success!", " Class has been Deleted  .", "success");
      } catch (error) {
        Swal.fire("فشل الحذف", error.message, "error");
      }
    }
  };

  //  serch for studen in classStudents table
  const getStudentsByClass = (classId) => {
    return classStudents
      .filter(cs => cs.classId === classId)
      .map(cs => studentsList.find(s => s.id === cs.studentId))
      .filter(Boolean);
  };

  // serch for studen in classTeachers table
  const getTeacherByClass = (classId) => {
    const teacherLink = classTeachers.find(ct => ct.classId === classId);
    return users.find(u => u.id === teacherLink?.teacherId);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* side Bar*/}
      <div className="hidden md:block w-64 h-screen sticky top-0 left-0">
      <AdminSideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* content*/}
      <div className="flex-1 p-6 overflow-auto">
     
        <h1 className="text-2xl font-bold mb-6">Admin Access Control</h1>
        <DashboardStats/>
        {/* buttons tables*/}
        <div className="bg-white shadow rounded-lg p-4 mb-6 flex gap-7 justify-center flex-wrap">
          <button
            onClick={() => {
              setView("students");
              setExpandedClassId(null); 
            }}
            className={`px-4 py-2 rounded-md ${
              view === "students" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
            }`}
          >
            Students
          </button>

          <button
            onClick={() => {
              setView("teachers");
              setExpandedClassId(null); 
            }}
            className={`px-4 py-2 rounded-md ${
              view === "teachers" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
            }`}
          >
            Teachers
          </button>

          <button
            onClick={() => {
              setView("principals");
              setExpandedClassId(null); 
            }}
            className={`px-4 py-2 rounded-md ${
              view === "principals" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"
            }`}
          >
            Principles
          </button>

          <button
            onClick={() => {
              setView("classes");
              setExpandedClassId(null); 
            }}
            className={`px-4 py-2 rounded-md ${
              view === "classes" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"
            }`}
          >
     Classes
          </button>
        </div>

        {/*  Search bar*/}
        {view === "students" && (
         <div className="mb-4 relative">
         <div className="flex items-center absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
           </svg>
         </div>
       
         <input
           type="text"
           placeholder="Search student"
           value={searchStudent}
           onChange={(e) => setSearchStudent(e.target.value)}
           className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
         />
       
   
       
       </div>
        )}

        {view === "teachers" && (
           <div className="mb-4 relative">
           <div className="flex items-center absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
           </div>
            <input
              type="text"
                placeholder="Search Teachers"
              value={searchTeacher}
              onChange={(e) => setSearchTeacher(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
          </div>
        )}

        {view === "classes" && (
        <div className="mb-4 relative">
        <div className="flex items-center absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
            <input
              type="text"
                placeholder="Search Classes"
              value={searchClass}
              onChange={(e) => setSearchClass(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>
        )}

        {/* display students*/}
        {view === "students" && (
          <section>
            <div className="flex gap-2">
            <FaUserGraduate size={30} color="#63B3ED" />
 <h2 className="text-2xl text-[#63B3ED] font-bold mb-4">Students</h2>
            </div>
           
            <div className="bg-white shadow  overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-[#63B3ED]">
                  <tr className="text-white">
                    <th className="p-2 ">Name</th>
                    <th className="p-2 ">Email </th>
                    <th className="p-2 "> Class</th>
                    <th className="p-2 ">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => {
                      const studentClass = classes.find(c => c.id === student.classId);
                      return (
                        <tr key={student.id} className="hover:bg-white transition-colors duration-150">
                          <td className="p-2 text-center border-b">{student.name}</td>
                          <td className="p-2 text-center border-b">{student.email}</td>
                          <td className="p-2 text-center border-b">{studentClass ? studentClass.name : "غير مخصص"}</td>
                          <td className="p-2 border-b text-center  space-x-2 space-x-reverse">
                            <div className="flex p-2  text-center  space-x-2 space-x-reverse">
                            <button
                              onClick={() => window.location.href = `/admin/edit-student/${student.id}`}
                              className="text-blue-500 rounded-2xl  p-2 hover:text-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUser(student.id)}
                              className="text-red-500 p-2 text-center hover:text-red-700"
                            >
                              Delete
                            </button>
                            </div>
                          </td>
                        </tr>

                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center p-4 text-gray-500">
                    No Students
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {view === "teachers" && (
          <section>
            <div className="flex gap-3">
            <FaChalkboardTeacher size={32} color="#2ECC71" />
            <h2 className="text-2xl text-[#2ECC71] font-bold mb-4">Teachers</h2>


            </div>
            <div className="bg-white shadow overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-[#2ECC71] text-white">
                  <tr>
                    <th className="p-2 ">Name</th>
                    <th className="p-2 "> Email</th>
                    <th className="p-2 "> Class</th>
                    <th className="p-2 ">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.length > 0 ? (
                    filteredTeachers.map((teacher) => {
                      const teacherClass = classes.find(c => c.id === teacher.classId);
                      return (
                        <tr key={teacher.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="p-2 text-center border-b">{teacher.name}</td>
                          <td className="p-2 text-center border-b">{teacher.email}</td>
                          <td className="p-2 text-center border-b">{teacherClass ? teacherClass.name : "غير مخصص"}</td>
                          <td className="p-2 text-center border-b  space-x-2 space-x-reverse">
                            <button
                              onClick={() => window.location.href = `/admin/edit-teacher/${teacher.id}`}
                              className="text-blue-500 hover:text-blue-700 p-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUser(teacher.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center p-4 text-gray-500">
                    No teachers
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {view === "principals" && (
          <section>
            <div className="flex gap-2">
            <FaUserTie size={32} color="#F1C40F" />
            <h2 className="text-2xl  text-[#F1C40F] font-bold  mb-4">Principles</h2>


            </div>
            <div className="bg-white shadow  overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-[#F1C40F] text-white">
                  <tr>
                    <th className="p-2 text-center border-b ">Name</th>
                    <th className="p-2 text-center border-b "> Email</th>
                    <th className="p-2 text-center border-b">Actios</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrincipals.length > 0 ? (
                    filteredPrincipals.map((principal) => (
                      <tr key={principal.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="p-2 text-center border-b">{principal.name}</td>
                        <td className="p-2 text-center border-b">{principal.email}</td>
                        <td className="p-2 border-b text-center space-x-2 space-x-reverse">
                          <button
                            onClick={() => window.location.href = `/admin/edit-principal/${principal.id}`}
                            className="text-blue-500 p-2 hover:text-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(principal.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center p-4 text-gray-500">
                       No Principles
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {view === "classes" && (
          <section>
            <div className="flex gap-2">
               <FaSchool size={32} color="#9D3CFF" />
            <h2 className="text-2xl text-[#9D3CFF] font-bold mb-4"> Classes</h2>
            </div>
            <div className="bg-white shadow  overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-[#9D3CFF] text-white">
                  <tr>
                    <th className="p-2 text-center border-b"> Name</th>
                    <th className="p-2 text-center border-b">Description</th>
                    <th className="p-2 text-center border-b">Teacher</th>
                    <th className="p-2 text-center border-b"> Student</th>
                    <th className="p-2 text-center border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClasses.length > 0 ? (
                    filteredClasses.map((cls) => {
                      const teacher = getTeacherByClass(cls.id);
                      const studentsInClass = getStudentsByClass(cls.id);

                      return (
                        <React.Fragment key={cls.id}>
                          {/*  Classes */}

                          <tr className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="p-2 text-center border-b">{cls.name}</td>
                            <td className="p-2 text-center border-b">{cls.description || "N/A"}</td>
                            <td className="p-2 text-center border-b">
                              {teacher ? `${teacher.name} (${teacher.email})` : "no teacher  "}
                            </td>
                            <td className="p-2 text-center border-b">
                              {studentsInClass.length}
                            </td>
                            <td className="p-2 border-b text-center space-x-2 space-x-reverse">
                              <button
                                onClick={() => window.location.href = `/admin/edit-class/${cls.id}`}
                                className="text-blue-500 p-2 hover:text-blue-700"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteClass(cls.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>

                          {/* display students*/}
                          <tr>
                            <td colSpan="5" className="p-0 border-t-0">
                              <div className="bg-gray-50 p-4">
                                <button
                                  onClick={() => setExpandedClassId(expandedClassId === cls.id ? null : cls.id)}
                                  className="text-sm text-blue-600 underline"
                                >
                                  {expandedClassId === cls.id ? " Hide Students " : " All Students"}
                                </button>

                                {/* expandedClassId === cls.id */}
                                {expandedClassId === cls.id && (
                                  <div className="mt-2 overflow-x-auto">
                                    <h3 className="font-medium mb-2">Students :</h3>
                                    {studentsInClass.length > 0 ? (
                                      <table className="min-w-full mt-2 table-auto border border-gray-300">
                                        <thead className="bg-[#9D3CFF] text-white">
                                          <tr>
                                            <th className="p-2 text-center border-b">Name</th>
                                            <th className="p-2 text-center border-b"> Email</th>
                                       
                                            <th className="p-2 text-center border-b">Actions</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {studentsInClass.map((student) => (
                                            <tr key={student.id} className="hover:bg-gray-100">
                                              <td className="p-2 text-center border-b">{student.name}</td>
                                              <td className="p-2 text-center border-b">{student.email}</td>

                                              <td className="p-2 border-b text-center space-x-2 space-x-reverse">
                                                <button
                                                  onClick={() => window.location.href = `/admin/edit-student/${student.id}`}
                                                  className="text-blue-500 p-2 hover:text-blue-700"
                                                >
                                                  Edit
                                                </button>
                                                <button
                                                  onClick={() => handleDeleteUser(student.id)}
                                                  className="text-red-500 hover:text-red-700"
                                                >
                                                  Delete
                                                </button>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    ) : (
                                      <p className="text-gray-500">No Students</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center p-4 text-gray-500">
                        لا يوجد فصول متاحة
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}