import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCheck,
  FaTimes,
  FaEdit,
  FaSignOutAlt,
} from "react-icons/fa";

function Student() {
  const [currentUser, setCurrentUser] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [leaveReason, setLeaveReason] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Get current user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
  }, []);

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

  // Fetch attendance and leave data
  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("token");
          const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          };

          const [attendanceRes, leaveRes] = await Promise.all([
            axios.get(
              `https://attendance-system-express.onrender.com/attendance`,
              { headers }
            ),
            axios.get(`https://attendance-system-express.onrender.com/leave`, {
              headers,
            }),
          ]);

          // Filter data for current user
          const userAttendance = attendanceRes.data.filter
            ? attendanceRes.data.filter((att) => att.userId === currentUser.id)
            : attendanceRes.data.data
            ? attendanceRes.data.data.filter(
                (att) => att.userId === currentUser.id
              )
            : [];

          const userLeaves = leaveRes.data.filter
            ? leaveRes.data.filter((leave) => leave.userId === currentUser.id)
            : leaveRes.data.data
            ? leaveRes.data.data.filter(
                (leave) => leave.userId === currentUser.id
              )
            : [];

          setAttendance(userAttendance);
          setLeaves(userLeaves);
        } catch (error) {
          console.error("Error fetching data:", error);
          if (error.response?.status === 401) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            navigate("/signin");
          } else {
            Swal.fire("Error", "Failed to load data", "error");
          }
        }
      };

      fetchData();
    }
  }, [currentUser, navigate]);

  // Submit leave reason
  const handleLeaveSubmit = async (e) => {
    e.preventDefault();

    if (!leaveReason.trim() || !selectedDate) {
      Swal.fire("Error", "Please fill in all fields", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const leaveData = {
        reason: leaveReason.trim(),
        startDate: selectedDate,
        endDate: selectedDate,
        type: "personal", // Default type
      };

      await axios.post(
        `https://attendance-system-express.onrender.com/leave`,
        leaveData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Leave Request Submitted!",
        text: "Your leave request has been submitted for approval",
        timer: 2000,
        showConfirmButton: false,
      });

      // Reset form
      setLeaveReason("");
      setSelectedDate("");

      // Refresh leave data
      const leaveRes = await axios.get(
        `https://attendance-system-express.onrender.com/leave`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const userLeaves = leaveRes.data.filter
        ? leaveRes.data.filter((leave) => leave.userId === currentUser.id)
        : leaveRes.data.data
        ? leaveRes.data.data.filter((leave) => leave.userId === currentUser.id)
        : [];

      setLeaves(userLeaves);
    } catch (error) {
      console.error("Error submitting leave:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/signin");
      } else {
        Swal.fire("Error", "Failed to submit leave request", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get attendance statistics
  const getAttendanceStats = () => {
    const present = attendance.filter((a) => a.status === "present").length;
    const absent = attendance.filter((a) => a.status === "absent").length;
    const total = attendance.length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

    return { present, absent, total, percentage };
  };

  const stats = getAttendanceStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaCalendarAlt className="text-blue-600 text-2xl" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Student Dashboard
                </h1>
                <p className="text-gray-600">
                  Welcome back, {currentUser?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <FaCalendarAlt />
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
        {/* Attendance Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Days</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.total}
                </p>
              </div>
              <FaCalendarAlt className="text-blue-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Present</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.present}
                </p>
              </div>
              <FaCheck className="text-green-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Absent</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.absent}
                </p>
              </div>
              <FaTimes className="text-red-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Attendance %</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {stats.percentage}%
                </p>
              </div>
              <div className="text-indigo-600 text-2xl">%</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Attendance History */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                Attendance History
              </h2>
            </div>
            <div className="p-6">
              {attendance.length === 0 ? (
                <div className="text-center py-8">
                  <FaCalendarAlt className="mx-auto text-gray-400 text-4xl mb-4" />
                  <p className="text-gray-600">No attendance records found.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {attendance.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            record.status === "present"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <span className="text-gray-900">
                          {new Date(record.date).toLocaleDateString()}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          record.status === "present"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {record.status === "present" ? "Present" : "Absent"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Leave Request Form */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                Submit Leave Request
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleLeaveSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Absence
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Absence
                  </label>
                  <textarea
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Please provide a detailed reason for your absence..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? "Submitting..." : "Submit Leave Request"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Leave Requests History */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">
              Leave Requests History
            </h2>
          </div>
          <div className="p-6">
            {leaves.length === 0 ? (
              <div className="text-center py-8">
                <FaExclamationTriangle className="mx-auto text-gray-400 text-4xl mb-4" />
                <p className="text-gray-600">No leave requests found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {leaves.map((leave) => (
                  <div key={leave.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <FaCalendarAlt className="text-blue-600" />
                          <span className="font-medium text-gray-900">
                            {new Date(leave.date).toLocaleDateString()}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              leave.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : leave.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {leave.status
                              ? leave.status.charAt(0).toUpperCase() +
                                leave.status.slice(1)
                              : "Pending"}
                          </span>
                        </div>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded border">
                          {leave.reason}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Submitted:{" "}
                          {new Date(leave.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <FaEdit className="text-gray-400 ml-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Student;
