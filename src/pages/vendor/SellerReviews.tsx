import React, { useEffect, useState } from "react";
import { Star, MessageSquare, ThumbsUp, Package } from "lucide-react";
import { GetVendorReviews } from "../../services/review.service";
import Toast from "../../components/common/Toast";

const SellerReviews: React.FC = () => {
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
            const res = await GetVendorReviews();
            if (res.success) {
                setReviews(res.data || []);
            }
        } catch (error: any) {
            showToast(error.message || "Failed to load reviews", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const stats = [
        { 
            label: "Average Rating", 
            value: reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0.0", 
            icon: Star, 
            color: "text-amber-500" 
        },
        { label: "Total Reviews", value: reviews.length.toString(), icon: MessageSquare, color: "text-blue-500" },
        { 
            label: "Satisfaction Rate", 
            value: reviews.length > 0 ? `${Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100)}%` : "0%", 
            icon: ThumbsUp, 
            color: "text-green-500" 
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans text-secondary pb-20">
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
            <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-8 space-y-8">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                            <MessageSquare className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-secondary tracking-tight">Customer Feedback</h1>
                            <p className="text-sm font-medium text-secondary/70">What customers are saying about your products</p>
                        </div>
                    </div>
                </div>

                {/* STATS STRIP */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 translate-y-0 hover:-translate-y-1 transition-all duration-300">
                            <div className={`p-4 bg-gray-50 rounded-2xl ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xs font-black text-secondary/40 uppercase tracking-widest">{stat.label}</h3>
                                <div className="text-2xl font-black text-secondary mt-1">{stat.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* REVIEWS LIST */}
                <div className="grid grid-cols-1 gap-6">
                    {reviews.map((review) => (
                        <div key={review._id} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md group">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-orange-500/20">
                                                {review.user_id?.firstName?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-secondary text-sm">{review.user_id?.firstName} {review.user_id?.lastName}</h4>
                                                <div className="flex items-center gap-1 mt-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                                                    ))}
                                                    <span className="text-[10px] text-secondary/40 font-bold ml-2 uppercase tracking-tight">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-secondary/70 text-sm leading-relaxed font-medium">
                                        "{review.comment}"
                                    </p>
                                </div>
                                <div className="w-full md:w-64 flex-shrink-0">
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Package className="w-4 h-4 text-primary" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-secondary/60">Related Product</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gray-200 overflow-hidden shrink-0">
                                                <img src={review.product_id?.images_id?.[0]?.image_url || "/placeholder-prod.png"} alt={review.product_id?.name} className="w-full h-full object-cover shadow-sm" />
                                            </div>
                                            <p className="flex-1 text-[11px] font-bold text-secondary leading-tight line-clamp-2">
                                                {review.product_id?.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {reviews.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 text-secondary/40 font-bold uppercase tracking-widest text-sm">
                            No reviews found for your products.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerReviews;
