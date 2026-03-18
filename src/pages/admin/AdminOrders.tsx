import { useEffect, useState } from 'react';
import AdminTable, { TableColumn } from '../../components/admin/AdminTable';
import { Truck, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
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

    useEffect(() => {
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
        fetchOrders();
    }, []);

    const filteredData = activeTab === 'All' ? orders : orders.filter(o => o.status === activeTab);

    const columns: TableColumn<any>[] = [
        {
            header: 'Order',
            accessorKey: '_id',
            cell: (row) => (
                <div className="font-bold text-gray-800">#{row._id.slice(-6)}</div>
            ),
        },
        {
            header: 'Customer',
            accessorKey: 'user_id',
            cell: (row) => <span>{row.user_id?.firstName} {row.user_id?.lastName}</span>
        },
        {
            header: 'Total',
            accessorKey: 'total_amount',
            cell: (row) => <span className="font-bold text-gray-800">${row.total_amount?.toFixed(2)}</span>,
        },
        {
            header: 'Date',
            accessorKey: 'createdAt',
            cell: (row) => <span className="text-gray-400 text-xs">{new Date(row.createdAt).toLocaleDateString()}</span>,
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (row) => {
                let colorClass = "";
                let Icon = null;

                switch (row.status) {
                    case 'Delivered':
                    case 'Completed':
                        colorClass = 'bg-green-500/10 text-green-600';
                        Icon = CheckCircle;
                        break;
                    case 'Shipped':
                    case 'Shipping':
                        colorClass = 'bg-blue-500/10 text-blue-600';
                        Icon = Truck;
                        break;
                    case 'Cancelled':
                        colorClass = 'bg-red-500/10 text-red-600';
                        Icon = XCircle;
                        break;
                    default:
                        colorClass = 'bg-yellow-500/10 text-yellow-600';
                        Icon = Clock;
                }

                return (
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit ${colorClass}`}>
                            {Icon && <Icon size={12} strokeWidth={3} />}
                        </span>
                        <select
                            value={row.status}
                            onChange={async (e) => {
                                try {
                                    const newStatus = e.target.value;
                                    const { UpdateOrderStatus } = await import('../../services/order.service');
                                    const res = await UpdateOrderStatus(row._id, { status: newStatus });
                                    if (res.success) {
                                        showToast(`Order status updated to ${newStatus}`, "success");
                                        const fetchOrders = async () => {
                                            setLoading(true);
                                            try {
                                                const ordersRes = await GetAllOrders();
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
                            className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-transparent border-none outline-none cursor-pointer ${colorClass.split(' ')[1]}`}
                        >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                )
            },
        },
        {
            header: 'Actions',
            accessorKey: '_id',
            cell: () => (
                <button className="text-sm font-bold text-primary hover:underline">View Details</button>
            )
        }
    ];

    const tabs = ['All', 'Pending', 'Shipping', 'Completed', 'Cancelled'] as const;

    return (
        <div className="space-y-8">
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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">
                        Orders
                    </h1>
                    <p className="text-gray-500 mt-1">Track and manage customer orders</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 w-64"
                    />
                </div>
            </div>

            {/* Custom Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-white rounded-xl w-fit shadow-sm border border-gray-100">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
                        px-4 py-2 rounded-lg text-sm font-bold transition-all
                        ${activeTab === tab
                                ? 'bg-orange-500 text-white shadow-md'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                            }
                    `}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <AdminTable
                    data={filteredData}
                    columns={columns}
                    title={`${activeTab} Orders`}
                    subtitle={`Showing ${filteredData.length} records`}
                />
            </div>
        </div>
    );
};

export default AdminOrders;
