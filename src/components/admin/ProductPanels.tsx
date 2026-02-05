import React from 'react';
import { TrendingUp, AlertTriangle, Package, Zap, ArrowRight } from 'lucide-react';

interface ProductPerformance {
    id: string;
    name: string;
    sales: number;
    revenue: string;
    stock: number;
    trend: 'up' | 'down';
}

const topSelling: ProductPerformance[] = [
    { id: '1', name: 'Ultra-Bass Headphones', sales: 1240, revenue: '$45,800', stock: 45, trend: 'up' },
    { id: '2', name: 'Smart Fitness Tracker', sales: 980, revenue: '$29,400', stock: 120, trend: 'up' },
    { id: '3', name: 'Leather Crossbody Bag', sales: 856, revenue: '$18,900', stock: 12, trend: 'down' },
];

const lowStock: ProductPerformance[] = [
    { id: '4', name: 'Minimalist Wall Clock', sales: 450, revenue: '$9,000', stock: 8, trend: 'up' },
    { id: '5', name: 'Ceramic Coffee Set', sales: 320, revenue: '$6,400', stock: 3, trend: 'down' },
    { id: '6', name: 'Silk Sleep Mask', sales: 1200, revenue: '$3,600', stock: 5, trend: 'up' },
];

export const TopSellingPanel: React.FC = () => (
    <div className="relative overflow-hidden bg-slate-900/20 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/5 group hover:border-emerald-500/30 transition-all duration-500">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -z-10 group-hover:bg-emerald-500/10 transition-all duration-700" />

        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                <Zap size={20} />
            </div>
            <div>
                <h3 className="text-white font-black text-xl tracking-tight uppercase">Elite Products</h3>
                <p className="text-gray-500 text-[10px] font-bold tracking-[0.3em] uppercase">High Velocity Items</p>
            </div>
        </div>

        <div className="space-y-4">
            {topSelling.map((product, index) => (
                <div key={product.id} className="relative group/item flex items-center justify-between p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-emerald-500/30 hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden">
                    {/* Hover Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 translate-x-[-100%] group-hover/item:translate-x-[100%] transition-transform duration-1000" />

                    <div className="flex items-center gap-5 relative z-10">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-black text-xs border border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                            #{index + 1}
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-white tracking-tight group-hover/item:text-emerald-400 transition-colors">{product.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <Package className="w-3 h-3 text-gray-500" />
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{product.sales} Sold</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-right relative z-10">
                        <p className="text-md font-black text-white">{product.revenue}</p>
                        <div className="flex items-center justify-end gap-1 text-[9px] font-black text-emerald-400 uppercase tracking-tighter mt-1">
                            <TrendingUp className="w-3 h-3" />
                            Velocity
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <button className="w-full mt-6 py-4 rounded-[1.5rem] border border-white/5 bg-white/[0.02] text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-500 hover:text-white hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-all duration-300 flex items-center justify-center gap-2 group/btn">
            View All Leaders
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
    </div>
);

export const AlertPanel: React.FC = () => (
    <div className="relative overflow-hidden bg-slate-900/20 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/5 group hover:border-red-500/30 transition-all duration-500">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px] -z-10 group-hover:bg-red-500/10 transition-all duration-700" />

        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <AlertTriangle size={20} />
            </div>
            <div>
                <h3 className="text-white font-black text-xl tracking-tight uppercase">Critical Alerts</h3>
                <p className="text-gray-500 text-[10px] font-bold tracking-[0.3em] uppercase">Inventory Attention Needed</p>
            </div>
        </div>

        <div className="space-y-4">
            {lowStock.map((product) => (
                <div key={product.id} className="p-5 rounded-3xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300 group/alert">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <h4 className="text-sm font-black text-white tracking-tight group-hover/alert:text-red-400 transition-colors">{product.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${product.stock < 5 ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`} />
                                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">{product.stock} units remaining</span>
                            </div>
                        </div>
                        <div className="p-2 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20">
                            <AlertTriangle className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)] relative" style={{ width: `${(product.stock / 10) * 100}%` }}>
                            <div className="absolute top-0 right-0 bottom-0 w-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <button className="w-full mt-8 py-4 bg-red-500 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-600 hover:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(239,68,68,0.3)] flex items-center justify-center gap-2 group/btn">
            Resupply Operations
            <Zap className="w-4 h-4 group-hover/btn:animate-pulse" />
        </button>
    </div>
);
