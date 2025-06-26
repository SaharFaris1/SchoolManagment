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
  const [attendanceData, setAttendanceData] = useState({});
  const navigate = useNavigate();
  const [studentsData, setStudentsData] = useState([]);

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

      if (!user) {
        console.error("No user found in localStorage");
        navigate("/signin");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        console.log("Token exists:", !!token);
        console.log("Token value:", token);

        if (!token) {
          console.error("No token found in localStorage");
          navigate("/signin");
          setLoading(false);
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

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
          setLoading(false);
          return;
        }

        const classesRes = await axios.get(
          `https://attendance-system-express.onrender.com/classes/teacher/${teacherId}`,
          {
            headers,
          }
        );
        console.log("111111111111111111111:", classesRes.data);

        const studentsRes = await axios
          .get(
            `https://attendance-system-express.onrender.com/classes/${classesRes.data.data.classId}/students`,
            {
              headers,
            }
          )
          .then((res) => {
            console.log("Students 1111111111:", res.data.data);
            setStudentsData(res.data.data);
            return res.data.data; // Return the data for immediate use
          });

        // Handle different response structures
        const classesData = classesRes.data.data || classesRes.data || [];
        const usersData = studentsRes || [];

        console.log("Processed classes data:", classesData);
        console.log("Processed users data:", usersData);

        // Try to get class-teacher relationships to filter classes
        let teacherClasses = classesData;

        try {
          console.log("Fetching class-teacher relationships...");
          const classTeacherRes = await axios.get(
            `https://attendance-system-express.onrender.com/classes/teacher/${teacherId}`,
            { headers }
          );

          console.log("Class-teacher relationships:", classTeacherRes.data);
          const teacherClassRelations = classTeacherRes.data.data || [];
          console.log("Teacher class relations array:", teacherClassRelations);

          // Handle the case where data is null (no relationships exist)
          if (!teacherClassRelations || teacherClassRelations.length === 0) {
            console.log("No teacher-class relationships found in database");
            // Use temporary assignment logic as fallback
            if (classesData.length > 0 && teacherId) {
              const teacherHashCode = teacherId
                .split("")
                .reduce((acc, char) => acc + char.charCodeAt(0), 0);
              const startIndex = teacherHashCode % classesData.length;
              const classCount = Math.min(2, classesData.length); // Each teacher gets max 2 classes

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
          } else {
            // Extract class IDs from teacher-class relationships
            const teacherClassIds = teacherClassRelations
              .map((relation) => {
                if (relation.classId && typeof relation.classId === "object") {
                  // If classId is populated with full class data
                  return relation.classId._id || relation.classId.id;
                } else {
                  // If classId is just an ID string
                  return relation.classId;
                }
              })
              .filter(Boolean);

            console.log("Teacher class IDs:", teacherClassIds);

            if (teacherClassIds.length > 0) {
              // Filter classes to only show teacher's assigned classes
              teacherClasses = classesData.filter((cls) =>
                teacherClassIds.includes(cls._id || cls.id)
              );
              console.log("Filtered teacher classes:", teacherClasses);
            } else {
              console.log(
                "No class IDs found, checking if classes are already populated..."
              );
              // Check if the relations already contain full class data
              const populatedClasses = teacherClassRelations
                .map((relation) => relation.classId)
                .filter(
                  (classData) =>
                    classData && typeof classData === "object" && classData.name
                );

              if (populatedClasses.length > 0) {
                teacherClasses = populatedClasses;
                console.log("Using populated class data:", teacherClasses);
              } else {
                // Fallback: assign some classes to the teacher
                console.log(
                  "No specific teacher classes found, assigning default classes..."
                );
                teacherClasses = classesData.slice(
                  0,
                  Math.min(2, classesData.length)
                );
              }
            }
          }
        } catch (classTeacherError) {
          console.log(
            "Class-teacher relationship endpoint not available or error:",
            classTeacherError.response?.status
          );

          console.log("Implementing temporary teacher-class assignment...");

          if (classesData.length > 0 && teacherId) {
            const teacherHashCode = teacherId
              .split("")
              .reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const startIndex = teacherHashCode % classesData.length;
            const classCount = Math.min(2, classesData.length); // Each teacher gets max 2 classes

            teacherClasses = [];
            for (let i = 0; i < classCount; i++) {
              const classIndex = (startIndex + i) % classesData.length;
              teacherClasses.push(classesData[classIndex]);
            }

            console.log(
              `Assigned ${teacherClasses.length} classes to teacher ${teacherId}:`,
              teacherClasses.map((c) => c.name)
            );
          } else if (classesData.length > 0) {
            // Fallback: assign at least one class
            teacherClasses = [classesData[0]];
            console.log("Fallback: Assigned first available class to teacher");
          }
        }

        // Final check: ensure teacher has at least one class if classes exist
        if (teacherClasses.length === 0 && classesData.length > 0) {
          teacherClasses = [classesData[0]];
          console.log(
            "Final fallback: Assigned first class to ensure teacher has at least one class"
          );
        }

        // TEMPORARY DEBUG: If still no classes, create a mock class for testing
        if (teacherClasses.length === 0) {
          console.log(
            "No classes found from API - creating mock class for testing"
          );
          teacherClasses = [
            {
              _id: "mock-class-1",
              id: "mock-class-1",
              name: "Mathematics 101",
              grade: "10th Grade",
              description: "Basic Mathematics",
            },
          ];
        }

        setClasses(teacherClasses);

        console.log("=== FINAL DEBUG INFO ===");
        console.log("Data set successfully");
        console.log("Final teacher classes:", teacherClasses);
        console.log("Final teacher classes count:", teacherClasses.length);
        console.log("Classes data from API:", classesData);
        console.log("Classes data length:", classesData.length);
        console.log("Students data:", usersData);
        console.log("=== END DEBUG INFO ===");
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
  const teacherClasses = Array.isArray(classes) ? classes : [];

  // Debug: Log the current state
  console.log("=== RENDER DEBUG ===");
  console.log("classes state:", classes);
  console.log("teacherClasses:", teacherClasses);
  console.log("teacherClasses.length:", teacherClasses.length);
  console.log("=== END RENDER DEBUG ===");

  // Handle attendance
  const handleAttendance = async (studentId, status) => {
    const today = new Date().toISOString().split("T")[0]; // Get YYYY-MM-DD format

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        Swal.fire("Error", "Authentication token not found", "error");
        navigate("/signin");
        return;
      }

      // Use a default class ID since we're focusing on student attendance
      // In a real scenario, this would come from the teacher's assigned class
      const defaultClassId = "teacher-class-" + currentUser?.id;

      const attendanceRecord = {
        classId: defaultClassId,
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

      // Update local state using just student ID as key
      setAttendanceData((prev) => ({
        ...prev,
        [studentId]: status,
      }));

      Swal.fire({
        icon: "success",
        title: "Attendance Recorded!",
        text: `Student marked as ${status}`,
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
                <h1 className="text-base md:text-2xl font-bold text-gray-900">
                  Teacher Dashboard
                </h1>
                <p className="text-gray-600">
                  Welcome back, {currentUser?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
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
                <p className="text-2xl font-bold text-blue-600">{1}</p>
              </div>
              <FaSchool className="text-blue-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Students</p>
                <p className="text-2xl font-bold text-green-600">
                  {studentsData.length}
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

        {/* Students Attendance */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Student Attendance
            </h2>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString()}
            </div>
          </div>

          {studentsData.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
              <FaUserGraduate className="mx-auto text-gray-400 text-4xl mb-4" />
              <p className="text-gray-600 mb-2">No students found.</p>
              <p className="text-sm text-gray-500">This might be due to:</p>
              <ul className="text-sm text-gray-500 mt-2 space-y-1">
                <li>• No students enrolled in your class</li>
                <li>• Teacher permissions don't allow viewing students</li>
                <li>
                  • Backend needs to implement class-student relationships
                </li>
              </ul>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Total Students:</strong> {studentsData.length}{" "}
                    students in your class
                  </p>
                </div>

                <div className="grid gap-4">
                  {studentsData.map((student, index) => (
                    <div
                      key={student.studentId.id || student._id}
                      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                                <FaUserGraduate className="text-white text-lg" />
                              </div>
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                                {index + 1}
                              </div>
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h5 className="text-lg font-semibold text-gray-900 truncate">
                                  {student.studentId.name}
                                </h5>
                                {attendanceData[
                                  student.studentId.id || student._id
                                ] && (
                                  <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                                      attendanceData[
                                        student.studentId.id || student._id
                                      ] === "present"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {attendanceData[
                                      student.studentId.id || student._id
                                    ] === "present"
                                      ? "Present"
                                      : "Absent"}
                                  </span>
                                )}
                              </div>

                              <div className="space-y-1">
                                <p className="text-sm text-gray-600 flex items-center">
                                  <span className="font-medium">Email:</span>
                                  <span className="ml-2 text-blue-600">
                                    {student.studentId.email}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col space-y-2 ml-4">
                            <button
                              onClick={() =>
                                handleAttendance(
                                  student.studentId.id || student._id,
                                  "present"
                                )
                              }
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center min-w-[100px] ${
                                attendanceData[
                                  student.studentId.id || student._id
                                ] === "present"
                                  ? "bg-green-600 text-white shadow-lg scale-105"
                                  : "bg-green-100 text-green-700 hover:bg-green-200 border border-green-300"
                              }`}
                            >
                              <FaCheck className="mr-2" />
                              Present
                            </button>

                            <button
                              onClick={() =>
                                handleAttendance(
                                  student.studentId.id || student._id,
                                  "absent"
                                )
                              }
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center min-w-[100px] ${
                                attendanceData[
                                  student.studentId.id || student._id
                                ] === "absent"
                                  ? "bg-red-600 text-white shadow-lg scale-105"
                                  : "bg-red-100 text-red-700 hover:bg-red-200 border border-red-300"
                              }`}
                            >
                              <FaTimes className="mr-2" />
                              Absent
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Teacher;
