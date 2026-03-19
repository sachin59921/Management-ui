import { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Search
} from "lucide-react";

const PAGE_SIZE = 5;

const AssignedAssets = () => {
  const [assignedAssets, setAssignedAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);

  const [userId, setUserId] = useState("");
  const [assetId, setAssetId] = useState("");
  const [assignmentDate, setAssignmentDate] = useState("");
  const [status, setStatus] = useState("Assigned");

  const [users, setUsers] = useState([]);
  const [assets, setAssets] = useState([]);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios.get("/api/assignments").then((res) => {
      setAssignedAssets(res.data);
      setFilteredAssets(res.data);
    });
    axios.get("/api/users").then((res) => setUsers(res.data));
    axios.get("/api/assets").then((res) => setAssets(res.data));
  }, []);

  // 🔍 Search + Filter
  useEffect(() => {
    let data = [...assignedAssets];

    if (search) {
      data = data.filter(
        (a) =>
          a.userId.toLowerCase().includes(search.toLowerCase()) ||
          a.assetId.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterStatus) {
      data = data.filter((a) => a.status === filterStatus);
    }

    setFilteredAssets(data);
    setPage(1);
  }, [search, filterStatus, assignedAssets]);

  const resetForm = () => {
    setUserId("");
    setAssetId("");
    setAssignmentDate("");
    setStatus("Assigned");
    setEditMode(false);
    setCurrentAssignment(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { userId, assetId, assignmentDate, status };

    if (editMode) {
      const res = await axios.put(
        `/api/assignments/${currentAssignment._id}`,
        payload
      );
      setAssignedAssets((prev) =>
        prev.map((a) => (a._id === currentAssignment._id ? res.data : a))
      );
    } else {
      const res = await axios.post("/api/assignments", payload);
      setAssignedAssets((prev) => [...prev, res.data]);
    }

    setModalOpen(false);
    resetForm();
  };

  const handleEdit = (a) => {
    setCurrentAssignment(a);
    setUserId(a.userId);
    setAssetId(a.assetId);
    setStatus(a.status || "Assigned");
    setAssignmentDate(new Date(a.assignmentDate).toISOString().split("T")[0]);
    setEditMode(true);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;
    await axios.delete(`/api/assignments/${id}`);
    setAssignedAssets((prev) => prev.filter((a) => a._id !== id));
  };

  // 📄 Pagination
  const start = (page - 1) * PAGE_SIZE;
  const paginated = filteredAssets.slice(start, start + PAGE_SIZE);
  const totalPages = Math.ceil(filteredAssets.length / PAGE_SIZE);

  return (
<div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="flex justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow">
        <a href="/admin-dashboard" className="text-blue-600 font-semibold">
          Admin Dashboard
        </a>
        <a href="/" className="text-red-500">
          Logout
        </a>
      </nav>


      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

            {/* Search */}
            <div className="flex items-center border rounded-lg px-3 w-full md:w-1/3">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search user or asset..."
                className="w-full p-2 outline-none bg-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filter */}
            <select
              className="border p-2 rounded-lg"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Assigned">Assigned</option>
              <option value="Returned">Returned</option>
            </select>

            {/* Add Button */}
            <button
              onClick={() => {
                setModalOpen(true);
                setEditMode(false);
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              <Plus size={16} />
              Assign
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Asset</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginated.map((a) => (
                  <tr key={a._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{a.userId}</td>
                    <td className="p-3">{a.assetId}</td>
                    <td className="p-3">
                      {new Date(a.assignmentDate).toLocaleDateString()}
                    </td>

                    {/* Status Badge */}
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          a.status === "Returned"
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {a.status || "Assigned"}
                      </span>
                    </td>

                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(a)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(a._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-6">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 rounded ${
                  page === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md relative">

            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-3 top-3"
            >
              <X />
            </button>

            <h2 className="text-xl font-bold mb-4">
              {editMode ? "Edit Assignment" : "Assign Asset"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select User</option>
                {users.map((u) => (
                  <option key={u._id} value={u.userId}>
                    {u.userId}
                  </option>
                ))}
              </select>

              <select
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Asset</option>
                {assets.map((a) => (
                  <option key={a._id} value={a.assetId}>
                    {a.assetId}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={assignmentDate}
                onChange={(e) => setAssignmentDate(e.target.value)}
                className="w-full p-2 border rounded"
              />

              {/* Status */}
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="Assigned">Assigned</option>
                <option value="Returned">Returned</option>
              </select>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-400 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                  {editMode ? "Update" : "Assign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedAssets;