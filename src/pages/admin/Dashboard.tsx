import React, { useEffect, useState } from "react";
import { LayoutDashboard, ShoppingBag, Users, Package, Tag, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Toast from "../../components/common/Toast";
import { GetAllVendors } from "../../services/vendor.service";

import StatsCard from "../../components/admin/StatsCard";
import AdminTable, { TableColumn } from "../../components/admin/AdminTable";
import { TopSellingPanel } from "../../components/admin/ProductPanels";
import SystemLogs from "../../components/admin/SystemLogs";

import {
  CategoryDistributionChart,
  OrderTrendsChart,
  RevenueTrendChart,
  VendorGrowthChart,
} from "../../components/admin/AnalyticsCharts";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<any[]>([]);
  const [toast, setToast] = useState({ show: false, type: "info", message: "" });

  const showToast = (message: string, type = "info", duration = 3000) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), duration);
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

  /* ===================== CORE STATS ===================== */
  const coreStats = [
    { title: "Active Vendors", value: vendors.length, icon: ShoppingBag },
    { title: "Active Users", value: "8,242", icon: Users },
    { title: "Total Products", value: "14,502", icon: Package },
    { title: "Registered Brands", value: "320", icon: Tag },
    { title: "Total Orders", value: "45,200", icon: Activity },
  ];

  const getStatusStyles = (status: string) => {
    const s = String(status).toLowerCase();
    if (s.includes("active")) return "bg-green-50 text-green-700 border border-green-100";
    if (s.includes("pending")) return "bg-amber-50 text-amber-700 border border-amber-100";
    return "bg-gray-50 text-gray-600 border border-gray-100";
  };

  const vendorColumns: TableColumn<any>[] = [
    {
      header: "Vendor Name",
      accessorKey: "name",
      cell: (row) => (
        <div>
          <p className="font-bold text-secondary text-sm">{row.name}</p>
          <p className="text-secondary/60 text-xs">{row.email}</p>
        </div>
      ),
    },
    { header: "Shop Name", accessorKey: "shop" },
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
      cell: () => (
        <button className="text-primary hover:text-primary/80 font-bold text-xs">
          Manage
        </button>
      ),
    },
  ];

  const vendorData = vendors.map((vendor) => ({
    name: vendor.owner?.firstName + " " + vendor.owner?.lastName || "N/A",
    email: vendor.owner?.email || "N/A",
    shop: vendor.shop_name || "N/A",
    status: vendor.is_active ? "active" : "pending",
    _id: vendor._id,
  }));

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-secondary pb-20">
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ show: false, message: "", type: "info" })}
        />
      )}

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-8 space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
              <LayoutDashboard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-secondary tracking-tight">
                System Dashboard
              </h1>
              <p className="text-sm font-medium text-secondary/70">
                Overview of platform performance and activities
              </p>
            </div>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {coreStats.map((stat, i) => (
            <StatsCard key={i} {...stat} />
          ))}
        </div>

        {/* CHARTS ROW 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <OrderTrendsChart />
          <RevenueTrendChart />
          <VendorGrowthChart />
        </div>

        {/* CHARTS ROW 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CategoryDistributionChart />
          <TopSellingPanel />
          <SystemLogs />
        </div>

        {/* VENDOR TABLE */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          {/* Short line */}
          <p className="text-sm text-gray-500 font-medium mb-2">
            Manage all registered vendors
          </p>
          <AdminTable
            title="Vendor Directory"
            columns={vendorColumns}
            data={vendorData}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
