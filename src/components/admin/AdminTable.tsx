import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Filter, MoreHorizontal } from 'lucide-react';

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
        <div className="w-full flex-col flex gap-6">

            {/* HEADER TOOLBAR - NOW SEPARATE FROM TABLE */}
            <div className="p-1 rounded-[3rem] bg-gradient-to-r from-transparent via-white/5 to-transparent">
                <div className="px-8 py-6 rounded-[3rem] bg-slate-900/40 backdrop-blur-xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden group">
                    {/* Ambient Glow */}
                    <div className="absolute top-1/2 left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-[50px] -translate-y-1/2 group-hover:bg-cyan-500/20 transition-all duration-700" />

                    <div className="space-y-1 relative z-10">
                        {title && (
                            <h3 className="text-white font-black text-3xl tracking-tight uppercase flex items-center gap-4">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">{title}</span>
                            </h3>
                        )}
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
                                {filteredData.length} Live Records Found
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto relative z-10">
                        {/* Search */}
                        <div className="relative group w-full md:w-80">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                            <div className="relative bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl flex items-center transition-colors group-focus-within:border-cyan-500/50">
                                <Search className="w-4 h-4 text-gray-500 ml-5 group-focus-within:text-cyan-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder={searchPlaceholder}
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                    className="w-full pl-4 pr-6 py-4 bg-transparent text-sm font-bold text-white placeholder:text-gray-600 outline-none"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        {actions}
                    </div>
                </div>
            </div>

            {/* TABLE CONTENT */}
            <div className="relative min-h-[400px]">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10 rounded-3xl border border-white/5">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.5)]"></div>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-gray-600 bg-slate-900/20 rounded-[3rem] border border-white/5">
                        <Filter className="w-20 h-20 mb-6 opacity-20" />
                        <p className="text-sm font-black uppercase tracking-[0.3em]">No matching records found</p>
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto custom-scrollbar">
                        {/* DESKTOP TABLE VIEW */}
                        <table className="w-full text-left border-separate border-spacing-y-3 hidden md:table">
                            <thead>
                                <tr>
                                    {columns.map((col, idx) => (
                                        <th key={idx} className={`px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] whitespace-nowrap ${col.className || ''}`}>
                                            {col.header}
                                        </th>
                                    ))}
                                    <th className="w-10"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((row, rIdx) => (
                                    <tr key={rIdx} className="group relative transition-all duration-300">
                                        {/* Row Background & Hover Effect */}
                                        <td className="absolute inset-0 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 group-hover:bg-slate-800/60 group-hover:border-cyan-500/30 group-hover:scale-[1.01] transition-all duration-300 -z-10 shadow-lg" />

                                        {/* Hover Gradient Glow */}
                                        <td className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10" />

                                        {columns.map((col, cIdx) => (
                                            <td key={cIdx} className="px-8 py-6 text-sm font-bold text-gray-400 group-hover:text-white transition-colors whitespace-nowrap first:rounded-l-2xl last:rounded-r-2xl border-none">
                                                {col.cell ? col.cell(row) : (row[col.accessorKey] as React.ReactNode)}
                                            </td>
                                        ))}
                                        {/* Action Dots Placeholder */}
                                        <td className="px-4 py-6 text-right rounded-r-2xl border-none">
                                            <button className="p-2 rounded-full hover:bg-white/10 text-gray-500 hover:text-white transition-colors">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* MOBILE CARD VIEW */}
                        <div className="md:hidden space-y-4">
                            {paginatedData.map((row, rIdx) => (
                                <div key={rIdx} className="bg-slate-900/40 backdrop-blur-md p-6 rounded-[2rem] border border-white/5 hover:border-cyan-500/30 transition-all space-y-4 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />
                                    {columns.map((col, cIdx) => (
                                        <div key={cIdx} className="flex justify-between items-center gap-4 relative z-10">
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
                <div className="p-6 rounded-[2rem] bg-slate-900/20 backdrop-blur-md border border-white/5 flex items-center justify-between shadow-lg">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-4 rounded-2xl bg-white/[0.03] text-gray-400 hover:bg-cyan-500 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all border border-white/5 disabled:border-transparent group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`w-10 h-10 rounded-xl text-xs font-black transition-all border ${currentPage === page
                                    ? 'bg-cyan-500 border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)] scale-110'
                                    : 'bg-transparent border-transparent text-gray-500 hover:bg-white/5 hover:text-white hover:border-white/10'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-4 rounded-2xl bg-white/[0.03] text-gray-400 hover:bg-cyan-500 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all border border-white/5 disabled:border-transparent group"
                    >
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminTable;
