import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserTie,
  FaSchool,
} from "react-icons/fa";
import AdminSideBar from "../../components/Admin/SideBar";
import DashboardStats from "../../components/Admin/DashboardStats";
export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classStudents, setClassStudents] = useState([]);
  const [classTeachers, setClassTeachers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchStudent, setSearchStudent] = useState("");
  const [searchTeacher, setSearchTeacher] = useState("");
  const [searchClass, setSearchClass] = useState("");

  const [view, setView] = useState("students");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        axios
          .get("https://attendance-system-express.onrender.com/users/users", {
            headers,
          })
          .then((res) => setUsers(res.data.data));

        axios
          .get("https://attendance-system-express.onrender.com/classes", {
            headers,
          })
          .then((res) => {
            setClasses(res.data.data);
          });

        console.log(classes, "sssdasd");

        const classStudentsRes = await axios.get(
          "https://attendance-system-express.onrender.com/classes/students",
          { headers }
        );
        setClassStudents(classStudentsRes.data || []);

        const classTeachersRes = await axios.get(
          "https://attendance-system-express.onrender.com/classes/teachers",
          { headers }
        );
        setClassTeachers(classTeachersRes.data || []);
      } catch (error) {
        console.error("Failed to load data:", error.message);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/signin";
        } else {
          Swal.fire("Error", "Failed to load dashboard data", "error");
        }
      }
    };

    fetchData();
  }, []);

  const studentsList = users?.filter((u) => u.role === "student");
  const teachersList = users?.filter((u) => u.role === "teacher");
  const principalsList = users?.filter((u) => u.role === "principle");

  const filteredStudents = studentsList.filter(
    (student) =>
      student.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      student.email.toLowerCase().includes(searchStudent.toLowerCase())
  );

  const filteredTeachers = teachersList.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTeacher.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTeacher.toLowerCase())
  );

  const filteredPrincipals = principalsList.filter(
    (principal) =>
      principal.name.toLowerCase().includes(searchTeacher.toLowerCase()) ||
      principal.email.toLowerCase().includes(searchTeacher.toLowerCase())
  );

  const filteredClasses = classes?.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchClass.toLowerCase()) ||
      cls.description?.toLowerCase().includes(searchClass.toLowerCase())
  );

  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        await axios.delete(
          `https://attendance-system-express.onrender.com/users/${id}`,
          {
            headers,
          }
        );

        setUsers((prev) => prev.filter((u) => u.id !== id));
        Swal.fire("Deleted!", "User has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  const handleDeleteClass = async (classId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        await axios.delete(
          `https://attendance-system-express.onrender.com/classes/${classId}`,
          {
            headers,
          }
        );

        setClasses((prev) => prev.filter((c) => c.id !== classId));
        Swal.fire(
          "Deleted!",
          "Class has been successfully deleted.",
          "success"
        );
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="hidden md:block w-64 h-screen sticky top-0 left-0">
        <AdminSideBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <DashboardStats />

        <div className="bg-white shadow rounded-lg p-4 mb-6 flex gap-7 justify-center flex-wrap">
          <button
            onClick={() => setView("students")}
            className={`px-4 py-2 rounded-md font-medium ${
              view === "students"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setView("teachers")}
            className={`px-4 py-2 rounded-md font-medium ${
              view === "teachers"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Teachers
          </button>
          <button
            onClick={() => setView("principals")}
            className={`px-4 py-2 rounded-md font-medium ${
              view === "principals"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Principals
          </button>
          <button
            onClick={() => setView("classes")}
            className={`px-4 py-2 rounded-md font-medium ${
              view === "classes"
                ? "bg-purple-100 text-purple-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Classes
          </button>
        </div>

        {view === "students" && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search ..."
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {view === "teachers" && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchTeacher}
              onChange={(e) => setSearchTeacher(e.target.value)}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        )}

        {view === "classes" && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by class name or description..."
              value={searchClass}
              onChange={(e) => setSearchClass(e.target.value)}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        )}

        {view === "students" && (
          <section>
            <div className="flex gap-2">
              <FaUserGraduate size={30} color="#63B3ED" />
              <h2 className="text-2xl text-[#63B3ED] font-bold mb-4">
                Students
              </h2>
            </div>
            <div className="bg-white shadow rounded-lg overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-[#63B3ED] text-white">
                  <tr>
                    <th className="p-2 text-center border-b">Name</th>
                    <th className="p-2 text-center border-b">Email</th>
                    <th className="p-2 text-center border-b">Assigned Class</th>
                    <th className="p-2 text-center border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => {
                      const studentClass = classes.find(
                        (c) => c.id === student.classId
                      );
                      return (
                        <tr
                          key={student.id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="p-2 text-center border-b">
                            {student.name}
                          </td>
                          <td className="p-2 text-center border-b">
                            {student.email}
                          </td>
                          <td className="p-2 text-center border-b">
                            {studentClass ? studentClass.name : "None"}
                          </td>
                          <td className="p-2 border text-center space-x-2 space-x-reverse">
                            <button
                              onClick={() =>
                                (window.location.href = `/admin/edit-student/${student.id}`)
                              }
                              className="text-blue-500 p-2 hover:text-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUser(student.id)}
                              className="text-red-500 p-2 hover:text-red-700"
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
                        No students found
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
              <h2 className="text-2xl text-[#2ECC71] font-bold mb-4">
                Teachers
              </h2>
            </div>
            <div className="bg-white shadow rounded-lg overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-[#2ECC71] text-white">
                  <tr>
                    <th className="p-2 text-center border-b">Name</th>
                    <th className="p-2 text-center border-b">Email</th>
                    <th className="p-2 text-center border-b">Assigned Class</th>
                    <th className="p-2 text-center border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.length > 0 ? (
                    filteredTeachers.map((teacher) => {
                      const teacherClass = classes.find(
                        (c) => c.id === teacher.classId
                      );
                      return (
                        <tr
                          key={teacher.id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="p-2 text-center border-b">
                            {teacher.name}
                          </td>
                          <td className=" p-2 text-center border-b">
                            {teacher.email}
                          </td>
                          <td className="p-2 text-center border-b">
                            {teacherClass ? teacherClass.name : "None"}
                          </td>
                          <td className="p-2 border text-center space-x-2 space-x-reverse">
                            <button
                              onClick={() =>
                                (window.location.href = `/admin/edit-teacher/${teacher.id}`)
                              }
                              className="text-blue-500 p-2 hover:text-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUser(teacher.id)}
                              className="text-red-500 p-2 hover:text-red-700"
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
                        No teachers found
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
              <h2 className="text-2xl  text-[#F1C40F] font-bold  mb-4">
                Principles
              </h2>
            </div>
            <div className="bg-white shadow rounded-lg overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-[#F1C40F] text-white">
                  <tr>
                    <th className="p-2 text-center border-b">Name</th>
                    <th className="p-2 text-center border-b">Email</th>
                    <th className="p-2 text-center border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrincipals.length > 0 ? (
                    filteredPrincipals.map((principal) => (
                      <tr
                        key={principal.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="p-2 text-center border-b">
                          {principal.name}
                        </td>
                        <td className="p-2 text-center border-b">
                          {principal.email}
                        </td>
                        <td className="p-2  border-b text-center space-x-2 space-x-reverse">
                          <button
                            onClick={() =>
                              (window.location.href = `/admin/edit-principal/${principal.id}`)
                            }
                            className="text-blue-500 p-2 hover:text-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(principal.id)}
                            className="text-red-500 p-2 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center p-4 text-gray-500">
                        No principals found
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
              <h2 className="text-2xl text-[#9D3CFF] font-bold mb-4">
                {" "}
                Classes
              </h2>
            </div>
            <div className="bg-white shadow rounded-lg overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-[#9D3CFF] text-white">
                  <tr>
                    <th className="p-2 text-center border-b">Class Name</th>
                    <th className="p-2 text-center border-b">Description</th>
                    <th className="p-2 text-center border-b">
                      Assigned Teacher
                    </th>
                    <th className="p-2 text-center border-b">
                      Number of Students
                    </th>
                    <th className="p-2 text-center border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClasses.length > 0 ? (
                    filteredClasses.map((cls) => {
                      const teacherLink = classTeachers.find(
                        (ct) => ct.classId === cls.id
                      );
                      const teacher = users.find(
                        (u) => u.id === teacherLink?.teacherId
                      );

                      const studentsInClass = classStudents
                        .filter((cs) => cs.classId === cls.id)
                        .map((cs) => users.find((u) => u.id === cs.studentId))
                        .filter(Boolean);

                      return (
                        <React.Fragment key={cls.id}>
                          <tr className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="p-2 text-center border-b">
                              {cls.name}
                            </td>
                            <td className="p-2 text-center border-b">
                              {cls.description || "N/A"}
                            </td>
                            <td className="p-2 text-center border-b">
                              {teacher
                                ? `${teacher.name} (${teacher.email})`
                                : "No Teacher"}
                            </td>
                            <td className="p-2 border text-center">
                              {studentsInClass.length}
                            </td>
                            <td className="p-2 border text-center space-x-2 space-x-reverse">
                              <button
                                onClick={() =>
                                  (window.location.href = `/admin/edit-class/${cls.id}`)
                                }
                                className="text-blue-500 p-2 hover:text-blue-700"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteClass(cls.id)}
                                className="text-red-500 p-2 hover:text-red-700"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center p-4 text-gray-500">
                        No classes available
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
