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
    <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
      
      {/* Background glows */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/15 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-secondary/10 blur-3xl rounded-full"></div>

      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary via-primary/70 to-transparent"></div>

      {/* Header */}
      {(title || subtitle) && (
        <div className="relative p-6 z-10">
          {title && <h3 className="text-secondary font-bold text-lg">{title}</h3>}
          {subtitle && <p className="text-secondary/70 text-xs font-semibold uppercase tracking-wider mt-1">{subtitle}</p>}
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-x-auto relative min-h-[200px] z-0 px-6">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-secondary/50">
            <p className="text-sm font-medium">No records found</p>
          </div>
        ) : (
          <table className="min-w-full text-left border-collapse mt-2">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-3 text-xs font-semibold text-secondary/70 uppercase tracking-wide border-b border-gray-100"
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className={`transition-all duration-200 hover:bg-primary/10 cursor-pointer ${
                    rIdx % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'
                  }`}
                >
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="px-4 py-3 text-sm font-medium text-secondary">
                      {col.cell ? col.cell(row) : (row[col.accessorKey] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 p-4 border-t border-gray-100 bg-gray-50/20">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-full hover:bg-primary/10 disabled:opacity-40 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-secondary/50" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-1 rounded-full text-sm font-bold transition-all ${
                currentPage === page
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-secondary hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full hover:bg-primary/10 disabled:opacity-40 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-secondary/50" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminTable;
