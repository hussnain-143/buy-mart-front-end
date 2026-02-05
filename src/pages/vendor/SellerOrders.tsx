import React from "react";
import { ShoppingBag, Search, Filter, Download, ExternalLink } from "lucide-react";
import AdminTable, { TableColumn } from "../../components/admin/AdminTable";

const SellerOrders: React.FC = () => {
    const orderColumns: TableColumn<any>[] = [
        {
            header: "Order ID",
            accessorKey: "id",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <span className="font-black text-secondary text-sm">#{row.id}</span>
                </div>
            )
        },
        {
            header: "Customer",
            accessorKey: "customer",
            cell: (row) => (
                <div>
                    <p className="font-bold text-secondary text-sm">{row.customer}</p>
                    <p className="text-secondary/50 text-[10px] font-medium">{row.email}</p>
                </div>
            )
        },
        {
            header: "Date",
            accessorKey: "date",
            cell: (row) => <span className="text-xs font-bold text-secondary/60">{row.date}</span>
        },
        {
            header: "Total",
            accessorKey: "total",
            cell: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-primary">${row.total}</span>
                    <span className="text-[9px] font-black text-secondary/30 uppercase tracking-tighter">{row.paymentMethod}</span>
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
            cell: () => (
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-secondary/70 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all border border-gray-100">
                    Details
                    <ExternalLink className="w-3 h-3" />
                </button>
            )
        }
    ];

    const orderData = [
        { id: "8271A", customer: "John Doe", email: "john@example.com", date: "Oct 24, 2026", total: "125.00", paymentMethod: "Credit Card", status: "Delivered" },
        { id: "8272B", customer: "Jane Smith", email: "jane@example.com", date: "Oct 25, 2026", total: "89.50", paymentMethod: "PayPal", status: "Shipped" },
        { id: "8273C", customer: "Robert Brown", email: "robert@example.com", date: "Oct 25, 2026", total: "220.00", paymentMethod: "Stripe", status: "Processing" },
        { id: "8274D", customer: "Emily Davis", email: "emily@example.com", date: "Oct 26, 2026", total: "45.00", paymentMethod: "Credit Card", status: "Delivered" },
        { id: "8275E", customer: "Michael Wilson", email: "michael@example.com", date: "Oct 26, 2026", total: "310.00", paymentMethod: "Apple Pay", status: "Processing" },
        { id: "8276F", customer: "Sarah Parker", email: "sarah@example.com", date: "Oct 27, 2026", total: "520.00", paymentMethod: "Credit Card", status: "Cancelled" },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans text-secondary pb-20">
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

                {/* TABS (Simplified) */}
                <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
                    {["All Orders", "Pending", "Processing", "Shipped", "Delivered"].map((tab, i) => (
                        <button key={tab} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-white text-secondary shadow-sm' : 'text-secondary/40 hover:text-secondary'}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* FILTERS & SEARCH */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                    <div className="relative w-full lg:w-96 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Find by ID, name or email..."
                            className="w-full pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-wider focus:ring-1 focus:ring-primary/50 outline-none shadow-sm transition-all"
                        />
                    </div>
                    <button className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-secondary/70 hover:bg-gray-50 transition-colors shadow-sm">
                        <Filter className="w-3.5 h-3.5" />
                        Advanced Filter
                    </button>
                </div>

                {/* TABLE CARD */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-clip">
                    <AdminTable
                        columns={orderColumns}
                        data={orderData}
                        title="Latest Transactions"
                    />
                </div>

            </div>
        </div>
    );
};

export default SellerOrders;
