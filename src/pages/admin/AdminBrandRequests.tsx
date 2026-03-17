import { useEffect, useState } from 'react';
import AdminTable, { TableColumn } from '../../components/admin/AdminTable';
import { Check, Clock } from 'lucide-react';
import { GetAdminBrands, ApproveBrand } from '../../services/brand.service';
import Toast from '../../components/common/Toast';

const AdminBrandRequests = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, type: "info", message: "" });
    const [activeTab, setActiveTab] = useState<'Pending' | 'Approved' | 'Rejected' | 'All'>('Pending');

    const showToast = (message: string, type = "info", duration = 3000) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type }), duration);
    };

    const fetchBrands = async () => {
        setLoading(true);
        try {
            const res = await GetAdminBrands();
            setRequests(res.data || []);
        } catch (error: any) {
            showToast(error.message || "Failed to load brand requests", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleApprove = async (id: string) => {
        try {
            await ApproveBrand(id);
            showToast("Brand approved successfully", "success");
            fetchBrands();
        } catch (error: any) {
            showToast(error.message || "Failed to approve brand", "error");
        }
    };

    const handleReject = async (id: string) => {
        if (!window.confirm("Are you sure you want to reject and delete this brand request?")) return;
        try {
            const { DeleteBrand } = await import('../../services/brand.service');
            await DeleteBrand(id);
            showToast("Brand request rejected and deleted", "success");
            fetchBrands();
        } catch (error: any) {
            showToast(error.message || "Failed to reject brand", "error");
        }
    };

    const filteredData = requests.filter(r => {
        const status = r.is_approved ? 'Approved' : 'Pending';
        if (activeTab === 'All') return true;
        return status === activeTab;
    });

    const columns: TableColumn<any>[] = [
        {
            header: 'Brand',
            accessorKey: 'name',
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <img
                        src={row.logo || `https://ui-avatars.com/api/?name=${row.name}&background=random`}
                        alt={row.name}
                        className="w-10 h-10 rounded-lg object-cover shadow-sm"
                    />
                    <div>
                        <div className="font-bold text-gray-800">{row.name}</div>
                        <div className="text-xs text-gray-500">{row.user_id?.firstName} {row.user_id?.lastName}</div>
                    </div>
                </div>
            ),
        },
        {
            header: 'Contact',
            accessorKey: 'user_id',
            cell: (row) => <span className="text-gray-600">{row.user_id?.email}</span>,
        },
        {
            header: 'Date',
            accessorKey: 'createdAt',
            cell: (row) => <span className="text-gray-500 text-sm font-medium">{new Date(row.createdAt).toLocaleDateString()}</span>,
        },
        {
            header: 'Status',
            accessorKey: 'is_approved',
            cell: (row) => {
                const status = row.is_approved ? 'Approved' : 'Pending';
                let colorClass = "";
                let Icon = null;

                switch (status) {
                    case 'Approved':
                        colorClass = 'bg-green-500/10 text-green-600';
                        Icon = Check;
                        break;
                    default:
                        colorClass = 'bg-yellow-500/10 text-yellow-600';
                        Icon = Clock;
                }

                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit ${colorClass}`}>
                        {Icon && <Icon size={12} strokeWidth={3} />} {status}
                    </span>
                )
            },
        },
        {
            header: 'Actions',
            accessorKey: '_id',
            cell: (row) => (
                <div className="flex items-center gap-2">
                    {!row.is_approved && (
                        <>
                            <button
                                onClick={() => handleApprove(row._id)}
                                className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-all shadow-md shadow-green-500/20"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleReject(row._id)}
                                className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-all shadow-md shadow-red-500/20"
                            >
                                Reject
                            </button>
                        </>
                    )}
                    {row.is_approved && <span className="text-gray-400 text-xs italic">Approved</span>}
                </div>
            )
        }
    ];

    const tabs = ['Pending', 'Approved', 'All'] as const;

    return (
        <div className="space-y-8">
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
            <div>
                <h1 className="text-3xl font-black text-gray-800 tracking-tight">
                    Brand Requests
                </h1>
                <p className="text-gray-500 mt-1">Review and manage vendor brand approval requests</p>
            </div>

            {/* Custom Tabs */}
            <div className="flex gap-2 p-1 bg-white rounded-xl w-fit shadow-sm border border-gray-100">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
                        px-6 py-2 rounded-lg text-sm font-bold transition-all
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

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <AdminTable
                    data={filteredData}
                    columns={columns}
                    title={`${activeTab} Requests`}
                    subtitle={`Showing ${filteredData.length} records`}
                />
            </div>
        </div>
    );
};

export default AdminBrandRequests;
