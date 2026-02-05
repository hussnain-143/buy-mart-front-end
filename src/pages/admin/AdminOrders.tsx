import { useState } from 'react';
import AdminTable, { TableColumn } from '../../components/admin/AdminTable';
import { Truck, CheckCircle, XCircle, Clock, Search } from 'lucide-react';

interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: 'Pending' | 'Shipping' | 'Completed' | 'Cancelled';
    date: string;
    itemsCount: number;
}

const AdminOrders = () => {
    const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Shipping' | 'Completed' | 'Cancelled'>('All');

    // Mock data
    const orders: Order[] = [
        { id: '1', orderNumber: '#ORD-7829', customerName: 'Alice Johnson', total: 120.50, status: 'Completed', date: '2023-10-25', itemsCount: 3 },
        { id: '2', orderNumber: '#ORD-7830', customerName: 'Bob Smith', total: 450.00, status: 'Shipping', date: '2023-10-26', itemsCount: 1 },
        { id: '3', orderNumber: '#ORD-7831', customerName: 'Charlie Admin', total: 85.00, status: 'Pending', date: '2023-10-26', itemsCount: 5 },
        { id: '4', orderNumber: '#ORD-7832', customerName: 'David Lee', total: 25.99, status: 'Cancelled', date: '2023-10-24', itemsCount: 1 },
        { id: '5', orderNumber: '#ORD-7833', customerName: 'Eva Green', total: 210.20, status: 'Completed', date: '2023-10-23', itemsCount: 2 },
    ];

    const filteredData = activeTab === 'All' ? orders : orders.filter(o => o.status === activeTab);

    const columns: TableColumn<Order>[] = [
        {
            header: 'Order',
            accessorKey: 'orderNumber',
            cell: (row) => (
                <div className="font-bold text-gray-800">{row.orderNumber}</div>
            ),
        },
        {
            header: 'Customer',
            accessorKey: 'customerName',
        },
        {
            header: 'Items',
            accessorKey: 'itemsCount',
            cell: (row) => <span className="text-gray-500">{row.itemsCount} items</span>,
        },
        {
            header: 'Total',
            accessorKey: 'total',
            cell: (row) => <span className="font-bold text-gray-800">${row.total.toFixed(2)}</span>,
        },
        {
            header: 'Date',
            accessorKey: 'date',
            cell: (row) => <span className="text-gray-400 text-xs">{row.date}</span>,
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (row) => {
                let colorClass = "";
                let Icon = null;

                switch (row.status) {
                    case 'Completed':
                        colorClass = 'bg-green-500/10 text-green-600';
                        Icon = CheckCircle;
                        break;
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
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit ${colorClass}`}>
                        <Icon size={12} strokeWidth={3} /> {row.status}
                    </span>
                )
            },
        },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: () => (
                <button className="text-sm font-bold text-primary hover:underline">View Details</button>
            )
        }
    ];

    const tabs = ['All', 'Pending', 'Shipping', 'Completed', 'Cancelled'] as const;

    return (
        <div className="space-y-8">
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

            <div className="h-[600px]">
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
