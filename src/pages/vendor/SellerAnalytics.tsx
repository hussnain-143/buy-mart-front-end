import React from "react";
import { BarChart3, TrendingUp, Users, ShoppingCart, DollarSign, Calendar, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { RevenueTrendChart, CategoryDistributionChart, OrderTrendsChart } from "../../components/admin/AnalyticsCharts";

const SellerAnalytics: React.FC = () => {
    const mainStats = [
        { label: "Total Profit", value: "$12,842", sub: "+$420 today", trend: "up", icon: DollarSign, color: "text-green-500" },
        { label: "Store Visitors", value: "48.2k", sub: "1.2k unique", trend: "up", icon: Users, color: "text-blue-500" },
        { label: "Conversion Rate", value: "2.4%", sub: "-0.5% vs last week", trend: "down", icon: TrendingUp, color: "text-amber-500" },
        { label: "Avg. Order Value", value: "$85.20", sub: "+$2.10 average", trend: "up", icon: ShoppingCart, color: "text-primary" },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans text-secondary pb-20">
            <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-8 space-y-8">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                            <BarChart3 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-secondary tracking-tight">Intelligence & Analytics</h1>
                            <p className="text-sm font-medium text-secondary/70">Deep dive into your store's performance metrics</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-5 py-3 bg-white border border-gray-200 text-[10px] font-black uppercase tracking-widest text-secondary/60 rounded-xl hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" />
                            Last 30 Days
                        </button>
                    </div>
                </div>

                {/* KPI STRIP */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {mainStats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                <stat.icon className={`w-20 h-20 ${stat.color}`} />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-xs font-black text-secondary/30 uppercase tracking-[0.2em] mb-3">{stat.label}</h3>
                                <div className="text-3xl font-black text-secondary mb-2">{stat.value}</div>
                                <div className="flex items-center gap-2">
                                    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tighter ${stat.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                        {stat.trend === 'up' ? 'GROWING' : 'DROPPING'}
                                    </div>
                                    <span className="text-[10px] font-bold text-secondary/40">{stat.sub}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CHARTS GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <RevenueTrendChart />
                    </div>
                    <div>
                        <CategoryDistributionChart />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <OrderTrendsChart />
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold mb-6">Top Geographic Locations</h3>
                        <div className="space-y-6">
                            {[
                                { name: "United States", val: "42%", color: "bg-blue-500" },
                                { name: "United Kingdom", val: "28%", color: "bg-orange-500" },
                                { name: "Canada", val: "15%", color: "bg-green-500" },
                                { name: "Germany", val: "10%", color: "bg-purple-500" },
                                { name: "Others", val: "5%", color: "bg-gray-400" },
                            ].map((loc, i) => (
                                <div key={i} className="space-y-2 text-right">
                                    <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-secondary/60">
                                        <span>{loc.name}</span>
                                        <span>{loc.val}</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                        <div className={`h-full ${loc.color}`} style={{ width: loc.val }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SellerAnalytics;
