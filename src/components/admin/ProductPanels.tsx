import React from 'react';
import { TrendingUp, AlertTriangle, Package } from 'lucide-react';

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
    <div className="bg-secondary p-8 rounded-[2.5rem] border-2 border-white/5 hover:border-primary/50 transition-all duration-500 group">
        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-primary text-white rounded-2xl shadow-[0_0_15px_rgba(255,111,0,0.3)]">
                <TrendingUp size={20} />
            </div>
            <div>
                <h3 className="text-white font-black text-xl tracking-tight uppercase">Elite Performance</h3>
                <p className="text-gray-500 text-[10px] font-bold tracking-[0.3em] uppercase">High Velocity Global Leaders</p>
            </div>
        </div>
        <div className="space-y-4">
            {topSelling.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary/30 transition-all duration-300">
                    <div className="flex items-center gap-5">
                        <div className="p-3 bg-emerald-500/20 text-emerald-500 rounded-2xl">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-white tracking-tight">{product.name}</h4>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{product.sales} Sales</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-md font-black text-emerald-400">{product.revenue}</p>
                        <div className="flex items-center justify-end gap-1 text-[9px] font-black text-primary uppercase tracking-tighter">
                            <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                            Trending
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const AlertPanel: React.FC = () => (
    <div className="bg-secondary p-8 rounded-[2.5rem] border-2 border-white/5 hover:border-primary/50 transition-all duration-500 group">
        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-red-500 text-white rounded-2xl shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                <AlertTriangle size={20} />
            </div>
            <div>
                <h3 className="text-white font-black text-xl tracking-tight uppercase">System Alerts</h3>
                <p className="text-gray-500 text-[10px] font-bold tracking-[0.3em] uppercase">Critical Inventory Status</p>
            </div>
        </div>
        <div className="space-y-4">
            {lowStock.map((product) => (
                <div key={product.id} className="p-5 rounded-3xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <h4 className="text-sm font-black text-white tracking-tight">{product.name}</h4>
                            <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">{product.stock} units remaining</span>
                        </div>
                        <div className="p-2 bg-red-500 text-white rounded-xl animate-pulse">
                            <AlertTriangle className="w-3 h-3" />
                        </div>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" style={{ width: `${(product.stock / 10) * 100}%` }} />
                    </div>
                </div>
            ))}
        </div>
        <button className="w-full mt-8 py-4 bg-primary text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary/90 hover:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(255,111,0,0.3)]">
            Command Center Access
        </button>
    </div>
);
