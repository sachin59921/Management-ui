import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Search, Plus, Edit, Trash2} from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const AssetInventory = () => {
  const [assets, setAssets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const itemsPerPage = 8;
  const userRole = localStorage.getItem("role") || "admin"; // admin / viewer

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    const res = await axios.get("/api/assets");
    setAssets(res.data);
  };

  /* ---------- FILTER ---------- */
  const filteredAssets = useMemo(() => {
    return assets.filter(asset =>
      Object.values(asset)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [assets, searchQuery]);

  /* ---------- SORT ---------- */
  const sortedAssets = useMemo(() => {
    if (!sortConfig.key) return filteredAssets;
    return [...filteredAssets].sort((a, b) => {
      const aVal = a[sortConfig.key]?.toString() || "";
      const bVal = b[sortConfig.key]?.toString() || "";
      return sortConfig.direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  }, [filteredAssets, sortConfig]);

  /* ---------- PAGINATION ---------- */
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentAssets = sortedAssets.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedAssets.length / itemsPerPage);

  /* ---------- EXPORT ---------- */
  const exportCSV = () => {
    const csv = Papa.unparse(sortedAssets);
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "assets.csv";
    link.click();
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(sortedAssets);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Assets");
    XLSX.writeFile(wb, "assets.xlsx");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this asset?")) return;
    await axios.delete(`/api/assets/${id}`);
    setAssets(prev => prev.filter(a => a.assetId !== id));
  };

  const toggleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">

        {/* NAVBAR */}
        <nav className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow">
          <Link to="/admin-dashboard" className="text-blue-500 font-semibold">
            Admin Dashboard
          </Link>

          <div className="flex gap-3 items-center">

            <Link to="/" className="text-red-500 font-semibold">
              Logout
            </Link>
          </div>
        </nav>

        {/* CONTENT */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold">Asset Inventory</h2>

            <div className="flex gap-2">
              {userRole === "admin" && (
                <Link
                  to="/add-newAsset"
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded"
                >
                  <Plus size={16} /> Add
                </Link>
              )}

              <button onClick={exportCSV} className="px-3 py-2 bg-green-500 text-white rounded">
                CSV
              </button>
              <button onClick={exportExcel} className="px-3 py-2 bg-purple-500 text-white rounded">
                Excel
              </button>

              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 rounded border dark:bg-gray-800"
                />
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow">
            <table className="min-w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  {["assetId","assetName","assetType","model","status","location"].map(col => (
                    <th
                      key={col}
                      onClick={() => toggleSort(col)}
                      className="px-6 py-3 cursor-pointer text-left"
                    >
                      {col.toUpperCase()}
                    </th>
                  ))}
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentAssets.map(asset => (
                  <tr key={asset.assetId} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-3">{asset.assetId}</td>
                    <td className="px-6 py-3">{asset.assetName}</td>
                    <td className="px-6 py-3">{asset.assetType}</td>
                    <td className="px-6 py-3">{asset.model}</td>

                    {/* STATUS BADGE */}
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${asset.status === "Available" ? "bg-green-100 text-green-700" :
                          asset.status === "Assigned" ? "bg-blue-100 text-blue-700" :
                          "bg-yellow-100 text-yellow-700"}`}>
                        {asset.status}
                      </span>
                    </td>

                    <td className="px-6 py-3">{asset.location}</td>

                    <td className="px-6 py-3 flex gap-2">
                      <Link
                        to={`/edit-asset/${asset.assetId}`}
                        className="bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-1"
                      >
                        <Edit size={14} /> Edit
                      </Link>

                      {userRole === "admin" && (
                        <button
                          onClick={() => handleDelete(asset.assetId)}
                          className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
  );
};

export default AssetInventory;