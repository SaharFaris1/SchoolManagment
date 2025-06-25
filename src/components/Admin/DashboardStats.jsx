import React, { useEffect, useState } from "react";
import { FaUserGraduate, FaChalkboardTeacher, FaUserTie, FaSchool } from "react-icons/fa";

function DashboardStats() {
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classStudents, setClassStudents] = useState([]);
  const [classTeachers, setClassTeachers] = useState([]);

  // Fetch data 
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

  // Roles
  const students = users.filter((u) => u.role === "student");
  const teachers = users.filter((u) => u.role === "teacher");
  const principals = users.filter((u) => u.role === "principle");

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
          <span className="text-2xl text-purple-500">{classes.length}</span>
        </div>
        <FaSchool size={32} color="#9D3CFF" />
      </div>
    </div>
  );
}

export default DashboardStats;