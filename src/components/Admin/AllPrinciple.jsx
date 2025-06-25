import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

function AllPrinciple() {
  const [principals, setPrincipals] = useState([]);
  const [search, setSearch] = useState("");


  useEffect(() => {
    fetch("https://685a896b9f6ef9611156cfd9.mockapi.io/Users") 
      .then((res) => res.json())
      .then((data) => {
       
        const filtered = data.filter((user) => user.role === "principle");
        setPrincipals(filtered);
      })
      .catch((error) => {
        console.error("فشل في جلب بيانات المسؤولين", error);
      });
  }, []);


  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
      try {
        await fetch(`https://685a896b9f6ef9611156cfd9.mockapi.io/Users/${id}`,  {
          method: "DELETE"
        });

  
        setPrincipals(principals.filter((p) => p.id !== id));
        Swal.fire("Deleted!", "Principal has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

 
  const filteredPrincipals = principals.filter(
    (principal) =>
      principal.name?.toLowerCase().includes(search.toLowerCase()) ||
      principal.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">

        <main className="p-6 overflow-auto">
          <h1 className="text-2xl font-bold mb-4">All Principals</h1>

        
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border px-4 py-2 rounded-xl mb-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrincipals.length > 0 ? (
                  filteredPrincipals.map((principal) => (
                    <tr key={principal.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{principal.name || "N/A"}</td>
                      <td className="py-3 px-4">{principal.email || "N/A"}</td>
                      <td className="py-3 px-4 flex gap-2 justify-end">
                        <button
                          onClick={() => {
                          
                            window.location.href = `/admin/edit-principal/${principal.id}`;
                          }}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(principal.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">
                      No principals found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AllPrinciple;