import React from 'react';
import { TrendingUp, AlertTriangle } from 'lucide-react';

interface ProductPerformance {
    id: string;
    name: string;
    sales: number;
    revenue: string;
    trend: number;
    stock: number;
}

const topSelling: ProductPerformance[] = [
    { id: '1', name: 'Wireless Headphones', sales: 1240, revenue: '$124,000', trend: 15, stock: 450 },
    { id: '2', name: 'Smart Watch Series 5', sales: 980, revenue: '$294,000', trend: 8, stock: 120 },
    { id: '3', name: 'Ergonomic Chair', sales: 850, revenue: '$212,500', trend: 12, stock: 65 },
    { id: '4', name: 'Mechanical Keyboard', sales: 620, revenue: '$93,000', trend: -5, stock: 200 },
];

const lowStock: ProductPerformance[] = [
    { id: '5', name: 'Gaming Mouse', sales: 450, revenue: '$22,500', trend: 2, stock: 12 },
    { id: '6', name: 'USB-C Hub', sales: 320, revenue: '$16,000', trend: 10, stock: 8 },
    { id: '7', name: 'Laptop Stand', sales: 210, revenue: '$10,500', trend: -2, stock: 4 },
];

export const TopSellingPanel: React.FC = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h3 className="text-gray-900 font-bold text-lg tracking-tight">Top Products</h3>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mt-1">Sales Performance</p>
            </div>
            <button className="text-orange-600 text-xs font-bold hover:underline">View Report</button>
        </div>

        <div className="flex-1 space-y-4">
            {topSelling.map((product, i) => (
                <div key={product.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-50 text-gray-500 text-xs font-bold border border-gray-100">
                            {i + 1}
                        </span>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900">{product.name}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">{product.sales} units sold</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{product.revenue}</p>
                        <div className="flex items-center justify-end gap-1 mt-0.5">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-xs font-medium text-green-600">{product.trend}%</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-50">
            <button className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors">
                View All Products
            </button>
        </div>
    </div>
);

export const AlertPanel: React.FC = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h3 className="text-gray-900 font-bold text-lg tracking-tight">Inventory Alerts</h3>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mt-1">Critical Stock Levels</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                <AlertTriangle className="w-4 h-4" />
            </div>
        </div>

        <div className="space-y-4 flex-1">
            {lowStock.map((product) => (
                <div key={product.id} className="p-4 rounded-xl border border-red-50 bg-red-50/30">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-bold text-gray-900">{product.name}</h4>
                        <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-md">
                            {product.stock} left
                        </span>
                    </div>
                    <div className="relative h-1.5 bg-red-100 rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-red-500 rounded-full"
                            style={{ width: `${(product.stock / 20) * 100}%` }}
                        />
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                        <span className="text-[10px] text-gray-500 font-medium uppercase">Reorder Point Reached</span>
                        <button className="text-[10px] font-bold text-red-600 hover:text-red-700 uppercase tracking-wide">
                            Restock
                        </button>
                    </div>
                </div>
            ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-50">
            <button className="w-full py-2.5 rounded-xl border-2 border-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider hover:border-gray-200 hover:bg-gray-50 transition-colors">
                Inventory Report
            </button>
        </div>
    </div>
);
