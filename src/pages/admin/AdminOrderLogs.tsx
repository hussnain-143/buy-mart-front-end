
import AdminTable, { TableColumn } from '../../components/admin/AdminTable';
import { ClipboardList, Calendar } from 'lucide-react';

interface OrderLog {
    id: string;
    orderNumber: string;
    action: string;
    user: string;
    role: 'Admin' | 'System' | 'Vendor' | 'Customer';
    timestamp: string;
    details: string;
}

const AdminOrderLogs = () => {
    // Mock data
    const logs: OrderLog[] = [
        { id: '1', orderNumber: '#ORD-7829', action: 'Order Created', user: 'Alice Johnson', role: 'Customer', timestamp: '2023-10-25 10:30 AM', details: 'Order placed successfully' },
        { id: '2', orderNumber: '#ORD-7829', action: 'Payment Verified', user: 'System', role: 'System', timestamp: '2023-10-25 10:31 AM', details: 'Stripe payment confirmed' },
        { id: '3', orderNumber: '#ORD-7830', action: 'Status Updated', user: 'Charlie Admin', role: 'Admin', timestamp: '2023-10-26 09:15 AM', details: 'Changed status to Shipping' },
        { id: '4', orderNumber: '#ORD-7831', action: 'Order Cancelled', user: 'David Lee', role: 'Customer', timestamp: '2023-10-24 02:20 PM', details: 'User requested cancellation' },
    ];

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
