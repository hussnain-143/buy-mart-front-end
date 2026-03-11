import { useEffect, useState } from 'react';
import AdminTable, { TableColumn } from '../../components/admin/AdminTable';
import { Mail, Phone, MoreHorizontal } from 'lucide-react';
import { GetAllUsers } from '../../services/auth.service';
import Toast from '../../components/common/Toast';

const AdminUsers = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, type: "info", message: "" });

    const showToast = (message: string, type = "info", duration = 3000) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type }), duration);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const res = await GetAllUsers();
                setUsers(res.data?.users || res.data || []);
            } catch (error: any) {
                showToast(error.message || "Failed to load users", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        if (!window.confirm(`Are you sure you want to ${currentStatus !== false ? 'block' : 'activate'} this user?`)) return;
        try {
            const { ToggleUserStatus } = await import('../../services/auth.service');
            await ToggleUserStatus(id);
            showToast(`User ${currentStatus !== false ? 'blocked' : 'activated'} successfully`, "success");
            const res = await GetAllUsers();
            setUsers(res.data?.users || res.data || []);
        } catch (error: any) {
            showToast(error.message || "Failed to update user status", "error");
        }
    };

    const columns: TableColumn<any>[] = [
        {
            header: 'User',
            accessorKey: 'userName',
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <img
                        src={row.profileUrl || `https://ui-avatars.com/api/?name=${row.firstName}+${row.lastName}&background=random`}
                        alt={row.userName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                        <div className="font-bold text-gray-800">{row.firstName} {row.lastName}</div>
                        <div className="text-xs text-gray-400">@{row.userName}</div>
                    </div>
                </div>
            ),
        },
        {
            header: 'Contact Info',
            accessorKey: 'email',
            cell: (row) => (
                <div className='flex flex-col gap-1'>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Mail size={12} /> {row.email}
                    </div>
                    {row.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Phone size={12} /> {row.phone}
                        </div>
                    )}
                </div>
            )
        },
        {
            header: 'Role',
            accessorKey: 'role',
            cell: (row) => (
                <span className={`
            px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
            ${row.role === 'admin' ? 'bg-purple-500/10 text-purple-600' :
                        row.role === 'vendor' ? 'bg-blue-500/10 text-blue-600' : 'bg-gray-100 text-gray-600'}
        `}>
                    {row.role}
                </span>
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
                    {row.isActive !== false ? 'Active' : 'Blocked'}
                </span>
            ),
        },
        {
            header: 'Actions',
            accessorKey: '_id',
            cell: (row) => (
                <button
                    onClick={() => handleToggleStatus(row._id, row.isActive)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md ${row.isActive !== false
                        ? 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 shadow-red-500/10'
                        : 'bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 shadow-green-500/10'
                        }`}
                >
                    {row.isActive !== false ? 'Block User' : 'Activate User'}
                </button>
            ),
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
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast({ show: false, message: "", type: "info" })}
                />
            )}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">
                        Users
                    </h1>
                    <p className="text-gray-500 mt-1">Manage platform users, vendors, and admins</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <AdminTable
                    data={users}
                    columns={columns}
                    title="All Users"
                    subtitle="Search and manage user accounts"
                />
            </div>
        </div>
    );
};

export default AdminUsers;
