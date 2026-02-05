import React from 'react';
import { TrendingUp } from 'lucide-react';

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



export const TopSellingPanel: React.FC = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
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
