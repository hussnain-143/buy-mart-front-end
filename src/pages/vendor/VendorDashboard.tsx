import React, { useEffect, useState } from "react";
import { LayoutDashboard, ShoppingBag, Package, TrendingUp, Star, DollarSign } from "lucide-react";
import StatsCard from "../../components/admin/StatsCard";
import { OrderTrendsChart, RevenueTrendChart } from "../../components/admin/AnalyticsCharts";
import AdminTable, { TableColumn } from "../../components/admin/AdminTable";
import { GetVendorStats } from "../../services/analytics.service";
import { GetVendorOrders } from "../../services/order.service";
import Toast from "../../components/common/Toast";

const SellerDashboard: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, type: "info", message: "" });

    const showToast = (message: string, type = "info", duration = 3000) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type }), duration);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [statsRes, ordersRes] = await Promise.all([
                    GetVendorStats(),
                    GetVendorOrders()
                ]);
                setStats(statsRes.data);
                setOrders(ordersRes.data || []);
            } catch (error: any) {
                showToast(error.message || "Failed to load vendor data", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const coreStats = [
        { title: "Total Revenue", value: `$${stats?.totalRevenue?.toLocaleString() || 0}`, icon: DollarSign, trend: "Overall earnings" },
        { title: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingBag, trend: "Successful orders" },
        { title: "Active Products", value: stats?.totalProducts || 0, icon: Package, trend: "Live in store" },
        { title: "Store Rating", value: "4.9", icon: Star, trend: "from client reviews" },
        { title: "Sales Growth", value: "N/A", icon: TrendingUp, trend: "Coming soon" },
    ];

    const recentOrdersColumns: TableColumn<any>[] = [
        {
            header: "Order ID",
            accessorKey: "_id",
            cell: (row) => <span className="font-bold text-secondary">#{row._id.slice(-6)}</span>
        },
        {
            header: "Customer",
            accessorKey: "user_id",
            cell: (row) => (
                <div>
                    <p className="font-bold text-sm">{row.user_id?.firstName} {row.user_id?.lastName}</p>
                    <p className="text-xs text-secondary/50">{row.user_id?.email}</p>
                </div>
            )
        },
        {
            header: "Total",
            accessorKey: "total_amount",
            cell: (row) => <span className="font-bold text-primary">${row.total_amount}</span>
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: (row) => (
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${row.status === "Delivered" ? "bg-green-50 text-green-600 border border-green-100" :
                        row.status === "Processing" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                            "bg-amber-50 text-amber-600 border border-amber-100"
                    }`}>
                    {row.status}
                </span>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans text-secondary pb-20">
            {loading && (
                <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
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
                                Seller Dashboard
                            </h1>
                            <p className="text-sm font-medium text-secondary/70">
                                Welcome back! Here's what's happening with your store today.
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

                {/* CHARTS ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <OrderTrendsChart data={stats?.revenueTrends?.map((item: any) => ({
                        name: `${item._id.month}/${item._id.year.toString().slice(-2)}`,
                        revenue: item.revenue,
                        orders: item.orders
                    }))} />
                    <RevenueTrendChart data={stats?.revenueTrends?.map((item: any) => ({
                        name: `${item._id.month}/${item._id.year.toString().slice(-2)}`,
                        revenue: item.revenue,
                        orders: item.orders
                    }))} />
                </div>

                {/* RECENT ORDERS TABLE */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold">Recent Orders</h3>
                            <p className="text-xs text-secondary/50 font-medium tracking-tight">Latest transactions from your store</p>
                        </div>
                        <button className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-gray-100 transition-colors">
                            View All Orders
                        </button>
                    </div>
                    <AdminTable
                        columns={recentOrdersColumns}
                        data={orders.slice(0, 5)}
                        title=""
                    />
                </div>

            </div>
        </div>
    );
};

export default SellerDashboard;
