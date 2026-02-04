import React, { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";

import Toast from "../../components/common/Toast";
import { GetAllVendors, updateVendor } from "../../services/vendor.service";

import DataTable from "../../components/admin/DataTable";
import { AdminButton } from "../../components/admin/AdminForm";
import { useNavigate } from "react-router-dom";

const AdminVendor: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"all" | "request">("all");

  /* ===================== TABLE CONFIG ===================== */
  const vendorColumns = [
    { key: "name", header: "Vendor Name" },
    { key: "email", header: "Email Address" },
    { key: "shop", header: "Shop Name" },
    { key: "sales", header: "Total Sales" },
    { key: "status", header: "Status" },
    { key: "action", header: "Action" },
  ];

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

  const vendorData = vendors.map((vendor) => ({
    _id: vendor._id,
    name: vendor.owner?.firstName + " " + vendor.owner?.lastName || "N/A",
    email: vendor.owner?.email || "N/A",
    shop: vendor.shop_name || "N/A",
    sales: vendor.total_sales || 0,
    status: vendor.is_active ? "active" : "pending",
  }));



  /* ===================== ACTION ===================== */
  const approveVendor = async (id: string) => {

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

  /* ===================== FILTERED DATA ===================== */
  const allVendors = vendorData.map((v) => ({
    ...v,
    action: "-",
  }));

  const requestVendors = vendorData
    .filter((v) => v.status !== "active")
    .map((v) => ({
      ...v,
      action: (
        <AdminButton
          onClick={() => approveVendor(v._id)}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
        >
          <CheckCircle className="w-4 h-4" />
          Approve
        </AdminButton>
      ),
    }));

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
        {activeTab === "all" && (
          <div className="w-full min-w-0 overflow-hidden">
            <DataTable
              title="All Registered Vendors"
              columns={vendorColumns}
              data={allVendors}
            />
          </div>
        )}

        {activeTab === "request" && requestVendors.length > 0 ? (
          <div className="w-full min-w-0 overflow-hidden">
            <DataTable
              title="Vendor Approval Requests"
              columns={vendorColumns}
              data={requestVendors}
            />
          </div>
        ) : (
          null
        )}

        {activeTab === "request" && requestVendors.length === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            No pending vendor approval requests.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminVendor;
