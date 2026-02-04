import React, { useEffect, useState } from "react";
import {
  Users,
  ShoppingBag,
  Activity,
  Plus,
  Package,
  Tag,
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
import DataTable from "../../components/admin/DataTable";
import {
  TopSellingPanel,
  AlertPanel,
} from "../../components/admin/ProductPanels";
import AdminModal from "../../components/admin/AdminModal";
import {
  AdminInput,
  AdminSelect,
  AdminButton,
} from "../../components/admin/AdminForm";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  /* ===================== STATES ===================== */
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    { title: "Active Vendors", value: vendors.length, icon: ShoppingBag },
    { title: "Active Users", value: "—", icon: Users },
    { title: "Total Products", value: "—", icon: Package },
    { title: "Registered Brands", value: "—", icon: Tag },
    { title: "Total Orders", value: "—", icon: Activity },
  ];

  /* ===================== TABLE ===================== */
  const vendorColumns = [
    { key: "name", header: "Vendor Name" },
    { key: "email", header: "Email" },
    { key: "shop", header: "Shop Name" },
    { key: "status", header: "Status" },
  ];

  const vendorData = vendors.map((vendor) => ({
    name: vendor.owner?.firstName + " " + vendor.owner?.lastName || "N/A",
    email: vendor.owner?.email || "N/A",
    shop: vendor.shop_name || "N/A",
    status: vendor.is_active ? "active" : "pending",
  }));

  /* ===================== RENDER ===================== */
  return (
    <div className="relative space-y-12 font-montserrat min-w-0 w-full">
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ show: false, message: "", type: "info" })}
        />
      )}

      <div className="relative z-10 space-y-12 min-w-0">
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 pb-8 border-b border-border/40">
          <div className="space-y-3">
            <h1 className="text-4xl lg:text-5xl font-black text-secondary">
              System{" "}
              <span className="bg-gradient-to-r from-primary via-orange-500 to-amber-400 bg-clip-text text-transparent">
                Oversight
              </span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Unified Management Hub for Platform Control
            </p>
          </div>

          <AdminButton onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Initiate System Entry
          </AdminButton>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {coreStats.map((stat, i) => (
            <StatsCard key={i} {...stat} />
          ))}
        </div>

        {/* ANALYTICS */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8 min-w-0">
            <OrderTrendsChart />
            <RevenueTrendChart />
          </div>
          <div className="min-w-0">
            <CategoryDistributionChart />
          </div>
        </div>

        {/* PANELS */}
        {/* <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="min-w-0">
            <TopSellingPanel />
          </div>
          <div className="min-w-0">
            <AlertPanel />
          </div>
        </div> */}

        {/* TABLE */}
        {/* <div className="w-full min-w-0 overflow-hidden">
          <DataTable
            title="Global Vendor Management"
            columns={vendorColumns}
            data={vendorData}
          />
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
