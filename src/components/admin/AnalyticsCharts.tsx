import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    Legend,
    AreaChart,
    Area,
    BarChart,
    Bar,
} from 'recharts';

const data = [
    { name: '00:00', load: 45, api: 2400, growth: 12, orders: 40, revenue: 2400 },
    { name: '04:00', load: 30, api: 1398, growth: 15, orders: 30, revenue: 1398 },
    { name: '08:00', load: 85, api: 9800, growth: 22, orders: 85, revenue: 9800 },
    { name: '12:00', load: 70, api: 3908, growth: 28, orders: 70, revenue: 3908 },
    { name: '16:00', load: 92, api: 4800, growth: 35, orders: 92, revenue: 4800 },
    { name: '20:00', load: 60, api: 3800, growth: 42, orders: 60, revenue: 3800 },
];

const categoryData = [
    { name: 'Electronics', value: 400 },
    { name: 'Fashion', value: 300 },
    { name: 'Home & Living', value: 300 },
    { name: 'Beauty', value: 200 },
    { name: 'Accessories', value: 150 },
];

const COLORS = ['#FF6F00', '#212121', '#FFD54F', '#4ADE80', '#3B82F6'];

export const CategoryDistributionChart = () => (
    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-sm border border-white/40 h-full min-h-[400px] hover:shadow-2xl transition-all duration-500">
        <div className="flex items-center gap-4 mb-8">
            <div className="w-2 h-8 bg-gradient-to-b from-primary to-orange-300 rounded-full" />
            <div>
                <h3 className="text-secondary font-black text-xl tracking-tight uppercase">Category Distribution</h3>
                <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">Products by Category</p>
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
                    paddingAngle={10}
                    dataKey="value"
                >
                    {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px -10px rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}
                />
                <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '30px' }}
                    formatter={(value) => <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">{value}</span>}
                />
            </PieChart>
        </ResponsiveContainer>
    </div>
);

export const OrderTrendsChart = () => (
    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-sm border border-white/40 h-[400px] hover:shadow-2xl transition-all duration-500">
        <div className="flex items-center gap-4 mb-8">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-400 rounded-full" />
            <div>
                <h3 className="text-secondary font-black text-xl tracking-tight uppercase">Order Analytics</h3>
                <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">Orders Over Time</p>
            </div>
        </div>
        <ResponsiveContainer width="100%" height="75%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontWeight: 600 }} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontWeight: 600 }} />
                <Tooltip
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px -10px rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}
                />
                <Bar dataKey="orders" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
);

export const RevenueTrendChart = () => (
    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-sm border border-white/40 h-[400px] hover:shadow-2xl transition-all duration-500">
        <div className="flex items-center gap-4 mb-8">
            <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-teal-400 rounded-full" />
            <div>
                <h3 className="text-secondary font-black text-xl tracking-tight uppercase">Revenue Trend</h3>
                <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">Global Revenue Growth</p>
            </div>
        </div>
        <ResponsiveContainer width="100%" height="75%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontWeight: 600 }} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontWeight: 600 }} />
                <Tooltip
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px -10px rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

// Backward compatibility or keeping previous charts if needed
export const SystemLoadChart = () => (
    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-sm border border-white/40 h-[400px] hover:shadow-2xl transition-all duration-500 overflow-hidden relative group">
        <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-gradient-to-b from-primary to-orange-300 rounded-full" />
                <div>
                    <h3 className="text-secondary font-black text-xl tracking-tight uppercase">System Health</h3>
                    <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">Live CPU & Memory Load</p>
                </div>
            </div>
            <div className="flex gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Stable</span>
            </div>
        </div>
        <ResponsiveContainer width="100%" height="75%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF6F00" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#FF6F00" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontWeight: 600 }} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontWeight: 600 }} />
                <Tooltip
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px -10px rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}
                />
                <Area type="monotone" dataKey="load" stroke="#FF6F00" strokeWidth={4} fillOpacity={1} fill="url(#colorLoad)" />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

export const VendorGrowthChart = () => (
    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-sm border border-white/40 h-[400px] hover:shadow-2xl transition-all duration-500">
        <div className="flex items-center gap-4 mb-8">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-400 rounded-full" />
            <div>
                <h3 className="text-secondary font-black text-xl tracking-tight uppercase">Vendor Acquisition</h3>
                <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">Global Partner Growth</p>
            </div>
        </div>
        <ResponsiveContainer width="100%" height="75%">
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontWeight: 600 }} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontWeight: 600 }} />
                <Tooltip
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px -10px rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}
                />
                <Line
                    type="monotone"
                    dataKey="growth"
                    stroke="#3B82F6"
                    strokeWidth={4}
                    dot={{ fill: '#3B82F6', strokeWidth: 3, r: 6, stroke: '#fff' }}
                    activeDot={{ r: 10, strokeWidth: 0, fill: '#3B82F6' }}
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

export const GlobalDistributionChart = () => (
    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-sm border border-white/40 h-full min-h-[400px] hover:shadow-2xl transition-all duration-500">
        <div className="flex items-center gap-4 mb-8">
            <div className="w-2 h-8 bg-gradient-to-b from-secondary to-slate-500 rounded-full" />
            <div>
                <h3 className="text-secondary font-black text-xl tracking-tight uppercase">Global Presence</h3>
                <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">Revenue by Geography</p>
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
                    paddingAngle={10}
                    dataKey="value"
                >
                    {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px -10px rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}
                />
                <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '30px' }}
                    formatter={(value) => <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">{value}</span>}
                />
            </PieChart>
        </ResponsiveContainer>
    </div>
);
