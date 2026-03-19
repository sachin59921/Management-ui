import { useState } from "react";
import { Tag, Layers, MapPin, Calendar, Hash, Package } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import PropTypes from "prop-types";

const AddNewAsset = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [assetData, setAssetData] = useState({
    assetId: "",
    assetName: "",
    assetType: "",
    model: "",
    serialNumber: "",
    purchaseDate: "",
    warranty: "",
    location: "",
  });

  const assetTypes = ["Electronics", "Furniture", "Vehicle", "Software"];
  const locations = ["Mumbai Office", "Goa Office", "Delhi Office"];

  const validate = () => {
    const newErrors = {};
    Object.keys(assetData).forEach((key) => {
      if (!assetData[key]) newErrors[key] = "This field is required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setAssetData({ ...assetData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return toast.error("Please fix form errors");

    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1500)); // mock API
      toast.success("Asset added successfully");
      setTimeout(() => (window.location.href = "/asset-inventory"), 1000);
    } catch {
      toast.error("Failed to add asset");
    } finally {
      setLoading(false);
    }
  };

  const Input = ({ icon: Icon, name, type = "text", placeholder }) => (
    <div>
      <div className="relative">
        <Icon className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type={type}
          name={name}
          value={assetData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
        />
      </div>
      {errors[name] && <p className="text-sm text-red-500 mt-1">{errors[name]}</p>}
    </div>
  );

  // PropTypes validation for Input component
  Input.propTypes = {
    icon: PropTypes.elementType.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    placeholder: PropTypes.string,
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">
          Add New Asset
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input icon={Hash} name="assetId" placeholder="Asset ID" />
          <Input icon={Package} name="assetName" placeholder="Asset Name" />

          {/* Asset Type Dropdown */}
          <div>
            <div className="relative">
              <Layers className="absolute left-3 top-3 text-gray-400" size={18} />
              <select
                name="assetType"
                value={assetData.assetType}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border rounded-lg dark:bg-gray-800"
              >
                <option value="">Select Asset Type</option>
                {assetTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>
            {errors.assetType && (
              <p className="text-sm text-red-500 mt-1">{errors.assetType}</p>
            )}
          </div>

          <Input icon={Tag} name="model" placeholder="Model" />
          <Input icon={Hash} name="serialNumber" placeholder="Serial Number" />
          <Input icon={Calendar} name="purchaseDate" type="date" />

          <Input icon={Tag} name="warranty" placeholder="Warranty" />

          {/* Location Dropdown */}
          <div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
              <select
                name="location"
                value={assetData.location}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border rounded-lg dark:bg-gray-800"
              >
                <option value="">Select Location</option>
                {locations.map((loc) => (
                  <option key={loc}>{loc}</option>
                ))}
              </select>
            </div>
            {errors.location && (
              <p className="text-sm text-red-500 mt-1">{errors.location}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => (window.location.href = "/asset-inventory")}
              className="px-5 py-2 rounded-lg bg-gray-300 dark:bg-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white flex items-center gap-2"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {loading ? "Saving..." : "Save Asset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewAsset;