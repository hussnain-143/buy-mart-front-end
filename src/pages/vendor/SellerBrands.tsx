import React, { useEffect, useState } from "react";
import { Plus, Check, Clock, Edit2, Trash2 } from "lucide-react";
import AdminTable, { TableColumn } from "../../components/admin/AdminTable";
import { GetUserBrands, AddBrand } from "../../services/brand.service";
import Toast from "../../components/common/Toast";

const SellerBrands: React.FC = () => {
    const [brands, setBrands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: "", type: "info" });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newBrandName, setNewBrandName] = useState("");
    const [newBrandImage, setNewBrandImage] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const showToast = (message: string, type = "info") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type }), 3000);
    };

    const fetchBrands = async () => {
        setLoading(true);
        try {
            const res = await GetUserBrands();
            if (res.success) {
                setBrands(res.data || []);
            }
        } catch (error: any) {
            showToast(error.message || "Failed to load brands", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleAddBrand = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBrandName.trim()) {
            return showToast("Brand name is required", "error");
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("name", newBrandName);
            if (newBrandImage) {
                formData.append("logo", newBrandImage);
            }

            const res = await AddBrand(formData);
            if (res.success) {
                showToast("Brand submitted for approval", "success");
                setIsAddModalOpen(false);
                setNewBrandName("");
                setNewBrandImage(null);
                fetchBrands();
            }
        } catch (error: any) {
            showToast(error.message || "Failed to submit brand", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const brandColumns: TableColumn<any>[] = [
        {
            header: "Brand",
            accessorKey: "name",
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden">
                        <img
                            src={row.logo || `https://ui-avatars.com/api/?name=${row.name}&background=random`}
                            alt={row.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="font-bold text-secondary text-sm">{row.name}</p>
                    </div>
                </div>
            )
        },
        {
            header: "Status",
            accessorKey: "is_approved",
            cell: (row) => {
                const status = row.is_approved ? 'Approved' : 'Pending Review';
                const colorClass = row.is_approved ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-yellow-50 text-yellow-600 border border-yellow-100';
                const Icon = row.is_approved ? Check : Clock;

                return (
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 w-fit ${colorClass}`}>
                        <Icon size={12} strokeWidth={3} /> {status}
                    </span>
                )
            }
        },
        {
            header: "Date Added",
            accessorKey: "createdAt",
            cell: (row) => <span className="text-secondary/70 text-sm">{new Date(row.createdAt).toLocaleDateString()}</span>
        },
        {
            header: "Actions",
            accessorKey: "_id",
            cell: () => (
                <div className="flex items-center gap-2">
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

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans text-secondary pb-20">
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
                            <Plus className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-secondary tracking-tight">My Brands</h1>
                            <p className="text-sm font-medium text-secondary/70">Manage brands associated with your store</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3.5 bg-secondary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary/90 shadow-xl shadow-secondary/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <Plus className="w-4 h-4" />
                        Request Brand
                    </button>
                </div>

                {/* TABLE CARD */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <AdminTable
                        columns={brandColumns}
                        data={brands}
                        title="Your Brands"
                        subtitle="Brands are verified by admins before you can add products under them."
                    />
                </div>
            </div>

            {/* ADD BRAND MODAL */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-secondary">Request New Brand</h2>
                            <p className="text-xs text-secondary/60 mt-1">Submit a brand to sell on the platform.</p>
                        </div>

                        <form onSubmit={handleAddBrand} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-secondary/70 mb-2">
                                    Brand Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newBrandName}
                                    onChange={(e) => setNewBrandName(e.target.value)}
                                    placeholder="Enter brand name"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-secondary/70 mb-2">
                                    Brand Logo (Optional)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setNewBrandImage(e.target.files[0]);
                                        }
                                    }}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                                />
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-secondary rounded-xl text-xs font-bold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        "Submit Request"
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

export default SellerBrands;
