import React, { useState } from "react";
import Swal from "sweetalert2";
import AdminSideBar from "../../components/Admin/SideBar";
function AddClass() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [dateStartAt, setDateStartAt] = useState("");
  const [dateEndAt, setDateEndAt] = useState("");
  const [timeStartAt, setTimeStartAt] = useState("");
  const [timeEndAt, setTimeEndAt] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !location.trim() ||
      !capacity.trim() ||
      !description.trim() ||
      !dateStartAt.trim() ||
      !dateEndAt.trim() ||
      !timeStartAt.trim() ||
      !timeEndAt.trim()
    ) {
      return Swal.fire({
        icon: "warning",
        title: "All Fields Required",
        confirmButtonText: "Ok",
      });
    }

    try {
      const response = await fetch(
        "https://attendance-system-express.onrender.com/classes/create",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            name,
            description,
            location,
            capacity,
            dateStartAt,
            dateEndAt,
            timeStartAt,
            timeEndAt,
          }),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Class added successfully",
          showConfirmButton: false,
          timer: 1500,
        });

        setTimeout(() => {}, 1500);
      } else {
        Swal.fire({
          icon: "error",
          title: "An error occurred while adding the class",
          confirmButtonText: "Ok",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to connect to the server",
        text: error.message,
        confirmButtonText: "Ok",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="hidden md:block w-64 h-screen sticky top-0 left-0">
        <AdminSideBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <main className="w-full max-w-lg bg-white rounded-xl shadow-md p-8 m-6">
          <h1 className="text-2xl font-bold mb-4">Add New Class</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">Class Name</label>
              <input
                type="text"
                placeholder="class name"
                className="w-full border px-4 py-2 rounded-xl"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Description</label>
              <input
                type="text"
                placeholder=" Description"
                className="w-full border px-4 py-2 rounded-xl"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Location</label>
              <input
                type="text"
                placeholder="location"
                className="w-full border px-4 py-2 rounded-xl"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Capacity</label>
              <input
                type="number"
                placeholder="  capacity"
                className="w-full border px-4 py-2 rounded-xl"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Start Date</label>
              <input
                type="date"
                className="w-full border px-4 py-2 rounded-xl"
                value={dateStartAt}
                onChange={(e) => setDateStartAt(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">End Date</label>
              <input
                type="date"
                className="w-full border px-4 py-2 rounded-xl"
                value={dateEndAt}
                onChange={(e) => setDateEndAt(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Start Time</label>
              <input
                type="time"
                className="w-full border px-4 py-2 rounded-xl"
                value={timeStartAt}
                onChange={(e) => setTimeStartAt(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">End Time</label>
              <input
                type="time"
                className="w-full border px-4 py-2 rounded-xl"
                value={timeEndAt}
                onChange={(e) => setTimeEndAt(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-sky-700 text-white px-4 py-2 rounded-xl hover:bg-sky-800 transition"
            >
              Add Class
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default AddClass;
