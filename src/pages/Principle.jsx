import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  FaUserGraduate,
  FaCheck,
  FaTimes,
  FaEye,
  FaClock,
  FaCalendarAlt,
  FaSignOutAlt,
} from "react-icons/fa";

function Principle() {
  const [leaves, setLeaves] = useState([]);
  const [students, setStudents] = useState([]);
  const [leavesData, setLeavesData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch leave requests and students data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        await axios
          .get("https://attendance-system-express.onrender.com/users/users", {
            headers,
          })
          .then((res) => {
            console.log(res.data, "userss"), setUsersData(res.data.data);
          });
        const leaveDataa = await axios
          .get("https://attendance-system-express.onrender.com/leave", {
            headers,
          })
          .then((res) => {
            console.log(res.data, "leaves");
            setLeavesData(res.data);
          });

        // Handle different response structures
        // const leaveData = leaveRes.data.data || leaveRes.data || [];
        // const usersData = usersRes.data.data || usersRes.data || [];

        console.log(leavesData);
        console.log(usersData, "datauser");

        setStudents(usersData?.filter((user) => user.role == "student"));

        console.log(students, "studentssss");
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/signin");
        } else {
          Swal.fire("Error", "Failed to load data", error);
        }
      }
    };

    fetchData();
  }, [navigate]);

  // Get student name by ID
  const getStudentName = (studentId) => {
    const student = students?.find((s) => s.id)?.name;
    return student ? student : "Unknown Student";
  };

  // Handle leave request approval/rejection
  const handleLeaveAction = async (leaveData, action) => {
    setLoading(true);
    console.log(leaveData, "ssasdasdasdas");
    console.log(action, "action");
    try {
      const token = localStorage.getItem("token");

      // Update leave status using the correct endpoint
      const updateData = {
        status: action, // "approved" or "rejected"
      };

      const action1 =
        updateData.status.trim() == "accepted"
          ? "accept"
          : updateData.status.trim() == "rejected"
          ? "reject"
          : "s";

      console.log(updateData.status, "sssssssl;llas,da,'sd;'sad;");
      console.log(updateData, " sssssssasfafafpadfadf");

      await axios.patch(
        `https://attendance-system-express.onrender.com/leave/${leaveData.studentId}/leaves/${leaveData._id}/${action1}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setLeaves((prev) =>
        prev.map((leave) =>
          leave.id === leaveData.id
            ? {
                ...leave,
                status: action,
              }
            : leave
        )
      );

      Swal.fire({
        icon: "success",
        title: `Leave Request ${action}!`,
        text: `The leave request has been ${action}.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating leave status:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/signin");
      } else {
        Swal.fire("Error", `Failed to ${action} leave request`, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter leaves based on status
  const filteredLeaves = leavesData.filter((leave) => {
    if (filter === "all") return true;
    // Handle undefined or null status by treating as "pending"
    const leaveStatus = leave.status || "pending";
    return leaveStatus === filter;
  });

  // Get statistics
  const getStats = () => {
    const total = leavesData.length;
    const pending = leavesData.filter(
      (l) => (l.status || "pending") == "Pending"
    ).length;
    const approved = leavesData.filter(
      (l) => (l.status || "accepted") == "accepted"
    ).length;
    const rejected = leavesData.filter(
      (l) => (l.status || "rejected") == "rejected"
    ).length;

    return { total, pending, approved, rejected };
  };

  const stats = getStats();

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaUserGraduate className="text-blue-600 text-2xl" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Principal Dashboard
                </h1>
                <p className="text-gray-600">Manage student leave requests</p>
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
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Requests</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.total}
                </p>
              </div>
              <FaEye className="text-blue-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <FaClock className="text-yellow-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.approved}
                </p>
              </div>
              <FaCheck className="text-green-600 text-2xl" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.rejected}
                </p>
              </div>
              <FaTimes className="text-red-600 text-2xl" />
            </div>
          </div>
        </div>

        {/* Leave Requests */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Leave Requests
              </h2>

              {/* Filter Buttons */}
              <div className="flex space-x-2">
                {["all", "Pending", "accepted", "rejected"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      filter === status
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status
                      ? status.charAt(0).toUpperCase() + status.slice(1)
                      : "All"}
                    {status !== "all" && (
                      <span className="ml-1 text-xs">
                        (
                        {status === "pending"
                          ? stats.pending
                          : status === "accepted"
                          ? stats.approved
                          : stats.rejected}
                        )
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredLeaves.length === 0 ? (
              <div className="text-center py-12">
                <FaUserGraduate className="mx-auto text-gray-400 text-4xl mb-4" />
                <p className="text-gray-600">
                  {filter === "all"
                    ? "No leave requests found."
                    : `No ${filter} requests found.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLeaves.map((leave) => (
                  <div
                    key={leave.id}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaUserGraduate className="text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {getStudentName(leave.studentId)}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Student ID: {leave.studentId}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Date of Absence:
                            </p>
                            <p className="text-gray-900">
                              {new Date(leave.leavedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Submitted:
                            </p>
                            <p className="text-gray-900">
                              {new Date(leave.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Reason:
                          </p>
                          <div className="bg-gray-50 p-4 rounded border">
                            <p className="text-gray-900">{leave.leaveReason}</p>
                          </div>
                        </div>

                        {leave.reviewedAt && (
                          <p className="text-sm text-gray-500">
                            Reviewed:{" "}
                            {new Date(leave.reviewedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      {(leave.status === "Pending" || !leave.status) && (
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleLeaveAction(leave, "accepted")}
                            disabled={loading}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                          >
                            <FaCheck />
                            <span>Approve</span>
                          </button>

                          <button
                            onClick={() => handleLeaveAction(leave, "rejected")}
                            disabled={loading}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                          >
                            <FaTimes />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
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

export default Principle;
