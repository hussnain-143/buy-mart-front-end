import { useEffect, useState } from 'react';
import AdminTable, { TableColumn } from '../../components/admin/AdminTable';
import { Search } from 'lucide-react';
import { GetAllOrders } from '../../services/order.service';
import Toast from '../../components/common/Toast';

const AdminOrders = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, type: "info", message: "" });
    const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Shipping' | 'Completed' | 'Cancelled'>('All');

    const showToast = (message: string, type = "info", duration = 3000) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type }), duration);
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await GetAllOrders();
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

    const filteredData = activeTab === 'All' ? orders : orders.filter(o => o.status === activeTab);

    const columns: TableColumn<any>[] = [
        {
            header: 'Order Reference',
            accessorKey: '_id',
            cell: (row) => (
                <div className="flex flex-col gap-1">
                    <span className="font-black text-white text-sm tracking-tighter">#{row._id.slice(-8).toUpperCase()}</span>
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Platform ID</span>
                </div>
            ),
        },
        {
            header: 'Customer Info',
            accessorKey: 'user_id',
            cell: (row) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black text-xs">
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
            header: 'Revenue',
            accessorKey: 'total_amount',
            cell: (row) => (
                <div className="flex flex-col">
                    <span className="font-black text-primary text-lg tracking-tighter">${row.total_amount?.toFixed(2)}</span>
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Gross Total</span>
                </div>
            ),
        },
        {
            header: 'Date Created',
            accessorKey: 'createdAt',
            cell: (row) => (
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-white/60">{new Date(row.createdAt).toLocaleDateString()}</span>
                    <span className="text-[9px] font-black text-white/20 uppercase mt-1">{new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            ),
        },
        {
            header: 'Status & Control',
            accessorKey: 'status',
            cell: (row) => {
                const statusStyles: any = {
                    Delivered: "bg-green-500/10 text-green-400 border-green-500/20",
                    Completed: "bg-green-500/10 text-green-400 border-green-500/20",
                    Shipped: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                    Shipping: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                    Cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
                    Pending: "bg-white/5 text-white/40 border-white/10",
                };

                return (
                    <div className="flex items-center gap-4">
                        <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-lg shadow-black/20 ${statusStyles[row.status] || statusStyles.Pending}`}>
                            {row.status}
                        </span>
                        <div className="relative group">
                            <select
                                value={row.status}
                                onChange={async (e) => {
                                    try {
                                        const newStatus = e.target.value;
                                        const { UpdateOrderStatus } = await import('../../services/order.service');
                                        const res = await UpdateOrderStatus(row._id, { status: newStatus });
                                        if (res.success) {
                                            showToast(`Order status updated to ${newStatus}`, "success");
                                            fetchOrders();
                                        }
                                    } catch (error: any) {
                                        showToast(error.message || "Failed to update order status", "error");
                                    }
                                }}
                                className="appearance-none px-4 py-2 bg-white/5 text-white/40 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all border border-white/5 outline-none cursor-pointer pr-8"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                )
            },
        },
        {
            header: 'Analytics',
            accessorKey: '_id',
            cell: () => (
                <button className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white/40 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all border border-white/5 shadow-xl shadow-black/20 group">
                    Details
                    <Search className="w-3 h-3 group-hover:scale-125 transition-transform" />
                </button>
            )
        }
    ];

    const tabs = ['All', 'Pending', 'Shipping', 'Completed', 'Cancelled'] as const;

    return (
        <div className="min-h-screen bg-[#0f172a] text-white selection:bg-primary/30 pb-20">
            {loading && (
                <div className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-xl z-[100] flex flex-col items-center justify-center gap-6">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-2xl shadow-primary/20"></div>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Optimizing Operations...</p>
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
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative space-y-12 animate-fade-in-up">
                
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/5">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-1 bg-primary rounded-full"></div>
                            <span className="text-white/20 font-black text-[10px] uppercase tracking-[0.4em]">Administrative Hub</span>
                        </div>
                        <h1 className="text-7xl font-black text-white tracking-tighter italic uppercase">
                            Global Orders
                        </h1>
                        <p className="text-lg font-medium text-white/40 mt-2">Overseeing all platform transactions and fulfillment cycles.</p>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH MASTER LOGS..."
                            className="pl-16 pr-8 py-5 bg-white/5 border border-white/5 rounded-[24px] text-[10px] font-black uppercase tracking-widest text-white placeholder:text-white/10 focus:outline-none focus:border-primary/40 focus:bg-white/10 focus:ring-4 focus:ring-primary/5 transition-all w-80 shadow-2xl"
                        />
                    </div>
                </div>

                {/* TABS & CONTROLS */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="flex items-center gap-2 p-2 bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[28px] w-fit shadow-2xl">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeTab === tab ? 'bg-primary text-white shadow-2xl shadow-primary/40 scale-105' : 'text-white/30 hover:text-white hover:bg-white/5'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* MAIN TABLE */}
                <div className="shadow-2xl shadow-black/40">
                    <AdminTable
                        data={filteredData}
                        columns={columns}
                        title={`${activeTab} Master Logs`}
                        subtitle={`Analyzing ${filteredData.length} entries across global nodes`}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
