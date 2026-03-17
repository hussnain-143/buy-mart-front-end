import { useEffect, useState } from 'react';
import AdminTable, { TableColumn } from '../../components/admin/AdminTable';
import { Star, Power, PowerOff } from 'lucide-react';
import { GetAdminProducts, ToggleProductStatus } from '../../services/product.service';
import Toast from '../../components/common/Toast';

const AdminProducts = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, type: "info", message: "" });

    const showToast = (message: string, type = "info", duration = 3000) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type }), duration);
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await GetAdminProducts();
            setProducts(res.data?.docs || res.data || []);
        } catch (error: any) {
            showToast(error.message || "Failed to load products", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        if (!window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this product?`)) return;
        try {
            await ToggleProductStatus(id);
            showToast(`Product ${currentStatus ? 'deactivated' : 'activated'} successfully`, "success");
            fetchProducts();
        } catch (error: any) {
            showToast(error.message || "Failed to update product status", "error");
        }
    };

    const columns: TableColumn<any>[] = [
        {
            header: 'Product',
            accessorKey: 'name',
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                        <img src={row.images_id?.[0]?.image_url || 'https://via.placeholder.com/200'} alt={row.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <div className="font-bold text-gray-800">{row.name}</div>
                        <div className="text-xs text-gray-500">{row.category_id?.name || 'Uncategorized'}</div>
                    </div>
                </div>
            ),
        },
        {
            header: 'Price',
            accessorKey: 'price',
            cell: (row) => <span className="font-semibold text-gray-700">${row.price?.toFixed(2)}</span>,
        },
        {
            header: 'Stock',
            accessorKey: 'stock_quantity',
            cell: (row) => (
                <span className={`font-medium ${row.stock_quantity < 10 ? 'text-red-500' : 'text-gray-600'}`}>
                    {row.stock_quantity} units
                </span>
            ),
        },
        {
            header: 'Rating',
            accessorKey: 'rating',
            cell: (row) => (
                <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                    <Star size={14} fill="currentColor" /> {row.avgRating || 0}
                </div>
            )
        },
        {
            header: 'Status',
            accessorKey: 'is_active',
            cell: (row) => {
                let colorClass = "";
                let statusLabel = "";
                if (row.stock_quantity === 0) {
                    colorClass = 'bg-red-500/10 text-red-600';
                    statusLabel = 'Out of Stock';
                } else if (row.is_active === false) {
                    colorClass = 'bg-gray-100 text-gray-500';
                    statusLabel = 'Inactive';
                } else {
                    colorClass = 'bg-green-500/10 text-green-600';
                    statusLabel = 'Active';
                }
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colorClass}`}>
                        {statusLabel}
                    </span>
                );
            },
        },
        {
            header: 'Actions',
            accessorKey: '_id',
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleToggleStatus(row._id, row.is_active)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md ${row.is_active
                            ? 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 shadow-red-500/10'
                            : 'bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 shadow-green-500/10'
                            }`}
                    >
                        {row.is_active ? (
                            <><PowerOff size={14} /> Deactivate</>
                        ) : (
                            <><Power size={14} /> Activate</>
                        )}
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
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
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">
                        Products
                    </h1>
                    <p className="text-gray-500 mt-1">Manage platform inventory</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <AdminTable
                    data={products}
                    columns={columns}
                    title="Product Catalog"
                    subtitle="All available items"
                />
            </div>
        </div>
    );
};

export default AdminProducts;
