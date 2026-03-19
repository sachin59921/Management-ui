import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { exportCSV, exportExcel } from "../utils/exportUtils";
import ConfirmModal from "./ConfirmModal";
import { ArrowUpDown, Trash2, Download} from "lucide-react";

const PAGE_SIZE = 5;

const UserManagement = () => {
  const currentUserRole = "Admin";

  const [users, setUsers] = useState([]);
  const [sortKey, setSortKey] = useState("");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    axios.get("/api/users").then((res) => setUsers(res.data || []));
  }, []);

  const sortedUsers = useMemo(() => {
    if (!sortKey) return users;
    return [...users].sort((a, b) => {
      const A = String(a[sortKey] ?? "");
      const B = String(b[sortKey] ?? "");
      return sortDir === "asc" ? A.localeCompare(B) : B.localeCompare(A);
    });
  }, [users, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const paginatedUsers = sortedUsers.slice(start, start + PAGE_SIZE);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const deleteUser = async () => {
    await axios.delete(`/api/users/${deleteId}`);
    setUsers((prev) => prev.filter((u) => u.userId !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">

      {/* 🔥 Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow">
        <div className="flex items-center gap-6">
          <a
            href="/admin-dashboard"
            className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800"
          >
            Admin Dashboard
          </a>
        </div>

        <a
          href="/"
          className="flex items-center gap-2 text-red-500 hover:text-red-700"
        >
          Logout
        </a>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 border-b dark:border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  User Management
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage users, roles and access
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => exportCSV(users, "users")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <Download size={16} /> CSV
                </button>
                <button
                  onClick={() => exportExcel(users, "users")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Download size={16} /> Excel
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {["userId", "username", "email", "role"].map((col) => (
                      <th
                        key={col}
                        onClick={() => handleSort(col)}
                        className="px-6 py-3 text-left text-sm font-semibold cursor-pointer"
                      >
                        <div className="flex items-center gap-1">
                          {col.toUpperCase()}
                          <ArrowUpDown size={14} />
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedUsers.map((u, idx) => (
                    <tr
                      key={u.userId}
                      className={`border-t ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100`}
                    >
                      <td className="px-6 py-4">{u.userId}</td>
                      <td className="px-6 py-4 font-medium">{u.username}</td>
                      <td className="px-6 py-4">{u.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            u.role === "Admin"
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {currentUserRole === "Admin" && (
                          <button
                            onClick={() => setDeleteId(u.userId)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-500 text-white hover:bg-red-600"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}

                  {paginatedUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-6 border-t">
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>

              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-2 rounded bg-gray-200 disabled:opacity-50"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-2 rounded ${
                      page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-2 rounded bg-gray-200 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!deleteId}
        title="Delete User"
        message="This action cannot be undone. Continue?"
        onClose={() => setDeleteId(null)}
        onConfirm={deleteUser}
      />
    </div>
  );
};

export default UserManagement;