import React, { useEffect, useState } from "react";
import { Package, Plus, Search, Filter, Edit2, Trash2, Eye } from "lucide-react";
import AdminTable, { TableColumn } from "../../components/admin/AdminTable";
import { GetVendorProducts, AddProduct, UpdateProduct, DeleteProduct } from "../../services/product.service";
import { GetAllCategories } from "../../services/category.service";
import { GetUserBrands } from "../../services/brand.service";
import Toast from "../../components/common/Toast";

const SellerProducts: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: "", type: "info" });

    // Add Product State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        desc: "",
        price: "",
        discount_price: "0",
        sku: "",
        stock_quantity: "0",
        category_id: "",
        brand_id: ""
    });
    const [newProductImages, setNewProductImages] = useState<FileList | null>(null);

    const showToast = (message: string, type = "info") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type }), 3000);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [productsRes, categoriesRes, brandsRes] = await Promise.all([
                GetVendorProducts(),
                GetAllCategories(),
                GetUserBrands()
            ]);

            if (productsRes.success) setProducts(productsRes.data?.docs || productsRes.data || []);
            if (categoriesRes.success) setCategories(categoriesRes.data || []);
            // Only show approved brands
            if (brandsRes.success) {
                setBrands((brandsRes.data || []).filter((b: any) => b.is_approved));
            }
        } catch (error: any) {
            showToast(error.message || "Failed to load data", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProduct.category_id || !newProduct.brand_id) {
            return showToast("Category and Brand are required", "error");
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            Object.entries(newProduct).forEach(([key, value]) => {
                formData.append(key, value);
            });

            if (newProductImages) {
                Array.from(newProductImages).forEach(file => {
                    formData.append("images", file);
                });
            }

            const res = await AddProduct(formData, true);
            if (res.success) {
                showToast("Product added successfully", "success");
                setIsAddModalOpen(false);
                setNewProduct({
                    name: "", desc: "", price: "", discount_price: "0",
                    sku: "", stock_quantity: "0", category_id: "", brand_id: ""
                });
                setNewProductImages(null);
                fetchData();
            }
        } catch (error: any) {
            showToast(error.message || "Failed to add product", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            // Using generic UpdateProduct service or a toggle specific one if exists
            // Since we only have AddProduct and GetVendorProducts in product.service.ts
            // Let's check product.service.ts for update/toggle
            const res = await UpdateProduct(id, { is_active: !currentStatus });
            if (res.success) {
                showToast(`Product ${!currentStatus ? 'activated' : 'deactivated'} successfully`, "success");
                fetchData();
            }
        } catch (error: any) {
            showToast(error.message || "Failed to update status", "error");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            const res = await DeleteProduct(id);
            if (res.success) {
                showToast("Product deleted successfully", "success");
                fetchData();
            }
        } catch (error: any) {
            showToast(error.message || "Failed to delete product", "error");
        }
    };

    const productColumns: TableColumn<any>[] = [
        {
            header: "Product",
            accessorKey: "name",
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden shrink-0">
                        <img src={row.images_id?.[0]?.image_url || "/placeholder-prod.png"} alt={row.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="font-bold text-secondary text-sm line-clamp-1">{row.name}</p>
                        <p className="text-secondary/50 text-[10px] uppercase font-black tracking-widest">{row.sku}</p>
                    </div>
                </div>
            )
        },
        {
            header: "Category",
            accessorKey: "category",
            cell: (row) => <span className="text-xs font-bold text-secondary/70">{row.category_id?.name || "Uncategorized"}</span>
        },
        {
            header: "Price",
            accessorKey: "price",
            cell: (row) => <span className="font-bold text-primary">${row.price}</span>
        },
        {
            header: "Stock",
            accessorKey: "stock_quantity",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <div className="w-full max-w-[60px] h-1.5 bg-gray-100 rounded-full overflow-hidden shrink-0">
                        <div
                            className={`h-full rounded-full ${row.stock_quantity < 20 ? 'bg-red-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min(row.stock_quantity, 100)}%` }}
                        ></div>
                    </div>
                    <span className={`text-xs font-bold ${row.stock_quantity < 20 ? 'text-red-500' : 'text-secondary/70'}`}>{row.stock_quantity}</span>
                </div>
            )
        },
        {
            header: "Status",
            accessorKey: "is_active",
            cell: (row) => (
                <button 
                    onClick={() => handleToggleStatus(row._id, row.is_active)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider transition-all hover:scale-105 ${row.is_active ? "bg-green-50 text-green-600 border border-green-100" : "bg-gray-50 text-gray-500 border border-gray-100"
                    }`}>
                    {row.is_active ? "Active" : "Inactive"}
                </button>
            )
        },
        {
            header: "Actions",
            accessorKey: "_id",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-primary transition-colors">
                        <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-blue-500 transition-colors">
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => handleDelete(row._id)}
                        className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans text-secondary pb-20 relative">
            {toast.show && <Toast type={toast.type} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />}
            {loading && (
                <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

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
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3.5 bg-secondary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary/90 shadow-xl shadow-secondary/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
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
                        data={products}
                        title="Available Products"
                    />
                </div>
            </div>

            {/* ADD PRODUCT MODAL */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-secondary tracking-tight">Add New Product</h2>
                                <p className="text-xs font-medium text-secondary/60 mt-1">Create a new product listing in your store.</p>
                            </div>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleAddProduct} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4 md:col-span-2">
                                    <label className="block text-xs font-black uppercase tracking-widest text-secondary/70 mb-1">
                                        Product Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:border-primary outline-none transition-all"
                                        placeholder="e.g. Wireless Noise Cancelling Headphones"
                                        required
                                    />
                                </div>

                                <div className="space-y-4 md:col-span-2">
                                    <label className="block text-xs font-black uppercase tracking-widest text-secondary/70 mb-1">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={newProduct.desc}
                                        onChange={(e) => setNewProduct({ ...newProduct, desc: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:border-primary outline-none transition-all min-h-[100px]"
                                        placeholder="Detailed explanation of the product..."
                                        required
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-xs font-black uppercase tracking-widest text-secondary/70 mb-1">
                                        SKU <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={newProduct.sku}
                                        onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:border-primary outline-none transition-all"
                                        placeholder="e.g. HEAD-WNC-01"
                                        required
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-xs font-black uppercase tracking-widest text-secondary/70 mb-1">
                                        Stock Quantity <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={newProduct.stock_quantity}
                                        onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:border-primary outline-none transition-all"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-xs font-black uppercase tracking-widest text-secondary/70 mb-1">
                                        Price ($) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:border-primary outline-none transition-all"
                                        min="0"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-xs font-black uppercase tracking-widest text-secondary/70 mb-1">
                                        Discount Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={newProduct.discount_price}
                                        onChange={(e) => setNewProduct({ ...newProduct, discount_price: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:border-primary outline-none transition-all"
                                        min="0"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-xs font-black uppercase tracking-widest text-secondary/70 mb-1">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={newProduct.category_id}
                                        onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:border-primary outline-none transition-all"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(c => (
                                            <option key={c._id} value={c._id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-xs font-black uppercase tracking-widest text-secondary/70 mb-1">
                                        Brand <span className="text-red-500">*</span>
                                    </label>
                                    {brands.length === 0 ? (
                                        <div className="px-4 py-3 bg-yellow-50 text-yellow-600 rounded-xl text-xs font-bold border border-yellow-100">
                                            You need an approved brand before creating products. Request one in the "My Brands" tab.
                                        </div>
                                    ) : (
                                        <select
                                            value={newProduct.brand_id}
                                            onChange={(e) => setNewProduct({ ...newProduct, brand_id: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:border-primary outline-none transition-all"
                                            required
                                        >
                                            <option value="">Select Brand</option>
                                            {brands.map(b => (
                                                <option key={b._id} value={b._id}>{b.name}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                <div className="space-y-4 md:col-span-2">
                                    <label className="block text-xs font-black uppercase tracking-widest text-secondary/70 mb-1">
                                        Product Images
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => setNewProductImages(e.target.files)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                                    />
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-2 block">
                                        Select up to 5 images. First image will be the primary cover.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-8 mt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-secondary rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || brands.length === 0}
                                    className="flex-1 py-3.5 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                >
                                    {submitting ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        "Create Product"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerProducts;
