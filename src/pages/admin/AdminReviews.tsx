
import AdminTable, { TableColumn } from '../../components/admin/AdminTable';
import { Star, MessageSquare } from 'lucide-react';

interface Review {
    id: string;
    productName: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
    status: 'Published' | 'Pending' | 'Flagged';
}

const AdminReviews = () => {
    // Mock data
    const reviews: Review[] = [
        { id: '1', productName: 'Wireless Headphones', userName: 'John Doe', rating: 5, comment: 'Amazing sound quality! Highly recommended.', date: '2023-10-20', status: 'Published' },
        { id: '2', productName: 'Leather Jacket', userName: 'Jane Smith', rating: 4, comment: 'Great quality but a bit tight.', date: '2023-10-21', status: 'Published' },
        { id: '3', productName: 'Smart Watch', userName: 'Bob Brown', rating: 2, comment: 'Battery life is terrible.', date: '2023-10-22', status: 'Flagged' },
    ];

    const columns: TableColumn<Review>[] = [
        {
            header: 'Product',
            accessorKey: 'productName',
            cell: (row) => <span className="font-bold text-gray-800">{row.productName}</span>,
        },
        {
            header: 'Reviewer',
            accessorKey: 'userName',
            cell: (row) => <span className="text-gray-600">{row.userName}</span>,
        },
        {
            header: 'Rating',
            accessorKey: 'rating',
            cell: (row) => (
                <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            size={14}
                            className={i < row.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}
                        />
                    ))}
                </div>
            ),
        },
        {
            header: 'Comment',
            accessorKey: 'comment',
            cell: (row) => (
                <div className="flex gap-2 max-w-xs">
                    <MessageSquare size={14} className="text-gray-400 flex-shrink-0 mt-1" />
                    <p className="text-sm text-gray-600 truncate">{row.comment}</p>
                </div>
            ),
        },
        {
            header: 'Date',
            accessorKey: 'date',
            cell: (row) => <span className="text-xs text-gray-400">{row.date}</span>,
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (row) => {
                let colorClass = "";
                switch (row.status) {
                    case 'Published': colorClass = 'bg-green-500/10 text-green-600'; break;
                    case 'Flagged': colorClass = 'bg-red-500/10 text-red-600'; break;
                    default: colorClass = 'bg-yellow-500/10 text-yellow-600';
                }
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colorClass}`}>
                        {row.status}
                    </span>
                );
            },
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">
                        Reviews
                    </h1>
                    <p className="text-gray-500 mt-1">Moderate customer reviews and ratings</p>
                </div>
            </div>

            <div className="h-[600px]">
                <AdminTable
                    data={reviews}
                    columns={columns}
                    title="Customer Reviews"
                    subtitle="Latest feedback"
                />
            </div>
        </div>
    );
};

export default AdminReviews;
