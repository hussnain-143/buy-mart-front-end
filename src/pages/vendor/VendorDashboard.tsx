import { LayoutDashboard, ShoppingBag, Package, TrendingUp, Star, DollarSign } from "lucide-react";
import StatsCard from "../../components/admin/StatsCard";
import { OrderTrendsChart, RevenueTrendChart } from "../../components/admin/AnalyticsCharts";
import AdminTable, { TableColumn } from "../../components/admin/AdminTable";

const SellerDashboard: React.FC = () => {

    const coreStats = [
        { title: "Total Revenue", value: "$45,231.89", icon: DollarSign, trend: "+12.5% from last month" },
        { title: "Total Orders", value: "384", icon: ShoppingBag, trend: "+8.2% from last week" },
        { title: "Active Products", value: "86", icon: Package, trend: "5 new this month" },
        { title: "Store Rating", value: "4.9", icon: Star, trend: "from 1.2k reviews" },
        { title: "Sales Growth", value: "24%", icon: TrendingUp, trend: "+4% vs average" },
    ];

    const recentOrdersColumns: TableColumn<any>[] = [
        {
            header: "Order ID",
            accessorKey: "id",
            cell: (row) => <span className="font-bold text-secondary">#{row.id}</span>
        },
        {
            header: "Customer",
            accessorKey: "customer",
        },
        {
            header: "Total",
            accessorKey: "total",
            cell: (row) => <span className="font-bold text-primary">${row.total}</span>
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

    const recentOrdersData = [
        { id: "ORD-8271", customer: "John Doe", total: "125.00", status: "Delivered" },
        { id: "ORD-8272", customer: "Jane Smith", total: "89.50", status: "Processing" },
        { id: "ORD-8273", customer: "Robert Brown", total: "220.00", status: "Pending" },
        { id: "ORD-8274", customer: "Emily Davis", total: "45.00", status: "Delivered" },
        { id: "ORD-8275", customer: "Michael Wilson", total: "310.00", status: "Processing" },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans text-secondary pb-20">
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
                    <OrderTrendsChart />
                    <RevenueTrendChart />
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
                        data={recentOrdersData}
                        title=""
                    />
                </div>

            </div>
        </div>
    );
};

export default SellerDashboard;
