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
    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-sm border border-white/40 h-full hover:shadow-2xl transition-all duration-500 group">
        <div className="flex items-center gap-4 mb-8">
            <div className="w-2 h-8 bg-gradient-to-b from-primary to-orange-300 rounded-full" />
            <div>
                <h3 className="text-secondary font-black text-xl tracking-tight uppercase">Top Performance</h3>
                <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">Must-Sell Global Leaders</p>
            </div>
        </div>
        <div className="space-y-6">
            {topSelling.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-100 transition-all duration-300">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-secondary tracking-tight">{product.name}</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.sales} Sales</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-black text-emerald-600">{product.revenue}</p>
                        <div className="flex items-center justify-end gap-1 text-[10px] font-black text-primary">
                            <TrendingUp className="w-3 h-3" />
                            HOT
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const AlertPanel: React.FC = () => (
    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-sm border border-white/40 min-h-full hover:shadow-2xl transition-all duration-500 group">
        <div className="flex items-center gap-4 mb-8">
            <div className="w-2 h-8 bg-gradient-to-b from-red-500 to-rose-400 rounded-full" />
            <div>
                <h3 className="text-secondary font-black text-xl tracking-tight uppercase">Inventory Alerts</h3>
                <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">Critical Stock Levels</p>
            </div>
        </div>
        <div className="space-y-4">
            {lowStock.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-4 rounded-2xl bg-red-50/30 border border-red-100/50 group/item hover:bg-red-50 transition-colors">
                    <div className="p-3 bg-red-100 text-red-600 rounded-xl relative overflow-hidden">
                        <AlertTriangle className="w-5 h-5 relative z-10" />
                        <div className="absolute inset-0 bg-red-500/10 animate-ping" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-black text-secondary tracking-tight">{product.name}</h4>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{product.stock} units left</span>
                            <div className="h-1 flex-1 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500" style={{ width: `${(product.stock / 10) * 100}%` }} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <button className="w-full mt-8 py-4 bg-secondary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20">
            Manage Inventory Fleet
        </button>
    </div>
);
