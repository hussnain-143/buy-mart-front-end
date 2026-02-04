import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronDown, Filter } from 'lucide-react';

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
        <div className="w-full bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/40 overflow-hidden flex flex-col transition-all duration-500 hover:shadow-2xl">

            {/* HEADER TOOLBAR */}
            <div className="p-6 md:p-8 border-b border-gray-100/50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-white/50 to-gray-50/30">
                <div className="space-y-1">
                    {title && (
                        <h3 className="text-secondary font-black text-xl md:text-2xl tracking-tight uppercase flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-primary rounded-full" />
                            {title}
                        </h3>
                    )}
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-4.5">
                        {filteredData.length} records found
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative group w-full md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-gray-400"
                        />
                    </div>

                    {/* Actions */}
                    {actions}
                </div>
            </div>

            {/* TABLE CONTENT */}
            <div className="flex-1 overflow-hidden relative min-h-[300px]">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <Filter className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-sm font-bold uppercase tracking-wider">No records match your search</p>
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto custom-scrollbar">
                        {/* DESKTOP TABLE VIEW */}
                        <table className="w-full text-left border-collapse hidden md:table">
                            <thead className="bg-gray-50/80 border-b border-gray-100 sticky top-0 z-10 font-montserrat">
                                <tr>
                                    {columns.map((col, idx) => (
                                        <th key={idx} className={`px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap ${col.className || ''}`}>
                                            {col.header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {paginatedData.map((row, rIdx) => (
                                    <tr key={rIdx} className="group hover:bg-primary/[0.02] transition-colors duration-200">
                                        {columns.map((col, cIdx) => (
                                            <td key={cIdx} className="px-6 py-5 text-sm font-bold text-gray-600 group-hover:text-secondary whitespace-nowrap">
                                                {col.cell ? col.cell(row) : (row[col.accessorKey] as React.ReactNode)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* MOBILE CARD VIEW */}
                        <div className="md:hidden p-4 space-y-4">
                            {paginatedData.map((row, rIdx) => (
                                <div key={rIdx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow space-y-3">
                                    {columns.map((col, cIdx) => (
                                        <div key={cIdx} className="flex justify-between items-center gap-4">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{col.header}</span>
                                            <div className="text-sm font-bold text-right text-gray-700">
                                                {col.cell ? col.cell(row) : (row[col.accessorKey] as React.ReactNode)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* FOOTER PAGINATION */}
            {totalPages > 1 && (
                <div className="p-6 border-t border-gray-100/50 bg-gray-50/30 flex items-center justify-between">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-xl hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>

                    <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === page
                                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                        : 'text-gray-400 hover:bg-white hover:text-secondary'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-xl hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminTable;
