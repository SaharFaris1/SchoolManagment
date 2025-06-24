import { useEffect, useState } from "react";
import Swal from "sweetalert2";
function AdminDashboard() {
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [search, setSearch] = useState("");
    const [showAll, setShowAll] = useState(false);
    const [leaves, setLeaves] = useState([]);
    useEffect(() => {
        fetch("https://685a896b9f6ef9611156cfd9.mockapi.io/Users")
          .then((res) => res.json())
          .then((data) => {
            setStudents(data.filter((u) => u.role === "student"));
            setTeachers(data.filter((u) => u.role === "teacher"));
          });
          fetch("api")
          .then((res) => res.json())
          .then(setLeaves);
      }, []);

      const accepted = projects.filter((p) => p.status === "accepted");
  const rejected = projects.filter((p) => p.status === "rejected");
  const pending = projects.filter((p) => p.status === "pending");
  return (
    <div>AdminDashboard</div>
  )
}

export default AdminDashboard