import React, { useEffect, useState } from "react";
import { ShoppingBag, Download, ExternalLink } from "lucide-react";
import AdminTable, { TableColumn } from "../../components/admin/AdminTable";
import { GetVendorOrders } from "../../services/order.service";
import Toast from "../../components/common/Toast";

const SellerOrders: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, type: "info", message: "" });
    const [filter, setFilter] = useState("All Orders");

    const showToast = (message: string, type = "info", duration = 3000) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type }), duration);
    };

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const res = await GetVendorOrders();
                setOrders(res.data || []);
            } catch (error: any) {
                showToast(error.message || "Failed to load orders", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(order => {
        if (filter === "All Orders") return true;
        return order.status?.toLowerCase() === filter.toLowerCase();
    });

    const orderColumns: TableColumn<any>[] = [
        {
            header: "Order ID",
            accessorKey: "_id",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <span className="font-black text-secondary text-sm">#{row._id.slice(-6)}</span>
                </div>
            )
        },
        {
            header: "Customer",
            accessorKey: "user_id",
            cell: (row) => (
                <div>
                    <p className="font-bold text-secondary text-sm">{row.user_id?.firstName} {row.user_id?.lastName}</p>
                    <p className="text-secondary/50 text-[10px] font-medium">{row.user_id?.email}</p>
                </div>
            )
        },
        {
            header: "Date",
            accessorKey: "createdAt",
            cell: (row) => <span className="text-xs font-bold text-secondary/60">{new Date(row.createdAt).toLocaleDateString()}</span>
        },
        {
            header: "Total",
            accessorKey: "total_amount",
            cell: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-primary">${row.total_amount}</span>
                    <span className="text-[9px] font-black text-secondary/30 uppercase tracking-tighter">{row.payment_method}</span>
                </div>
            )
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: (row) => (
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${row.status === "Delivered" ? "bg-green-50 text-green-600 border border-green-100" :
                    row.status === "Shipped" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                        row.status === "Processing" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                            "bg-red-50 text-red-600 border border-red-100"
                    }`}>
                    {row.status}
                </span>
            )
        },
        {
            header: "Action",
            accessorKey: "_id",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <select
                        value={row.status}
                        onChange={async (e) => {
                            try {
                                const newStatus = e.target.value;
                                // Need to import UpdateOrderStatus and use it here
                                const { UpdateOrderStatus } = await import("../../services/order.service");
                                const res = await UpdateOrderStatus(row._id, { status: newStatus });
                                if (res.success) {
                                    showToast(`Order status updated to ${newStatus}`, "success");
                                    // Refresh orders
                                    const fetchOrders = async () => {
                                        setLoading(true);
                                        try {
                                            const ordersRes = await GetVendorOrders();
                                            setOrders(ordersRes.data || []);
                                        } catch (error: any) { } finally {
                                            setLoading(false);
                                        }
                                    };
                                    fetchOrders();
                                }
                            } catch (error: any) {
                                showToast(error.message || "Failed to update order status", "error");
                            }
                        }}
                        className="px-3 py-2 bg-gray-50 text-secondary/70 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100 outline-none cursor-pointer"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-secondary/70 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all border border-gray-100">
                        Details
                        <ExternalLink className="w-3 h-3" />
                    </button>
                </div>
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
                            <ShoppingBag className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-secondary tracking-tight">Order Management</h1>
                            <p className="text-sm font-medium text-secondary/70">Track, manage and fulfill your customer orders</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-gray-200 text-secondary/70 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
                        <Download className="w-4 h-4" />
                        Export Orders (CSV)
                    </button>
                </div>

                {/* TABS */}
                <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
                    {["All Orders", "Pending", "Processing", "Shipped", "Delivered"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === tab ? 'bg-white text-secondary shadow-sm' : 'text-secondary/40 hover:text-secondary'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* TABLE CARD */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <AdminTable
                        columns={orderColumns}
                        data={filteredOrders}
                        title="Latest Transactions"
                    />
                </div>

            </div>
        </div>
    );
};

export default SellerOrders;
