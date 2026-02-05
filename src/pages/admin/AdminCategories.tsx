
import AdminTable, { TableColumn } from '../../components/admin/AdminTable';
import { Tag, Edit, Trash2 } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    productsCount: number;
    status: 'Active' | 'Inactive';
}

const AdminCategories = () => {
    // Mock data
    const categories: Category[] = [
        { id: '1', name: 'Electronics', productsCount: 120, status: 'Active' },
        { id: '2', name: 'Fashion', productsCount: 350, status: 'Active' },
        { id: '3', name: 'Home & Garden', productsCount: 85, status: 'Inactive' },
        { id: '4', name: 'Sports', productsCount: 45, status: 'Active' },
    ];

    const columns: TableColumn<Category>[] = [
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
            header: 'Products',
            accessorKey: 'productsCount',
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (row) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${row.status === 'Active'
                        ? 'bg-green-500/10 text-green-600'
                        : 'bg-red-500/10 text-red-600'
                        }`}
                >
                    {row.status}
                </span>
            ),
        },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: () => (
                <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all">
                        <Edit size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">
                        Categories
                    </h1>
                    <p className="text-gray-500 mt-1">Manage your product categories</p>
                </div>
                <button className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0">
                    + Add Category
                </button>
            </div>

            <div className="h-[600px]">
                <AdminTable
                    data={categories}
                    columns={columns}
                    title="All Categories"
                    subtitle="View and manage categories"
                />
            </div>
        </div>
    );
};

export default AdminCategories;
