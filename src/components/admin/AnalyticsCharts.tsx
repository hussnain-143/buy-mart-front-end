import {
    XAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { TrendingUp, Activity, PieChart as PieIcon } from 'lucide-react';

const data = [
    { name: '00:00', orders: 40, revenue: 2400, load: 45 },
    { name: '04:00', orders: 30, revenue: 1398, load: 30 },
    { name: '08:00', orders: 85, revenue: 9800, load: 85 },
    { name: '12:00', orders: 70, revenue: 3908, load: 70 },
    { name: '16:00', orders: 92, revenue: 4800, load: 92 },
    { name: '20:00', orders: 60, revenue: 3800, load: 60 },
];

const categoryData = [
    { name: 'Electronics', value: 400 },
    { name: 'Fashion', value: 300 },
    { name: 'Home & Living', value: 300 },
    { name: 'Beauty', value: 200 },
    { name: 'Accessories', value: 150 },
];

const COLORS = ['#22d3ee', '#818cf8', '#e879f9', '#f472b6', '#34d399'];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
                <p className="text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm font-bold">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-white">
                            {entry.value}
                            {entry.name === 'revenue' && '$'}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export const CategoryDistributionChart = () => (
    <div className="relative overflow-hidden bg-slate-900/20 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/5 h-full min-h-[400px] group hover:border-purple-500/30 transition-all duration-500">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-purple-500/20 transition-all duration-700" />

        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <PieIcon size={20} />
            </div>
            <div>
                <h3 className="text-white font-black text-xl tracking-tight uppercase">Market Share</h3>
                <p className="text-gray-500 text-[10px] font-bold tracking-[0.3em] uppercase">Category Dominance</p>
            </div>
        </div>
        <ResponsiveContainer width="100%" height="75%">
            <PieChart>
                <Pie
                    data={categoryData}
                    cx="50%"
                    cy="45%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                >
                    {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="outline-none" />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '20px' }}
                    formatter={(value) => <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest ml-2">{value}</span>}
                />
            </PieChart>
        </ResponsiveContainer>
    </div>
);

export const OrderTrendsChart = () => (
    <div className="relative overflow-hidden bg-slate-900/20 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/5 h-[400px] group hover:border-cyan-500/30 transition-all duration-500">
        {/* Background Glow */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-cyan-500/20 transition-all duration-700" />

        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                <Activity size={20} />
            </div>
            <div>
                <h3 className="text-white font-black text-xl tracking-tight uppercase">Order Flow</h3>
                <p className="text-gray-500 text-[10px] font-bold tracking-[0.3em] uppercase">Real-time Velocity</p>
            </div>
        </div>
        <ResponsiveContainer width="100%" height="75%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" opacity={0.05} />
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontWeight: 700 }} dy={10} />
                <Tooltip cursor={{ fill: 'white', opacity: 0.05 }} content={<CustomTooltip />} />
                <Bar dataKey="orders" fill="#22d3ee" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={`url(#barGradient-${index})`} />
                    ))}
                </Bar>
                <defs>
                    {data.map((_, index) => (
                        <linearGradient key={`barGradient-${index}`} id={`barGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.2} />
                        </linearGradient>
                    ))}
                </defs>
            </BarChart>
        </ResponsiveContainer>
    </div>
);

export const RevenueTrendChart = () => (
    <div className="relative overflow-hidden bg-slate-900/20 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/5 h-[400px] group hover:border-emerald-500/30 transition-all duration-500">
        {/* Background Glow */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-emerald-500/20 transition-all duration-700" />

        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                <TrendingUp size={20} />
            </div>
            <div>
                <h3 className="text-white font-black text-xl tracking-tight uppercase">Revenue Stream</h3>
                <p className="text-gray-500 text-[10px] font-bold tracking-[0.3em] uppercase">Financial Trajectory</p>
            </div>
        </div>
        <ResponsiveContainer width="100%" height="75%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" opacity={0.05} />
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontWeight: 700 }} dy={10} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);
