import React, { useEffect, useState } from "react";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserTie,
  FaSchool,
} from "react-icons/fa";

function DashboardStats() {
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch users
        const usersResponse = await fetch(
          "https://attendance-system-express.onrender.com/users/users"
        );
        const usersData = await usersResponse.json();
        console.log("Users API response:", usersData);

        // Handle different response structures
        const usersArray = Array.isArray(usersData)
          ? usersData
          : usersData.data && Array.isArray(usersData.data)
          ? usersData.data
          : [];
        setUsers(usersArray);

        // Fetch classes
        const classesResponse = await fetch(
          "https://attendance-system-express.onrender.com/classes"
        );
        const classesData = await classesResponse.json();
        console.log("Classes API response:", classesData);

        // Handle different response structures
        const classesArray = Array.isArray(classesData)
          ? classesData
          : classesData.data && Array.isArray(classesData.data)
          ? classesData.data
          : [];
        setClasses(classesArray);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
        setUsers([]);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-gray-100 shadow rounded-lg p-4 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-4">
        <div className="col-span-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  // Ensure users is an array before filtering
  const usersArray = Array.isArray(users) ? users : [];
  const classesArray = Array.isArray(classes) ? classes : [];

  // Roles - with safe filtering
  const students = usersArray.filter((u) => u && u.role === "student");
  const teachers = usersArray.filter((u) => u && u.role === "teacher");
  const principals = usersArray.filter((u) => u && u.role === "principle");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-4">
      {/*  Students */}
      <div className="bg-blue-100 text-blue-700 shadow rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Students </h3>
          <span className="text-2xl text-blue-500">{students.length}</span>
        </div>
        <FaUserGraduate size={32} color="#63B3ED" />
      </div>

      {/*  Teachers */}
      <div className="bg-green-100 text-green-700 shadow rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
          <h3 className="text-lg font-semibold text-gray-700"> Teachers</h3>
          <span className="text-2xl text-green-500">{teachers.length}</span>
        </div>
        <FaChalkboardTeacher size={32} color="#2ECC71" />
      </div>

      {/*  Principles */}
      <div className="bg-yellow-100 text-yellow-700 shadow rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
          <h3 className="text-lg font-semibold text-gray-700"> Principles</h3>
          <span className="text-2xl text-yellow-500">{principals.length}</span>
        </div>
        <FaUserTie size={32} color="#F1C40F" />
      </div>

      {/*  Classes */}
      <div className="bg-purple-100 text-purple-700 shadow rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
          <h3 className="text-lg font-semibold text-gray-700"> Classes</h3>
          <span className="text-2xl text-purple-500">
            {classesArray.length}
          </span>
        </div>
        <FaSchool size={32} color="#9D3CFF" />
      </div>
    </div>
  );
}

export default DashboardStats;
