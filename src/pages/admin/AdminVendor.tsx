import React, { useState, useEffect } from "react";
import { CheckCircle, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Toast from "../../components/common/Toast";
import { GetAllVendors, updateVendor } from "../../services/vendor.service";

import AdminTable, { TableColumn } from "../../components/admin/AdminTable";

const AdminVendor: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"all" | "request">("all");
  const [vendors, setVendors] = useState<any[]>([]);
  const [toast, setToast] = useState({ show: false, type: "info", message: "" });

  /* ===================== TOAST ===================== */
  const showToast = (message: string, type = "info", duration = 3000) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), duration);
  };

  /* ===================== FETCH VENDORS ===================== */
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          showToast("Please login first", "error");
          setTimeout(() => navigate("/login"), 1500);
          return;
        }

        const res = await GetAllVendors();
        const vendorList = res.data?.vendors || res.data || [];
        setVendors(vendorList);
      } catch (error: any) {
        showToast(error.message || "Failed to load vendors", "error");
      }
    };
    fetchVendors();
  }, [navigate]);

  /* ===================== APPROVE VENDOR ===================== */
  const approveVendor = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("Please login first", "error");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      const res = await updateVendor(id);
      const updatedVendor = res.data?.vendor || res.data;
      showToast(`Vendor approved successfully!`, "success");

      setVendors((prev) =>
        prev.map((v) => (v._id === id ? { ...v, ...updatedVendor, is_active: true } : v))
      );
    } catch (error: any) {
      showToast(error.message || "Failed to approve vendor", "error");
    }
  };

  /* ===================== HELPERS ===================== */
  const getStatusStyles = (status: string) => {
    const s = String(status).toLowerCase();
    if (s.includes("active")) return "bg-green-50 text-green-700 border border-green-100";
    return "bg-amber-50 text-amber-700 border border-amber-100";
  };

  const vendorData = vendors.map((vendor) => ({
    _id: vendor._id,
    name: vendor.owner?.firstName + " " + vendor.owner?.lastName || "N/A",
    email: vendor.owner?.email || "N/A",
    shop: vendor.shop_name || "N/A",
    sales: vendor.total_sales || 0,
    status: vendor.is_active ? "active" : "pending",
  }));

  const filteredData = activeTab === "all"
    ? vendorData
    : vendorData.filter(v => v.status !== "active");

  /* ===================== TABLE CONFIG ===================== */
  const vendorColumns: TableColumn<any>[] = [
    {
      header: "Vendor Name",
      accessorKey: "name",
      cell: (row) => (
        <div>
          <p className="font-bold text-gray-900 text-sm">{row.name}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      ),
    },
    { header: "Shop Name", accessorKey: "shop" },
    { header: "Total Sales", accessorKey: "sales" },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => (
        <span
          className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide inline-flex items-center ${getStatusStyles(
            row.status
          )}`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Action",
      accessorKey: "_id",
      cell: (row) =>
        row.status !== "active" ? (
          <button
            onClick={(e) => approveVendor(row._id, e)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 text-xs rounded-lg shadow-sm"
          >
            <CheckCircle className="w-3 h-3" />
            Approve
          </button>
        ) : (
          <span className="text-gray-400 text-xs font-medium">-</span>
        ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      {/* TOAST */}
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ show: false, message: "", type: "info" })}
        />
      )}

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-8 space-y-8">

        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Vendor Management
              </h1>
              <p className="text-sm font-medium text-gray-500">
                Approve, monitor and control marketplace vendors
              </p>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 border-b border-gray-200">
          {["all", "request"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "all" | "request")}
              className={`
                px-6 py-2.5 text-sm font-bold border-b-2 transition-all
                ${activeTab === tab
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              {tab === "all" ? "All Vendors" : "Pending Requests"}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          {/* Short descriptive line */}
          <p className="text-sm text-gray-500 font-medium mb-2">
            {activeTab === "all"
              ? "Manage all registered vendors"
              : "Review pending vendor requests"}
          </p>

          <AdminTable
            title={activeTab === "all" ? "Registered Vendors" : "Pending Approvals"}
            columns={vendorColumns}
            data={filteredData}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminVendor;
