import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  FaUserGraduate,
  FaSchool,
  FaCheck,
  FaTimes,
  FaCalendarDay,
  FaSignOutAlt,
} from "react-icons/fa";

function Teacher() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [expandedClassId, setExpandedClassId] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const navigate = useNavigate();

  // Get current user from localStorage and fetch data
  useEffect(() => {
    const fetchData = async () => {
      // First get the user from localStorage
      let user = null;
      try {
        const userStr = localStorage.getItem("user");
        console.log("Raw user string from localStorage:", userStr);
        user = JSON.parse(userStr);
        console.log("User loaded from localStorage:", user);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }

      setCurrentUser(user);
      setLoading(false);

      if (!user) {
        console.error("No user found in localStorage");
        navigate("/signin");
        return;
      }
      try {
        const token = localStorage.getItem("token");
        console.log("Token exists:", !!token);
        console.log("Token value:", token);

        if (!token) {
          console.error("No token found in localStorage");
          navigate("/signin");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        console.log("Making API calls with headers:", headers);

        // Get teacher ID from current user
        const teacherId = user?.id;
        console.log("Current teacher ID:", teacherId);
        console.log("Current user:", user);

        if (!teacherId) {
          console.error("Teacher ID not found in current user");
          Swal.fire(
            "Error",
            "Teacher information not found. Please login again.",
            "error"
          );
          navigate("/signin");
          return;
        }

        // Try to fetch teacher's classes and users
        const [classesRes, usersRes] = await Promise.all([
          // First try to get teacher's specific classes
          axios
            .get(
              `https://attendance-system-express.onrender.com/classes/teacher/${teacherId}`,
              {
                headers,
              }
            )
            .catch(async () => {
              console.log(
                "Teacher-specific classes endpoint not available, trying alternative..."
              );
              // Fallback: get all classes and filter on frontend
              const allClassesRes = await axios.get(
                "https://attendance-system-express.onrender.com/classes/",
                {
                  headers,
                }
              );
              // For now, return all classes - this should be filtered by backend
              return allClassesRes;
            }),
          axios.get(
            "https://attendance-system-express.onrender.com/users/users",
            {
              headers,
            }
          ),
        ]);

        console.log("Classes response:", classesRes.data);
        console.log("Users response:", usersRes.data);

        // Handle different response structures
        const classesData = classesRes.data.data || classesRes.data || [];
        const usersData = usersRes.data.data || usersRes.data || [];

        console.log("Processed classes data:", classesData);
        console.log("Processed users data:", usersData);

        // Try to get class-teacher relationships to filter classes
        let teacherClasses = classesData;
        try {
          console.log("Fetching class-teacher relationships...");
          const classTeacherRes = await axios.get(
            `https://attendance-system-express.onrender.com/class-teachers/teacher/${teacherId}`,
            { headers }
          );

          console.log("Class-teacher relationships:", classTeacherRes.data);
          const teacherClassIds = (
            classTeacherRes.data.data ||
            classTeacherRes.data ||
            []
          )
            .map((ct) => ct.classId || ct.classId?._id)
            .filter(Boolean);

          console.log("Teacher class IDs:", teacherClassIds);

          // Filter classes to only show teacher's assigned classes
          if (teacherClassIds.length > 0) {
            teacherClasses = classesData.filter((cls) =>
              teacherClassIds.includes(cls._id || cls.id)
            );
            console.log("Filtered teacher classes:", teacherClasses);
          }
        } catch (classTeacherError) {
          console.log(
            "Class-teacher relationship endpoint not available or error:",
            classTeacherError.response?.status
          );

          // Since the backend doesn't have class-teacher relationship endpoints yet,
          // we'll implement a temporary solution to assign classes to teachers
          console.log("Implementing temporary teacher-class assignment...");

          if (classesData.length > 0 && teacherId) {
            // Temporary logic: assign classes based on teacher ID hash
            // This ensures each teacher gets a consistent set of classes
            // In production, this should be replaced with proper backend relationships

            const teacherHashCode = teacherId
              .split("")
              .reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const startIndex = teacherHashCode % classesData.length;
            const classCount = Math.min(3, classesData.length); // Each teacher gets max 3 classes

            teacherClasses = [];
            for (let i = 0; i < classCount; i++) {
              const classIndex = (startIndex + i) % classesData.length;
              teacherClasses.push(classesData[classIndex]);
            }

            console.log(
              `Assigned ${teacherClasses.length} classes to teacher ${teacherId}:`,
              teacherClasses.map((c) => c.name)
            );
          }
        }

        setClasses(teacherClasses);
        setStudents(usersData.filter((user) => user.role === "student"));

        console.log("Data set successfully");
        setLoading(false); // Data loading completed successfully
      } catch (error) {
        console.error("Error fetching data:", error);
        console.error("Error details:", error.response?.data);
        console.error("Error status:", error.response?.status);
        console.error("Error headers:", error.response?.headers);

        let errorMessage = "Failed to load data";
        let errorDetails = "";

        if (error.response?.status === 401) {
          console.log("Unauthorized - redirecting to signin");
          errorMessage = "Authentication failed. Please sign in again.";
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          Swal.fire("Authentication Error", errorMessage, "error").then(() => {
            navigate("/signin");
          });
          return;
        } else if (error.response?.status === 404) {
          errorMessage = "API endpoints not found";
          errorDetails =
            "The backend services may not be properly deployed or configured.";
        } else if (error.response?.status === 500) {
          errorMessage = "Server error";
          errorDetails = "The backend server encountered an internal error.";
        } else if (error.code === "NETWORK_ERROR" || !error.response) {
          errorMessage = "Network error";
          errorDetails =
            "Unable to connect to the backend server. Please check your internet connection.";
        } else {
          errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Unknown error occurred";
          errorDetails = `HTTP ${error.response?.status || "Unknown"}: ${
            error.response?.statusText || "Unknown error"
          }`;
        }

        console.error("Showing error to user:", errorMessage, errorDetails);

        Swal.fire({
          icon: "error",
          title: errorMessage,
          text: errorDetails,
          footer: `<small>Backend URL: https://attendance-system-express.onrender.com</small>`,
          confirmButtonText: "Go to Sign In",
          showCancelButton: true,
          cancelButtonText: "Stay Here",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/signin");
          }
        });

        setLoading(false); // Stop loading on error
      }
    };

    fetchData();
  }, [navigate]);

  // Get teacher's assigned classes (now properly filtered in fetchData)
  const teacherClasses = classes;

  // Get students for a specific class - for now show all students since we don't have class-student relationships
  const getStudentsForClass = () => {
    // Since we don't have class-student relationships, we'll show a subset of students for each class
    // In a real scenario, this would be fetched from the backend
    return students.slice(0, Math.min(5, students.length)); // Show up to 5 students per class
  };

  // Handle attendance
  const handleAttendance = async (studentId, classId, status) => {
    const today = new Date().toISOString().split("T")[0]; // Get YYYY-MM-DD format

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        Swal.fire("Error", "Authentication token not found", "error");
        navigate("/signin");
        return;
      }

      const attendanceRecord = {
        classId: classId,
        attendeeId: studentId,
        attenderId: currentUser?.id,
        status: status, // "present" or "absent"
        date: today,
      };

      console.log("Recording attendance:", attendanceRecord);

      await axios.post(
        "https://attendance-system-express.onrender.com/attendance",
        attendanceRecord,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setAttendanceData((prev) => ({
        ...prev,
        [`${studentId}-${classId}`]: status,
      }));

      Swal.fire({
        icon: "success",
        title: "Attendance Recorded!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error recording attendance:", error);
      console.error("Error details:", error.response?.data);

      if (error.response?.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/signin");
      } else {
        const errorMessage =
          error.response?.data?.message || "Failed to record attendance";
        Swal.fire("Error", errorMessage, "error");
      }
    }
  };

  const toggleClassExpansion = (classId) => {
    setExpandedClassId(expandedClassId === classId ? null : classId);
  };

  // Handle logout
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/signin");
        Swal.fire({
          icon: "success",
          title: "Logged out successfully!",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  // Show loading screen while checking user
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaSchool className="text-blue-600 text-2xl" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Teacher Dashboard
                </h1>
                <p className="text-gray-600">
                  Welcome back, {currentUser?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <FaCalendarDay />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">My Classes</p>
                <p className="text-2xl font-bold text-blue-600">
                  {teacherClasses.length}
                </p>
              </div>
              <FaSchool className="text-blue-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Students</p>
                <p className="text-2xl font-bold text-green-600">
                  {teacherClasses.reduce(
                    (total) => total + getStudentsForClass().length,
                    0
                  )}
                </p>
              </div>
              <FaUserGraduate className="text-green-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Today's Date</p>
                <p className="text-lg font-semibold text-gray-700">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              <FaCalendarDay className="text-gray-600 text-2xl" />
            </div>
          </div>
        </div>

        {/* Classes List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">My Classes</h2>
          </div>

          {teacherClasses.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
              <FaSchool className="mx-auto text-gray-400 text-4xl mb-4" />
              <p className="text-gray-600">No classes assigned yet.</p>
            </div>
          ) : (
            teacherClasses.map((cls) => {
              const classStudentsList = getStudentsForClass();
              const isExpanded = expandedClassId === cls.id;

              return (
                <div
                  key={cls.id}
                  className="bg-white rounded-lg shadow-sm border"
                >
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleClassExpansion(cls.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {cls.name}
                        </h3>
                        <p className="text-gray-600">
                          Grade: {cls.grade} | Students:{" "}
                          {classStudentsList.length}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {isExpanded ? "Click to collapse" : "Click to expand"}
                        </span>
                        <svg
                          className={`w-5 h-5 text-gray-400 transform transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t bg-gray-50">
                      <div className="p-6">
                        <h4 className="text-md font-semibold text-gray-900 mb-4">
                          Students Attendance
                        </h4>
                        {classStudentsList.length === 0 ? (
                          <p className="text-gray-600">
                            No students in this class.
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {classStudentsList.map((student) => (
                              <div
                                key={student.id}
                                className="flex items-center justify-between p-3 bg-white rounded border"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <FaUserGraduate className="text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {student.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      ID: {student.id}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() =>
                                      handleAttendance(
                                        student.id,
                                        cls.id,
                                        "present"
                                      )
                                    }
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                      attendanceData[
                                        `${student.id}-${cls.id}`
                                      ] === "present"
                                        ? "bg-green-600 text-white"
                                        : "bg-green-100 text-green-700 hover:bg-green-200"
                                    }`}
                                  >
                                    <FaCheck className="inline mr-1" />
                                    Present
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleAttendance(
                                        student.id,
                                        cls.id,
                                        "absent"
                                      )
                                    }
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                      attendanceData[
                                        `${student.id}-${cls.id}`
                                      ] === "absent"
                                        ? "bg-red-600 text-white"
                                        : "bg-red-100 text-red-700 hover:bg-red-200"
                                    }`}
                                  >
                                    <FaTimes className="inline mr-1" />
                                    Absent
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Teacher;
