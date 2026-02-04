import React, { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";

import Toast from "../../components/common/Toast";
import { GetAllVendors, updateVendor } from "../../services/vendor.service";

import AdminTable, { TableColumn } from "../../components/admin/AdminTable";
import { AdminButton } from "../../components/admin/AdminForm";
import { useNavigate } from "react-router-dom";

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
  }, [navigate, setVendors]);

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
    if (s.includes('active')) return 'bg-emerald-100 text-emerald-600';
    return 'bg-amber-100 text-amber-600';
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
    { header: "Vendor Name", accessorKey: "name" },
    { header: "Email Address", accessorKey: "email" },
    { header: "Shop Name", accessorKey: "shop" },
    { header: "Total Sales", accessorKey: "sales" },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => (
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center ${getStatusStyles(row.status)}`}>
          {row.status}
        </span>
      )
    },
    {
      header: "Action",
      accessorKey: "_id", // Dummy key
      cell: (row) => row.status !== "active" ? (
        <AdminButton
          onClick={(e) => approveVendor(row._id, e)}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 text-xs"
        >
          <CheckCircle className="w-3 h-3" />
          Approve
        </AdminButton>
      ) : (
        <span className="text-gray-400 text-xs">-</span>
      )
    }
  ];

  return (
    <div className="relative space-y-10 font-montserrat min-w-0 w-full">
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ show: false, message: "", type: "info" })}
        />
      )}
      <div className="relative z-10 space-y-10 min-w-0">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-border/40">
          <div>
            <h1 className="text-4xl font-black tracking-tight">
              Vendor{" "}
              <span className="bg-gradient-to-r from-primary via-orange-500 to-amber-400 bg-clip-text text-transparent">
                Management
              </span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Approve, monitor and control marketplace vendors
            </p>
          </div>
        </div>

        {/* ================= TABS ================= */}
        <div className="flex gap-2 border-b border-primary/40 ">
          {["all", "request"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "all" | "request")}
              className={`
                px-6 py-3 text-sm font-semibold rounded-t-lg transition
                ${activeTab === tab
                  ? "bg-primary text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              {tab === "all" ? "All Vendors" : "Requests"}
            </button>
          ))}
        </div>

        {/* ================= TABLE ================= */}
        <AdminTable
          title={activeTab === 'all' ? "All Registered Vendors" : "Pending Approvals"}
          columns={vendorColumns}
          data={filteredData}
          searchPlaceholder="Search vendors by name, shop or email..."
        />
      </div>
    </div>
  );
};

export default AdminVendor;
