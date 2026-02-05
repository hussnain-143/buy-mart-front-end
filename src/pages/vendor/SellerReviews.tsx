import React from "react";
import { Star, MessageSquare, ThumbsUp, Package, ArrowRight } from "lucide-react";

const SellerReviews: React.FC = () => {
    const reviews = [
        {
            id: 1,
            user: "Alex Johnson",
            product: "Premium Wireless Headset",
            rating: 5,
            comment: "Absolutely incredible sound quality! The battery life is much better than expected. Highly recommend this seller for electronics.",
            date: "2 days ago",
            helpful: 24,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop"
        },
        {
            id: 2,
            user: "Emma White",
            product: "Ergonomic Mechanical Keyboard",
            rating: 4,
            comment: "The keys feel great, and the lighting is customizable. Shipping took a day longer than expected, but the product is top notch.",
            date: "1 week ago",
            helpful: 12,
            image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=100&h=100&fit=crop"
        },
        {
            id: 3,
            user: "Mike Ross",
            product: "Leather Messenger Bag",
            rating: 5,
            comment: "Excellent craftsmanship. The leather is premium and smells great. Fits my laptop perfectly.",
            date: "Oct 20, 2026",
            helpful: 8,
            image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop"
        }
    ];

    const stats = [
        { label: "Average Rating", value: "4.8", icon: Star, color: "text-amber-500" },
        { label: "Total Reviews", value: "1,248", icon: MessageSquare, color: "text-blue-500" },
        { label: "Satisfaction Rate", value: "96%", icon: ThumbsUp, color: "text-green-500" },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans text-secondary pb-20">
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
                        <div key={review.id} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md group">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-orange-500/20">
                                                {review.user.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-secondary text-sm">{review.user}</h4>
                                                <div className="flex items-center gap-1 mt-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                                                    ))}
                                                    <span className="text-[10px] text-secondary/40 font-bold ml-2 uppercase tracking-tight">{review.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-600 rounded-lg">
                                                <ThumbsUp className="w-3 h-3" />
                                                <span className="text-[10px] font-bold">VERIFIED PURCHASE</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-secondary/70 text-sm leading-relaxed font-medium">
                                        "{review.comment}"
                                    </p>
                                    <div className="flex flex-wrap items-center gap-4 pt-2">
                                        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary/40 hover:text-primary transition-colors">
                                            <ThumbsUp className="w-3.5 h-3.5" />
                                            Helpful ({review.helpful})
                                        </button>
                                        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary/40 hover:text-blue-500 transition-colors">
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            Reply to Customer
                                        </button>
                                    </div>
                                </div>
                                <div className="w-full md:w-64 flex-shrink-0">
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Package className="w-4 h-4 text-primary" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-secondary/60">Related Product</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <img src={review.image} alt={review.product} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                                            <p className="flex-1 text-[11px] font-bold text-secondary leading-tight line-clamp-2">
                                                {review.product}
                                            </p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 ml-auto mt-4 text-secondary/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* LOAD MORE */}
                <div className="text-center pt-8">
                    <button className="px-10 py-4 border-2 border-dashed border-gray-200 text-gray-400 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:border-primary/50 hover:text-primary transition-all active:scale-95">
                        Load More Feed
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SellerReviews;
