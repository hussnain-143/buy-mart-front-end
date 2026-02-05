import { useState } from 'react';
import AdminTable, { TableColumn } from '../../components/admin/AdminTable';
import { Check, X, Clock } from 'lucide-react';

interface BrandRequest {
    id: string;
    brandName: string;
    ownerName: string;
    email: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    requestDate: string;
    logo: string;
}

const AdminBrandRequests = () => {
    const [activeTab, setActiveTab] = useState<'Pending' | 'Approved' | 'Rejected' | 'All'>('Pending');

    // Mock data
    const requests: BrandRequest[] = [
        { id: '1', brandName: 'TechGizmos', ownerName: 'John Doe', email: 'john@techgizmos.com', status: 'Pending', requestDate: '2023-10-25', logo: 'https://ui-avatars.com/api/?name=Tech+Gizmos&background=random' },
        { id: '2', brandName: 'Fashionista', ownerName: 'Jane Smith', email: 'jane@fashionista.com', status: 'Approved', requestDate: '2023-10-24', logo: 'https://ui-avatars.com/api/?name=Fashionista&background=random' },
        { id: '3', brandName: 'GreenEarth', ownerName: 'Bob Brown', email: 'bob@greenearth.com', status: 'Rejected', requestDate: '2023-10-23', logo: 'https://ui-avatars.com/api/?name=Green+Earth&background=random' },
    ];

    const filteredData = activeTab === 'All' ? requests : requests.filter(r => r.status === activeTab);

    const columns: TableColumn<BrandRequest>[] = [
        {
            header: 'Brand',
            accessorKey: 'brandName',
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <img src={row.logo} alt={row.brandName} className="w-10 h-10 rounded-lg object-cover shadow-sm" />
                    <div>
                        <div className="font-bold text-gray-800">{row.brandName}</div>
                        <div className="text-xs text-gray-500">{row.ownerName}</div>
                    </div>
                </div>
            ),
        },
        {
            header: 'Contact',
            accessorKey: 'email',
            cell: (row) => <span className="text-gray-600">{row.email}</span>,
        },
        {
            header: 'Date',
            accessorKey: 'requestDate',
            cell: (row) => <span className="text-gray-500 text-sm font-medium">{row.requestDate}</span>,
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (row) => {
                let colorClass = "";
                let Icon = null;

                switch (row.status) {
                    case 'Approved':
                        colorClass = 'bg-green-500/10 text-green-600';
                        Icon = Check;
                        break;
                    case 'Rejected':
                        colorClass = 'bg-red-500/10 text-red-600';
                        Icon = X;
                        break;
                    default:
                        colorClass = 'bg-yellow-500/10 text-yellow-600';
                        Icon = Clock;
                }

                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit ${colorClass}`}>
                        <Icon size={12} strokeWidth={3} /> {row.status}
                    </span>
                )
            },
        },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: (row) => (
                <div className="flex items-center gap-2">
                    {row.status === 'Pending' && (
                        <>
                            <button className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-all shadow-md shadow-green-500/20">
                                Approve
                            </button>
                            <button className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-all shadow-md shadow-red-500/20">
                                Reject
                            </button>
                        </>
                    )}
                    {row.status !== 'Pending' && <span className="text-gray-400 text-xs italic">No actions</span>}
                </div>
            )
        }
    ];

    const tabs = ['Pending', 'Approved', 'Rejected', 'All'] as const;

    return (
        <div className="space-y-8">
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

            <div className="h-[600px]">
                <AdminTable
                    data={filteredData}
                    columns={columns}
                    title={`${activeTab} Requests`}
                    subtitle={`Showing ${filteredData.length} ${activeTab.toLowerCase()} requests`}
                />
            </div>
        </div>
    );
};

export default AdminBrandRequests;
