import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface TableColumn<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (row: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  isLoading?: boolean;
}

const AdminTable = <T extends Record<string, any>>({
  data,
  columns,
  title,
  subtitle,
  actions,
  isLoading = false
}: AdminTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="relative bg-white/[0.02] backdrop-blur-3xl rounded-[32px] border border-white/5 overflow-hidden flex flex-col h-full shadow-2xl">
      
      {/* Background glows */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Header Section */}
      {(title || subtitle || actions) && (
        <div className="relative p-8 z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 bg-white/[0.01]">
          <div>
            {title && <h3 className="text-white font-black text-xl italic tracking-tight uppercase">{title}</h3>}
            {subtitle && <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      )}

      {/* Table Container */}
      <div className="flex-1 overflow-x-auto relative min-h-[300px] z-0 custom-scrollbar">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0f172a]/40 backdrop-blur-sm z-10">
            <div className="flex flex-col items-center gap-4">
               <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
               <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Loading Data...</p>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 text-white/20">
            <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4">
                <ChevronRight className="w-6 h-6 rotate-90" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest italic">No Records Found</p>
          </div>
        ) : (
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className="px-8 py-6 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] bg-white/[0.02]"
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.02]">
              {paginatedData.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className="group transition-all duration-300 hover:bg-white/[0.04] cursor-pointer"
                >
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="px-8 py-6 text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                      {col.cell ? col.cell(row) : (row[col.accessorKey] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Container */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center px-8 py-6 border-t border-white/5 bg-white/[0.01]">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 disabled:opacity-20 disabled:hover:bg-white/5 transition-all group"
            >
              <ChevronLeft className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            </button>

            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`min-w-[40px] h-10 rounded-xl text-xs font-black transition-all ${
                    currentPage === page
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 disabled:opacity-20 disabled:hover:bg-white/5 transition-all group"
            >
              <ChevronRight className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTable;
