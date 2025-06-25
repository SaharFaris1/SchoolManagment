import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AdminSideBar from "../../components/Admin/SideBar";
function AdminDashboard() {
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [search, setSearch] = useState("");
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

   
  const handleEditUser = (user) => {
    if (user.role === "teacher") {
      // navigate(`/editteacher/${user.id}`);
    } else {
     // navigate(`/editstudent/${user.id}`);
    }
  };
 
    

  return (
    <div className="bg-white rounded-2xl shadow p-3 overflow-auto">

      <div className="flex flex-col">
     <AdminSideBar/>
   <div>
<input
                type="text"
                placeholder="Searching ..."
                className="border border-gray-300 rounded-xl px-4 py-2 w-full md:w-80"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="">
              </div>
              <p className="text-xl py-2 font-semibold mb-4">
Teachers and Students
</p>
<table className="min-w-full table-auto border border-gray-200 text-sm">
<thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border">Student Name </th>
                      <th className="p-2 border">Class</th>
                      <th className="p-2 border">Actions</th>
                    </tr>
                  </thead>

</table>
</div>
</div>
    </div>
  )
}

export default AdminDashboard