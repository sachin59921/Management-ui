import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Boxes,
  Users,
  ClipboardList,
  LogOut,
  Home
} from "lucide-react";
import backgroundImage from "../assets/images/admin-bg.jpg";

const AdminDashboard = () => {
  const [totalAssets, setTotalAssets] = useState(0);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await axios.get("/api/assets");
      setTotalAssets(Array.isArray(res.data) ? res.data.length : 0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-100"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur shadow-md">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold text-gray-800">PeopleDesk</h1>
          <Link to="/" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-red-600 transition">
            <Home size={18} /> Home
          </Link>
        </div>

        <Link
          to="/logout"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
        >
          <LogOut size={16} /> Logout
        </Link>
      </nav>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-16">
    <h2 className="text-4xl font-bold text-center text-white mb-14 tracking-wide">
      Admin Dashboard
    </h2>

        {/* Stats */}
<div className="flex justify-center mt-8">
  <div className="w-full max-w-3xl">
    <DashboardCard
      title="Total Assets"
      value={totalAssets}
      icon={<Boxes size={40} />}
      color="bg-blue-500"
    />
  </div>
</div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
          <ActionCard
            to="/asset-inventory"
            title="Asset Inventory"
            icon={<ClipboardList size={40} />}
            color="bg-pink-500"
          />
          <ActionCard
            to="/user-management"
            title="User Management"
            icon={<Users size={40} />}
            color="bg-blue-500"
          />
          <ActionCard
            to="/assigned-assets"
            title="Asset Tracking"
            icon={<Boxes size={40} />}
            color="bg-violet-500"
          />
        </div>
      </div>
    </div>
  );
};

/* Reusable Components */

const DashboardCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between hover:shadow-lg transition">
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-3xl font-bold text-gray-800 mt-1">{value}</h3>
    </div>
    <div className={`${color} text-white p-3 rounded-lg`}>
      {icon}
    </div>
  </div>
);

import PropTypes from "prop-types";

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
};

const ActionCard = ({ to, title, icon, color }) => (
  <Link
    to={to}
    className={`${color} text-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center gap-4 hover:scale-105 transition`}
  >
    {icon}
    <p className="text-lg font-semibold">{title}</p>
  </Link>
);

ActionCard.propTypes = {
  to: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
};

export default AdminDashboard;