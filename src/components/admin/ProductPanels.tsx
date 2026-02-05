import React from 'react';

interface ProductPerformance {
  id: string;
  name: string;
  sales: number;
  revenue: string;
  stock: number;
}

const topSelling: ProductPerformance[] = [
  { id: '1', name: 'Wireless Headphones', sales: 1240, revenue: '$124,000',  stock: 450 },
  { id: '2', name: 'Smart Watch Series 5', sales: 980, revenue: '$294,000',  stock: 120 },
  { id: '3', name: 'Ergonomic Chair', sales: 850, revenue: '$212,500',  stock: 65 },
  { id: '4', name: 'Mechanical Keyboard', sales: 620, revenue: '$93,000',  stock: 200 },
  { id: '5', name: 'Bluetooth Speaker', sales: 480, revenue: '$48,000', stock: 150 },
];

export const TopSellingPanel: React.FC = () => (
  <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full">
    
    {/* Background Glow */}
    <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/15 blur-3xl rounded-full"></div>
    <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-secondary/10 blur-3xl rounded-full"></div>

    {/* Top Accent Line */}
    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary via-primary/70 to-transparent"></div>

    {/* Header */}
    <div className="relative flex items-center justify-between mb-6">
      <div>
        <h3 className="text-secondary font-bold text-lg tracking-tight">Top Products</h3>
        <p className="text-secondary/70 text-xs font-semibold uppercase tracking-wider mt-1">Sales Performance</p>
      </div>
    </div>

    {/* Product List */}
    <div className="flex-1 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-gray-100 h-[220px]">
      {topSelling.map((product, i) => (
        <div
          key={product.id}
          className="flex items-center justify-between group p-2 rounded-xl hover:bg-primary/5 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div>
              <h4 className="text-sm font-semibold text-secondary">{product.name}</h4>
              <p className="text-xs text-secondary/60 mt-0.5">{product.sales} units sold</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-primary">{product.revenue}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Footer */}
    <div className="mt-6 pt-4 border-t border-gray-50">
      <button className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors">
        View All Products
      </button>
    </div>
  </div>
);
