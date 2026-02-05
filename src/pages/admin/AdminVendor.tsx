import React, { useState, useEffect } from "react";
import { CheckCircle, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Toast from "../../components/common/Toast";
import { GetAllVendors, updateVendor } from "../../services/vendor.service";

import AdminTable, { TableColumn } from "../../components/admin/AdminTable";
import { AdminButton } from "../../components/admin/AdminForm";

const AdminVendor: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"all" | "request">("all");
  const [vendors, setVendors] = useState<any[]>([]);

  const [toast, setToast] = useState({
    show: false,
    type: "info",
    message: "",
  });

  /* ===================== TOAST ===================== */
  const showToast = (message: string, type = "info", duration = 3000) => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type }),
      duration
    );
  };

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

  /* ===================== ACTION ===================== */
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
      showToast(error.message || "Failed to load vendors", "error");
    }
  };

  /* ===================== HELPERS ===================== */
  const getStatusStyles = (status: string) => {
    const s = String(status).toLowerCase();
    if (s.includes('active')) return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.2)]';
    if (s.includes('pending')) return 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(251,191,36,0.2)]';
    return 'bg-white/5 text-gray-400 border border-white/10';
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
      header: "Vendor Identity",
      accessorKey: "name",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs shadow-lg">
            {row.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-white">{row.name}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">{row.email}</div>
          </div>
        </div>
      )
    },
    { header: "Shop Name", accessorKey: "shop" },
    { header: "Total Sales", accessorKey: "sales" },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => (
        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] inline-flex items-center gap-2 ${getStatusStyles(row.status)}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${row.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          {row.status}
        </span>
      )
    },
    {
      header: "Action",
      accessorKey: "_id",
      cell: (row) => row.status !== "active" ? (
        <AdminButton
          onClick={(e) => approveVendor(row._id, e)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1.5 text-xs shadow-[0_0_15px_rgba(16,185,129,0.4)] border-none"
        >
          <CheckCircle className="w-3 h-3" />
          Approve
        </AdminButton>
      ) : (
        <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest">-</span>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white font-montserrat relative overflow-x-hidden selection:bg-cyan-500/30">
      {/* Global Background Mesh Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
      </div>

      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ show: false, message: "", type: "info" })}
        />
      )}

      <div className="relative z-10 p-6 lg:p-10 space-y-10 max-w-[1920px] mx-auto">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full w-fit border border-white/10 backdrop-blur-md">
              <Users className="w-3 h-3 text-cyan-400" />
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Vendor Control Module</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight">
              Vendor{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-gradient-x">
                Management
              </span>
            </h1>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em] pl-2 border-l-2 border-purple-500">
              Approve, monitor and control marketplace vendors
            </p>
          </div>
        </div>

        {/* ================= TABS ================= */}
        <div className="flex gap-4 p-1 rounded-2xl bg-white/5 w-fit backdrop-blur-md border border-white/5">
          {["all", "request"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "all" | "request")}
              className={`
                px-8 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300
                ${activeTab === tab
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
                }
              `}
            >
              {tab === "all" ? "All Vendors" : "Requests"}
            </button>
          ))}
        </div>

        {/* ================= TABLE ================= */}
        <div className="animate-fade-in-up">
          <AdminTable
            title={activeTab === 'all' ? "All Registered Vendors" : "Pending Approvals"}
            columns={vendorColumns}
            data={filteredData}
            searchPlaceholder="Search vendors by name, shop or email..."
          />
        </div>
      </div>
    </div>
  );
};

export default AdminVendor;
