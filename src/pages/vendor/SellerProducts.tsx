import React from "react";
import { Package, Plus, Search, Filter, Edit2, Trash2, Eye } from "lucide-react";
import AdminTable, { TableColumn } from "../../components/admin/AdminTable";

const SellerProducts: React.FC = () => {
    const productColumns: TableColumn<any>[] = [
        {
            header: "Product",
            accessorKey: "name",
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden">
                        <img src={row.image} alt={row.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="font-bold text-secondary text-sm">{row.name}</p>
                        <p className="text-secondary/50 text-[10px] uppercase font-black tracking-widest">{row.sku}</p>
                    </div>
                </div>
            )
        },
        {
            header: "Category",
            accessorKey: "category",
            cell: (row) => <span className="text-xs font-bold text-secondary/70">{row.category}</span>
        },
        {
            header: "Price",
            accessorKey: "price",
            cell: (row) => <span className="font-bold text-primary">${row.price}</span>
        },
        {
            header: "Stock",
            accessorKey: "stock",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <div className="w-full max-w-[60px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full ${row.stock < 20 ? 'bg-red-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min(row.stock, 100)}%` }}
                        ></div>
                    </div>
                    <span className={`text-xs font-bold ${row.stock < 20 ? 'text-red-500' : 'text-secondary/70'}`}>{row.stock}</span>
                </div>
            )
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: (row) => (
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${row.status === "Active" ? "bg-green-50 text-green-600 border border-green-100" : "bg-gray-50 text-gray-500 border border-gray-100"
                    }`}>
                    {row.status}
                </span>
            )
        },
        {
            header: "Actions",
            accessorKey: "_id",
            cell: () => (
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-primary transition-colors">
                        <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-blue-500 transition-colors">
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    const productData = [
        { name: "Premium Wireless Headset", sku: "W-HD-001", category: "Electronics", price: "199.99", stock: 45, status: "Active", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop" },
        { name: "Ergonomic Mechanical Keyboard", sku: "KB-MCH-002", category: "Accessories", price: "149.00", stock: 12, status: "Active", image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=100&h=100&fit=crop" },
        { name: "Ultra-thin Gaming Laptop", sku: "LP-GAM-003", category: "Laptops", price: "1299.99", stock: 5, status: "Active", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop" },
        { name: "Professional DSLR Camera", sku: "CM-DSLR-004", category: "Cameras", price: "3400.00", stock: 20, status: "Inactive", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop" },
        { name: "Leather Messenger Bag", sku: "BG-LTH-005", category: "Fashion", price: "120.00", stock: 85, status: "Active", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop" },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans text-secondary pb-20">
            <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-8 space-y-8">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                            <Package className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-secondary tracking-tight">Product Inventory</h1>
                            <p className="text-sm font-medium text-secondary/70">Manage and track your listed products</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3.5 bg-secondary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary/90 shadow-xl shadow-secondary/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
                        <Plus className="w-4 h-4" />
                        Add New Product
                    </button>
                </div>

                {/* FILTERS & SEARCH */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                    <div className="relative w-full lg:w-96 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-wider focus:ring-1 focus:ring-primary/50 outline-none shadow-sm transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-secondary/70 hover:bg-gray-50 transition-colors shadow-sm">
                            <Filter className="w-3.5 h-3.5" />
                            Filters
                        </button>
                        <select className="flex-1 lg:flex-none px-5 py-3.5 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-secondary/70 outline-none shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                            <option>Quick Sort: Latest</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Stock: Low to High</option>
                        </select>
                    </div>
                </div>

                {/* TABLE CARD */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <AdminTable
                        columns={productColumns}
                        data={productData}
                        title="Available Products"
                    />
                </div>

            </div>
        </div>
    );
};

export default SellerProducts;
