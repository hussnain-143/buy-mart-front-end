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
        <div className="w-full max-w-full min-w-0 bg-secondary rounded-[2.5rem] shadow-2xl border-2 border-white/5 overflow-hidden flex flex-col transition-all duration-500 hover:border-primary/30">

            {/* HEADER TOOLBAR */}
            <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-white/[0.02] to-transparent">
                <div className="space-y-1">
                    {title && (
                        <h3 className="text-white font-black text-2xl tracking-tight uppercase flex items-center gap-4">
                            <div className="w-2 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(255,111,0,0.5)]" />
                            {title}
                        </h3>
                    )}
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] pl-6">
                        {filteredData.length} active database entries
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative group w-full md:w-80">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-sm font-bold text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-gray-600"
                        />
                    </div>

                    {/* Actions */}
                    {actions}
                </div>
            </div>

            {/* TABLE CONTENT */}
            <div className="flex-1 overflow-hidden relative min-h-[400px]">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-secondary/80 backdrop-blur-sm z-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-80 text-gray-600">
                        <Filter className="w-16 h-16 mb-4 opacity-10" />
                        <p className="text-xs font-black uppercase tracking-[0.3em]">No matching records found</p>
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto custom-scrollbar">
                        {/* DESKTOP TABLE VIEW */}
                        <table className="w-full text-left border-collapse hidden md:table">
                            <thead className="bg-white/[0.02] border-b border-white/5 sticky top-0 z-10">
                                <tr>
                                    {columns.map((col, idx) => (
                                        <th key={idx} className={`px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] whitespace-nowrap ${col.className || ''}`}>
                                            {col.header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.02]">
                                {paginatedData.map((row, rIdx) => (
                                    <tr key={rIdx} className="group hover:bg-white/[0.02] transition-colors duration-200">
                                        {columns.map((col, cIdx) => (
                                            <td key={cIdx} className="px-8 py-6 text-sm font-bold text-gray-400 group-hover:text-white transition-colors whitespace-nowrap">
                                                {col.cell ? col.cell(row) : (row[col.accessorKey] as React.ReactNode)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* MOBILE CARD VIEW */}
                        <div className="md:hidden p-6 space-y-4">
                            {paginatedData.map((row, rIdx) => (
                                <div key={rIdx} className="bg-white/[0.02] p-6 rounded-[2rem] border border-white/5 hover:border-primary/30 transition-all space-y-4">
                                    {columns.map((col, cIdx) => (
                                        <div key={cIdx} className="flex justify-between items-center gap-4">
                                            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{col.header}</span>
                                            <div className="text-sm font-bold text-right text-white">
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
                <div className="p-8 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-3 rounded-2xl bg-white/[0.03] text-gray-400 hover:bg-primary hover:text-white disabled:opacity-10 transition-all"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-3">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === page
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                    : 'text-gray-500 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-3 rounded-2xl bg-white/[0.03] text-gray-400 hover:bg-primary hover:text-white disabled:opacity-10 transition-all"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminTable;
