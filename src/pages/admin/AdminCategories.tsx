import { useEffect, useState } from 'react';
import AdminTable, { TableColumn } from '../../components/admin/AdminTable';
import { Tag, Edit, Trash2, X } from 'lucide-react';
import { GetAdminCategories, DeleteCategory, AddCategory, UpdateCategory } from '../../services/category.service';
import Toast from '../../components/common/Toast';

const AdminCategories = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, type: "info", message: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', isActive: true });

    const showToast = (message: string, type = "info", duration = 3000) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type }), duration);
    };

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await GetAdminCategories();
            setCategories(res.data || []);
        } catch (error: any) {
            showToast(error.message || "Failed to load categories", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const openAddModal = () => {
        setFormData({ name: '', isActive: true });
        setIsEditing(false);
        setEditId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (category: any) => {
        setFormData({ name: category.name, isActive: category.isActive !== false });
        setIsEditing(true);
        setEditId(category._id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', isActive: true });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return showToast("Category name is required", "error");

        try {
            if (isEditing && editId) {
                await UpdateCategory(editId, formData);
                showToast("Category updated successfully", "success");
            } else {
                await AddCategory(formData);
                showToast("Category added successfully", "success");
            }
            closeModal();
            fetchCategories();
        } catch (error: any) {
            showToast(error.message || `Failed to ${isEditing ? 'update' : 'add'} category`, "error");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await DeleteCategory(id);
            showToast("Category deleted successfully", "success");
            fetchCategories();
        } catch (error: any) {
            showToast(error.message || "Failed to delete category", "error");
        }
    };

    const columns: TableColumn<any>[] = [
        {
            header: 'Category Name',
            accessorKey: 'name',
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <Tag size={18} />
                    </div>
                    <span className="font-bold text-gray-700">{row.name}</span>
                </div>
            ),
        },
        {
            header: 'Status',
            accessorKey: 'isActive',
            cell: (row) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${row.isActive !== false
                        ? 'bg-green-500/10 text-green-600'
                        : 'bg-red-500/10 text-red-600'
                        }`}
                >
                    {row.isActive !== false ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            header: 'Actions',
            accessorKey: '_id',
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => openEditModal(row)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => handleDelete(row._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    >
                        <Trash2 size={16} />
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
                        Categories
                    </h1>
                    <p className="text-gray-500 mt-1">Manage your product categories</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                    + Add Category
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <AdminTable
                    data={categories}
                    columns={columns}
                    title="All Categories"
                    subtitle="View and manage categories"
                />
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-black text-gray-800">
                                {isEditing ? 'Edit Category' : 'Add New Category'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full transition-all shadow-sm"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Category Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                                    placeholder="e.g. Electronics"
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                </label>
                                <span className="text-sm font-bold text-gray-700">Active Status</span>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    {isEditing ? 'Save Changes' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
