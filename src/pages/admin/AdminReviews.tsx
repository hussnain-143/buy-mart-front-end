import { useEffect, useState } from 'react';
import AdminTable, { TableColumn } from '../../components/admin/AdminTable';
import { Star, MessageSquare } from 'lucide-react';
import { GetAllReviews, DeleteReview } from '../../services/review.service';
import Toast from '../../components/common/Toast';

const AdminReviews = () => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, type: "info", message: "" });

    const showToast = (message: string, type = "info", duration = 3000) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type }), duration);
    };

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await GetAllReviews();
            setReviews(res.data || []);
        } catch (error: any) {
            showToast(error.message || "Failed to load reviews", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        try {
            await DeleteReview(id);
            showToast("Review deleted successfully", "success");
            fetchReviews();
        } catch (error: any) {
            showToast(error.message || "Failed to delete review", "error");
        }
    };

    const columns: TableColumn<any>[] = [
        {
            header: 'Product',
            accessorKey: 'product_id',
            cell: (row) => <span className="font-bold text-gray-800">{row.product_id?.name || 'N/A'}</span>,
        },
        {
            header: 'Reviewer',
            accessorKey: 'user_id',
            cell: (row) => <span className="text-gray-600">{row.user_id?.firstName} {row.user_id?.lastName}</span>,
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
            accessorKey: 'createdAt',
            cell: (row) => <span className="text-xs text-gray-400">{new Date(row.createdAt).toLocaleDateString()}</span>,
        },
        {
            header: 'Actions',
            accessorKey: '_id',
            cell: (row) => (
                <button
                    onClick={() => handleDelete(row._id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                >
                    Delete
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
                        Reviews
                    </h1>
                    <p className="text-gray-500 mt-1">Moderate customer reviews and ratings</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
