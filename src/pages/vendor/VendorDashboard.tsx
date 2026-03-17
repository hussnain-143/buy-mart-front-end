import React, { useEffect, useState } from "react";
import { LayoutDashboard, ShoppingBag, Package, TrendingUp, Star, DollarSign } from "lucide-react";
import StatsCard from "../../components/admin/StatsCard";
import { OrderTrendsChart, RevenueTrendChart } from "../../components/admin/AnalyticsCharts";
import AdminTable, { TableColumn } from "../../components/admin/AdminTable";
import { GetVendorStats } from "../../services/analytics.service";
import { GetVendorOrders } from "../../services/order.service";
import { GetVendorReviews } from "../../services/review.service";
import Toast from "../../components/common/Toast";

const SellerDashboard: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
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
                const [statsRes, ordersRes, reviewsRes] = await Promise.all([
                    GetVendorStats(),
                    GetVendorOrders(),
                    GetVendorReviews()
                ]);
                setStats(statsRes.data);
                setOrders(ordersRes.data || []);
                setReviews(reviewsRes.data || []);
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
        { title: "Store Rating", value: stats?.storeRating || "0.0", icon: Star, trend: "from client reviews" },
        { title: "Sales Growth", value: stats?.salesGrowth || "N/A", icon: TrendingUp, trend: "Monthly change" },
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
            accessorKey: "vendor_total",
            cell: (row: any) => <span className="font-bold text-primary">${row.vendor_total || row.total_amount}</span>
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

                {/* RECENT ORDERS & REVIEWS GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* RECENT ORDERS TABLE */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold">Recent Orders</h3>
                                <p className="text-xs text-secondary/50 font-medium tracking-tight">Latest transactions from your store</p>
                            </div>
                            <button className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-gray-100 transition-colors">
                                View All
                            </button>
                        </div>
                        <AdminTable
                            columns={recentOrdersColumns}
                            data={orders.slice(0, 5)}
                            title=""
                        />
                    </div>

                    {/* RECENT REVIEWS */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold">Recent Reviews</h3>
                                <p className="text-xs text-secondary/50 font-medium tracking-tight">Latest feedback from your customers</p>
                            </div>
                            <button className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-gray-100 transition-colors">
                                View All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {reviews.length > 0 ? reviews.slice(0, 4).map((review) => (
                                <div key={review._id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm shrink-0">
                                        {review.user_id?.firstName?.charAt(0) || "U"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="text-sm font-bold text-secondary truncate">{review.user_id?.firstName} {review.user_id?.lastName}</h4>
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-2.5 h-2.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-xs text-secondary/60 line-clamp-2 font-medium">"{review.comment}"</p>
                                        <p className="text-[10px] text-primary font-bold mt-2 uppercase tracking-widest">{review.product_id?.name}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-12 text-center text-secondary/30 font-bold uppercase tracking-widest text-[10px]">
                                    No reviews yet
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SellerDashboard;
