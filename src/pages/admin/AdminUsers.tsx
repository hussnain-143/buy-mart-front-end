
import AdminTable, { TableColumn } from '../../components/admin/AdminTable';
import { Mail, Phone, MoreHorizontal } from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'Customer' | 'Vendor' | 'Admin';
    status: 'Active' | 'Blocked';
    avatar: string;
    joinDate: string;
}

const AdminUsers = () => {
    // Mock data
    const users: User[] = [
        { id: '1', name: 'Alice Johnson', email: 'alice@example.com', phone: '+1 234 567 890', role: 'Customer', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=random', joinDate: '2023-01-15' },
        { id: '2', name: 'Bob Smith', email: 'bob@store.com', phone: '+1 987 654 321', role: 'Vendor', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Bob+Smith&background=random', joinDate: '2023-02-20' },
        { id: '3', name: 'Charlie Admin', email: 'admin@buymart.com', phone: '+1 555 555 555', role: 'Admin', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Charlie+Admin&background=random', joinDate: '2022-12-01' },
        { id: '4', name: 'David Lee', email: 'david@badactor.com', phone: '+1 666 666 666', role: 'Customer', status: 'Blocked', avatar: 'https://ui-avatars.com/api/?name=David+Lee&background=random', joinDate: '2023-05-10' },
    ];

    const columns: TableColumn<User>[] = [
        {
            header: 'User',
            accessorKey: 'name',
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <img src={row.avatar} alt={row.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                    <div>
                        <div className="font-bold text-gray-800">{row.name}</div>
                        <div className="text-xs text-gray-400">Joined {row.joinDate}</div>
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
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Phone size={12} /> {row.phone}
                    </div>
                </div>
            )
        },
        {
            header: 'Role',
            accessorKey: 'role',
            cell: (row) => (
                <span className={`
            px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
            ${row.role === 'Admin' ? 'bg-purple-500/10 text-purple-600' :
                        row.role === 'Vendor' ? 'bg-blue-500/10 text-blue-600' : 'bg-gray-100 text-gray-600'}
        `}>
                    {row.role}
                </span>
            ),
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
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                    <MoreHorizontal size={18} />
                </button>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">
                        Users
                    </h1>
                    <p className="text-gray-500 mt-1">Manage platform users, vendors, and admins</p>
                </div>
            </div>

            <div className="h-[600px]">
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
