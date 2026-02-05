import React, { useEffect, useState } from "react";
import {
  Users,
  ShoppingBag,
  Activity,
  Plus,
  Package,
  Layers,
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
    { title: "Active Users", value: "8,240", icon: Users, trend: { value: 5, isUp: true } },
    { title: "Total Products", value: "14,502", icon: Package, trend: { value: 2, isUp: false } },
    { title: "Registered Brands", value: "320", icon: Layers, trend: { value: 8, isUp: true } },
    { title: "Total Orders", value: "45,200", icon: Activity, trend: { value: 15, isUp: true }, isCritical: false },
  ];

  /* ===================== TABLE CONFIG ===================== */
  const getStatusStyles = (status: string) => {
    const s = String(status).toLowerCase();
    if (s.includes('active')) return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.2)]';
    if (s.includes('pending')) return 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(251,191,36,0.2)]';
    return 'bg-white/5 text-gray-400 border border-white/10';
  };

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
    { header: "Shop Storefront", accessorKey: "shop" },
    { header: "Date Joined", accessorKey: "joined", cell: () => <span className="text-gray-500 font-mono text-xs">Oct 24, 2025</span> },
    {
      header: "Platform Status",
      accessorKey: "status",
      cell: (row) => (
        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] inline-flex items-center gap-2 ${getStatusStyles(row.status)}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${row.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          {row.status}
        </span>
      )
    },
  ];

  // Map raw vendor data to flat structure for table
  const vendorData = vendors.map((vendor) => ({
    name: vendor.owner?.firstName + " " + vendor.owner?.lastName || "N/A",
    email: vendor.owner?.email || "N/A",
    shop: vendor.shop_name || "N/A",
    status: vendor.is_active ? "active" : "pending",
  }));

  /* ===================== RENDER ===================== */
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
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 pb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full w-fit border border-white/10 backdrop-blur-md">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <div className="w-2 h-2 bg-emerald-500 rounded-full absolute" />
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">System Online v2.5.0</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-none tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white">Nexus</span>
              <span className="text-cyan-500">.OS</span>
            </h1>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.3em] pl-2 border-l-2 border-cyan-500">
              Unified Command Interface
            </p>
          </div>

          <AdminButton onClick={() => console.log("Initialize Vendor")} className="h-14 px-8 rounded-[2rem] bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-[0_10px_30px_rgba(8,145,178,0.4)] border-none">
            <Plus className="w-5 h-5 mr-3" />
            Initialize Vendor
          </AdminButton>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {coreStats.map((stat, i) => (
            <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <StatsCard {...stat} />
            </div>
          ))}
        </div>

        {/* ANALYTICS BENTO GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Main Chart Area */}
          <div className="xl:col-span-8 flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[450px]">
              <OrderTrendsChart />
              <RevenueTrendChart />
            </div>

            {/* Wide Table in Bento */}
            <div className="xl:col-span-8">
              <AdminTable
                title="Global Vendor Registry"
                columns={vendorColumns}
                data={vendorData}
                searchPlaceholder="Search vendor network..."
              />
            </div>
          </div>

          {/* Sidebar Panels */}
          <div className="xl:col-span-4 flex flex-col gap-8">
            <CategoryDistributionChart />
            <TopSellingPanel />
            <AlertPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

