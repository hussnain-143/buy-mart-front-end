
import AdminTable, { TableColumn } from '../../components/admin/AdminTable';
import { Star } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    rating: number;
    image: string;
    status: 'Active' | 'Draft' | 'Out of Stock';
}

const AdminProducts = () => {
    // Mock data
    const products: Product[] = [
        { id: '1', name: 'Wireless Headphones', category: 'Electronics', price: 99.99, stock: 45, rating: 4.5, status: 'Active', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80' },
        { id: '2', name: 'Leather Jacket', category: 'Fashion', price: 199.50, stock: 12, rating: 4.8, status: 'Active', image: 'https://images.unsplash.com/photo-1551028919-ac66e62469d2?w=200&q=80' },
        { id: '3', name: 'Smart Watch', category: 'Electronics', price: 149.00, stock: 0, rating: 4.2, status: 'Out of Stock', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80' },
        { id: '4', name: 'Running Shoes', category: 'Sports', price: 89.99, stock: 30, rating: 4.6, status: 'Active', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80' },
    ];

    const columns: TableColumn<Product>[] = [
        {
            header: 'Product',
            accessorKey: 'name',
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                        <img src={row.image} alt={row.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <div className="font-bold text-gray-800">{row.name}</div>
                        <div className="text-xs text-gray-500">{row.category}</div>
                    </div>
                </div>
            ),
        },
        {
            header: 'Price',
            accessorKey: 'price',
            cell: (row) => <span className="font-semibold text-gray-700">${row.price.toFixed(2)}</span>,
        },
        {
            header: 'Stock',
            accessorKey: 'stock',
            cell: (row) => (
                <span className={`font-medium ${row.stock < 10 ? 'text-red-500' : 'text-gray-600'}`}>
                    {row.stock} units
                </span>
            ),
        },
        {
            header: 'Rating',
            accessorKey: 'rating',
            cell: (row) => (
                <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                    <Star size={14} fill="currentColor" /> {row.rating}
                </div>
            )
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (row) => {
                let colorClass = "";
                switch (row.status) {
                    case 'Active': colorClass = 'bg-green-500/10 text-green-600'; break;
                    case 'Out of Stock': colorClass = 'bg-red-500/10 text-red-600'; break;
                    default: colorClass = 'bg-gray-100 text-gray-500';
                }
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colorClass}`}>
                        {row.status}
                    </span>
                );
            },
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">
                        Products
                    </h1>
                    <p className="text-gray-500 mt-1">Manage platform inventory</p>
                </div>
            </div>

            <div className="h-[600px]">
                <AdminTable
                    data={products}
                    columns={columns}
                    title="Product Catalog"
                    subtitle="All available items"
                />
            </div>
        </div>
    );
};

export default AdminProducts;
