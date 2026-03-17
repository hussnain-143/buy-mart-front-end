import { useEffect, useState } from 'react';
import AdminTable, { TableColumn } from '../../components/admin/AdminTable';
import { ClipboardList, Calendar } from 'lucide-react';
import { GetLogEntries } from '../../services/log.service';
import Toast from '../../components/common/Toast';

interface OrderLog {
    id: string;
    orderNumber: string;
    action: string;
    user: string;
    role: 'admin' | 'system' | 'vendor' | 'customer' | string;
    timestamp: string;
    details: string;
}

const AdminOrderLogs = () => {
    const [logs, setLogs] = useState<OrderLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, type: "info", message: "" });

    const showToast = (message: string, type = "info") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type }), 3000);
    };

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const res = await GetLogEntries();
                const fetchedLogs = (res.data || []).map((log: any) => ({
                    id: log._id,
                    orderNumber: log.reference_id ? `#REF-${log.reference_id.slice(-6).toUpperCase()}` : 'SYSTEM',
                    action: log.action,
                    user: `${log.user_id?.firstName || ''} ${log.user_id?.lastName || ''}`.trim() || 'System',
                    role: log.user_id?.role || 'system',
                    timestamp: new Date(log.createdAt).toLocaleString(),
                    details: log.action.includes('Order ID') ? 'Transaction update logged' : 'Platform activity'
                }));
                setLogs(fetchedLogs);
            } catch (error: any) {
                showToast(error.message || "Failed to load logs", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const columns: TableColumn<OrderLog>[] = [
        {
            header: 'Order',
            accessorKey: 'orderNumber',
            cell: (row) => <span className="font-bold text-primary">{row.orderNumber}</span>
        },
        {
            header: 'Action',
            accessorKey: 'action',
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <ClipboardList size={14} className="text-gray-400" />
                    <span className="font-medium text-gray-700">{row.action}</span>
                </div>
            )
        },
        {
            header: 'User',
            accessorKey: 'user',
            cell: (row) => (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800">{row.user}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">{row.role}</span>
                </div>
            )
        },
        {
            header: 'Details',
            accessorKey: 'details',
            cell: (row) => <span className="text-gray-500 italic text-sm">{row.details}</span>
        },
        {
            header: 'Timestamp',
            accessorKey: 'timestamp',
            cell: (row) => (
                <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar size={12} />
                    {row.timestamp}
                </div>
            )
        },
    ];

    return (
        <div className="space-y-6">
            {loading && (
                <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            {toast.show && (
                <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
            )}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">
                        Order Logs
                    </h1>
                    <p className="text-gray-500 mt-1">Audit trail of all order activities</p>
                </div>
            </div>

            <div className="h-[600px]">
                <AdminTable
                    data={logs}
                    columns={columns}
                    title="Activity Log"
                    subtitle="Recent system events"
                />
            </div>
        </div>
    );
};

export default AdminOrderLogs;
