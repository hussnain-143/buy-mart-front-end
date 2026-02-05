import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export interface TableColumn<T> {
    header: string;
    accessorKey: keyof T;
    cell?: (row: T) => React.ReactNode;
    className?: string;
}

interface AdminTableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
    title?: string;
    searchPlaceholder?: string;
    actions?: React.ReactNode;
    isLoading?: boolean;
}

const AdminTable = <T extends Record<string, any>>({
    data,
    columns,
    title,
    searchPlaceholder = "Search records...",
    actions,
    isLoading = false
}: AdminTableProps<T>) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    // Filter Data
    const filteredData = useMemo(() => {
        if (!searchQuery) return data;
        const lowerQuery = searchQuery.toLowerCase();
        return data.filter((row) =>
            Object.values(row).some((val) =>
                String(val).toLowerCase().includes(lowerQuery)
            )
        );
    }, [data, searchQuery]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">

            {/* HEADER TOOLBAR */}
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    {title && (
                        <h3 className="text-gray-900 font-bold text-lg tracking-tight">
                            {title}
                        </h3>
                    )}
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                        {filteredData.length} records found
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative group w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all placeholder:text-gray-400"
                        />
                    </div>

                    {/* Actions */}
                    {actions}
                </div>
            </div>

            {/* TABLE CONTENT */}
            <div className="flex-1 overflow-auto relative min-h-[300px]">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <Filter className="w-10 h-10 mb-3 opacity-20" />
                        <p className="text-sm font-medium">No results found</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 hover:bg-gray-50 sticky top-0 z-10">
                            <tr>
                                {columns.map((col, idx) => (
                                    <th key={idx} className={`px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap border-b border-gray-100 ${col.className || ''}`}>
                                        {col.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedData.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-orange-50/30 transition-colors">
                                    {columns.map((col, cIdx) => (
                                        <td key={cIdx} className="px-6 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                            {col.cell ? col.cell(row) : (row[col.accessorKey] as React.ReactNode)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* FOOTER PAGINATION */}
            {totalPages > 1 && (
                <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:shadow-none transition-all text-gray-500"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === page
                                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                                    : 'text-gray-500 hover:bg-white hover:text-orange-600'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:shadow-none transition-all text-gray-500"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminTable;
