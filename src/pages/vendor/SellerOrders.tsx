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

    useEffect(() => {
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
                <div className="flex flex-col gap-1">
                    <span className="font-black text-white text-sm tracking-tighter">#{row._id.slice(-8).toUpperCase()}</span>
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Reference ID</span>
                </div>
            )
        },
        {
            header: "Customer",
            accessorKey: "user_id",
            cell: (row) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xs">
                        {row.user_id?.firstName?.[0]}{row.user_id?.lastName?.[0]}
                    </div>
                    <div>
                        <p className="font-bold text-white text-sm">{row.user_id?.firstName} {row.user_id?.lastName}</p>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">{row.user_id?.email}</p>
                    </div>
                </div>
            )
        },
        {
            header: "Date",
            accessorKey: "createdAt",
            cell: (row) => (
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-white/60">{new Date(row.createdAt).toLocaleDateString()}</span>
                    <span className="text-[9px] font-black text-white/20 uppercase mt-1">{new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            )
        },
        {
            header: "Revenue",
            accessorKey: "vendor_total",
            cell: (row) => (
                <div className="flex flex-col">
                    <span className="font-black text-primary text-lg tracking-tighter">${(row.vendor_total || row.total_amount).toFixed(2)}</span>
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{row.payment_method}</span>
                </div>
            )
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: (row) => {
                const statusStyles: any = {
                    Delivered: "bg-green-500/10 text-green-400 border-green-500/20",
                    Shipped: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                    Processing: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                    Pending: "bg-white/5 text-white/40 border-white/10",
                    Cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
                };

                return (
                    <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-lg shadow-black/20 ${statusStyles[row.status] || statusStyles.Pending}`}>
                        {row.status}
                    </span>
                );
            }
        },
        {
            header: "Action",
            accessorKey: "_id",
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <select
                            value={row.status}
                            onChange={async (e) => {
                                try {
                                    const newStatus = e.target.value;
                                    const { UpdateOrderStatus } = await import("../../services/order.service");
                                    const res = await UpdateOrderStatus(row._id, { status: newStatus });
                                    if (res.success) {
                                        showToast(`Order status updated to ${newStatus}`, "success");
                                        fetchOrders();
                                    }
                                } catch (error: any) {
                                    showToast(error.message || "Failed to update order status", "error");
                                }
                            }}
                            className="appearance-none px-6 py-3 bg-white/5 text-white/70 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all border border-white/5 outline-none cursor-pointer pr-10"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                            <ExternalLink size={12} />
                        </div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-[#0f172a] text-white selection:bg-primary/30 pb-20">
            {loading && (
                <div className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-xl z-[100] flex flex-col items-center justify-center gap-6">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-2xl shadow-primary/20"></div>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Optimizing Dashboard...</p>
                </div>
            )}
            {toast.show && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast({ show: false, message: "", type: "info" })}
                />
            )}

            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative max-w-[1600px] mx-auto px-6 lg:px-12 py-12 lg:py-20 space-y-12">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-12 border-b border-white/5">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-4 bg-primary/10 border border-primary/20 rounded-[24px] shadow-2xl shadow-primary/10">
                                <ShoppingBag className="w-8 h-8 text-primary" />
                            </div>
                            <span className="text-white/20 font-black text-[10px] uppercase tracking-[0.4em]">Vendor Command Center</span>
                        </div>
                        <h1 className="text-6xl font-black text-white tracking-tighter italic uppercase">
                            Orders
                        </h1>
                        <p className="text-lg font-medium text-white/40 max-w-xl mt-2">Precision fulfillment and real-time transaction tracking.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="group flex items-center gap-4 px-8 py-5 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-[24px] hover:bg-white/10 transition-all shadow-xl active:scale-95">
                            <Download className="w-4 h-4 text-primary group-hover:scale-125 transition-transform" />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* TABS & FILTERS */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="flex items-center gap-2 p-2 bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[28px] w-fit shadow-2xl">
                        {["All Orders", "Pending", "Processing", "Shipped", "Delivered"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${filter === tab ? 'bg-primary text-white shadow-2xl shadow-primary/40 scale-105' : 'text-white/30 hover:text-white hover:bg-white/5'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* TABLE CARD */}
                <div className="animate-fade-in-up">
                    <AdminTable
                        columns={orderColumns}
                        data={filteredOrders}
                        title="Latest Transactions"
                        subtitle={`Monitoring ${filteredOrders.length} operations`}
                    />
                </div>

            </div>
        </div>
    );
};

export default SellerOrders;
