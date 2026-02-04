import React from 'react';

interface Column {
    key: string;
    header: string;
}

interface DataTableProps {
    columns: Column[];
    data: any[];
    title?: string;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, title }) => {
    const getStatusStyles = (status: string) => {
        const s = status.toLowerCase();
        if (s.includes('delivered') || s.includes('verified') || s.includes('active'))
            return 'bg-emerald-100 text-emerald-600 shadow-sm shadow-emerald-100/50';
        if (s.includes('processing') || s.includes('review') || s.includes('pending'))
            return 'bg-amber-100 text-amber-600 shadow-sm shadow-amber-100/50';
        if (s.includes('shipped') || s.includes('new'))
            return 'bg-blue-100 text-blue-600 shadow-sm shadow-blue-100/50';
        if (s.includes('rejected') || s.includes('banned'))
            return 'bg-red-100 text-red-600 shadow-sm shadow-red-100/50';
        return 'bg-slate-100 text-slate-600';
    };

    return (
        <div className="w-full max-w-full bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-white/40 flex flex-col hover:shadow-2xl transition-all duration-500 overflow-hidden group/table">
            {title && (
                <div className="p-8 border-b border-gray-100/50 flex items-center justify-between bg-gradient-to-r from-transparent to-gray-50/30 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full group-hover/table:h-8 transition-all duration-500" />
                        <h3 className="text-secondary font-black text-xl tracking-tight uppercase truncate">{title}</h3>
                    </div>
                </div>
            )}

            <div className="relative w-full overflow-hidden flex-1">
                <div className="overflow-x-auto w-full custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100/50 sticky top-0 z-10">
                            <tr>
                                {columns.map((col) => (
                                    <th key={col.key} className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap bg-gray-50/50">
                                        {col.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {data.map((row, index) => (
                                <tr key={index} className="hover:bg-primary/[0.02] transition-colors duration-300 group/row">
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-6 py-6 text-sm font-bold text-gray-500 group-hover/row:text-secondary transition-colors whitespace-nowrap">
                                            {col.key === 'status' ? (
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center ${getStatusStyles(row[col.key])}`}>
                                                    {row[col.key]}
                                                </span>
                                            ) : (
                                                <span className="truncate max-w-[200px] block">
                                                    {row[col.key]}
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400 text-xs font-bold uppercase tracking-wider">
                                        No Records Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DataTable;
