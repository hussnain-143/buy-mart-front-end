import React, { useEffect, useState } from "react";
import {
  Users,
  ShoppingBag,
  Activity,
  Plus,
  Package,
  Tag,
  LayoutDashboard
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Toast from "../../components/common/Toast";
import { GetAllVendors } from "../../services/vendor.service";

import StatsCard from "../../components/admin/StatsCard";
import {
  CategoryDistributionChart,
  OrderTrendsChart,
  RevenueTrendChart,
} from "../../components/admin/AnalyticsCharts";
import {
  TopSellingPanel,
  AlertPanel,
} from "../../components/admin/ProductPanels";
import AdminTable, { TableColumn } from "../../components/admin/AdminTable";
import {
  AdminButton,
} from "../../components/admin/AdminForm";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  /* ===================== STATES ===================== */
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

  /* ===================== STATS ===================== */
  const coreStats = [
    { title: "Active Vendors", value: vendors.length, icon: ShoppingBag, trend: { value: 12, isUp: true } },
    { title: "Active Users", value: "8,242", icon: Users, trend: { value: 5, isUp: true } },
    { title: "Total Products", value: "14,502", icon: Package, trend: { value: 2, isUp: false } },
    { title: "Registered Brands", value: "320", icon: Tag, trend: { value: 8, isUp: true } },
    { title: "Total Orders", value: "45,200", icon: Activity, trend: { value: 15, isUp: true } },
  ];

  /* ===================== TABLE CONFIG ===================== */
  const getStatusStyles = (status: string) => {
    const s = String(status).toLowerCase();
    if (s.includes('active')) return 'bg-green-50 text-green-700 border border-green-100';
    if (s.includes('pending')) return 'bg-amber-50 text-amber-700 border border-amber-100';
    return 'bg-gray-50 text-gray-600 border border-gray-100';
  };

  const vendorColumns: TableColumn<any>[] = [
    {
      header: "Vendor Name",
      accessorKey: "name",
      cell: (row) => (
        <div>
          <p className="font-bold text-gray-900 text-sm">{row.name}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      )
    },
    { header: "Shop Name", accessorKey: "shop" },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => (
        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide inline-flex items-center ${getStatusStyles(row.status)}`}>
          {row.status}
        </span>
      )
    },
    {
      header: "Action",
      accessorKey: "_id",
      cell: () => (
        <button className="text-orange-600 hover:text-orange-700 font-bold text-xs">Manage</button>
      )
    }
  ];

  // Map raw vendor data to flat structure for table
  const vendorData = vendors.map((vendor) => ({
    name: vendor.owner?.firstName + " " + vendor.owner?.lastName || "N/A",
    email: vendor.owner?.email || "N/A",
    shop: vendor.shop_name || "N/A",
    status: vendor.is_active ? "active" : "pending",
    _id: vendor._id
  }));

  /* ===================== RENDER ===================== */
  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-900 pb-20">
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ show: false, message: "", type: "info" })}
        />
      )}

      {/* Main Container */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-8 space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
              <LayoutDashboard className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Dashboard</h1>
              <p className="text-sm font-medium text-gray-500">Overview of platform performance and vendor activities</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">
              Export Reports
            </button>
            <AdminButton onClick={() => console.log("New Entry")} className="px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20">
              <Plus className="w-4 h-4 mr-2" />
              Add New Vendor
            </AdminButton>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {coreStats.map((stat, i) => (
            <StatsCard key={i} {...stat} />
          ))}
        </div>

        {/* ANALYTICS GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[380px]">
              <OrderTrendsChart />
              <RevenueTrendChart />
            </div>

            {/* Main Table Section */}
            <div className="bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
              <AdminTable
                title="Vendor Directory"
                columns={vendorColumns}
                data={vendorData}
                searchPlaceholder="Search by name, email or shop..."
              />
            </div>
          </div>

          <div className="space-y-6 min-w-0">
            <div className="h-[380px]">
              <CategoryDistributionChart />
            </div>
            <div className="h-[400px]">
              <TopSellingPanel />
            </div>
            <div className="h-[350px]">
              <AlertPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

