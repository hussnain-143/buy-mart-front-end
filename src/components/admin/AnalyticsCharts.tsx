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
    Bar
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
    { name: 'Home', value: 300 },
    { name: 'Beauty', value: 200 },
    { name: 'Accessories', value: 150 },
];

const COLORS = ['#FF6F00', '#212121', '#FFD54F', '#4ADE80', '#3B82F6'];

// Common chart container style
const ChartContainer = ({ title, subtitle, children }: { title: string, subtitle: string, children: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full min-h-[400px] flex flex-col">
        <div className="mb-6">
            <h3 className="text-gray-900 font-bold text-lg tracking-tight">{title}</h3>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mt-1">{subtitle}</p>
        </div>
        <div className="flex-1 min-h-0">
            {children}
        </div>
    </div>
);

// Common tooltip style
const tooltipStyle = {
    backgroundColor: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#1f2937'
};

export const CategoryDistributionChart = () => (
    <ChartContainer title="Category Distribution" subtitle="Products by Category">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth={2} />
                    ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} cursor={false} />
                <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span className="text-gray-600 text-xs font-medium ml-1">{value}</span>}
                />
            </PieChart>
        </ResponsiveContainer>
    </ChartContainer>
);

export const OrderTrendsChart = () => (
    <ChartContainer title="Order Analytics" subtitle="Orders Over Time">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis
                    dataKey="name"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#9CA3AF' }}
                    dy={10}
                />
                <YAxis
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#9CA3AF' }}
                />
                <Tooltip
                    cursor={{ fill: '#F9FAFB' }}
                    contentStyle={tooltipStyle}
                />
                <Bar
                    dataKey="orders"
                    fill="#3B82F6"
                    radius={[4, 4, 4, 4]}
                    barSize={32}
                />
            </BarChart>
        </ResponsiveContainer>
    </ChartContainer>
);

export const RevenueTrendChart = () => (
    <ChartContainer title="Revenue Trend" subtitle="Global Revenue Growth">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis
                    dataKey="name"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#9CA3AF' }}
                    dy={10}
                />
                <YAxis
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#9CA3AF' }}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                />
            </AreaChart>
        </ResponsiveContainer>
    </ChartContainer>
);

// Backward compatibility or keeping previous charts if needed
export const SystemLoadChart = () => (
    <ChartContainer title="System Health" subtitle="Live CPU & Memory Load">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF6F00" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#FF6F00" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#9CA3AF' }} dy={10} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#9CA3AF' }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="load" stroke="#FF6F00" strokeWidth={2} fillOpacity={1} fill="url(#colorLoad)" />
            </AreaChart>
        </ResponsiveContainer>
    </ChartContainer>
);

export const VendorGrowthChart = () => (
    <ChartContainer title="Vendor Acquisition" subtitle="Global Partner Growth">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#9CA3AF' }} dy={10} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#9CA3AF' }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                    type="monotone"
                    dataKey="growth"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#3B82F6' }}
                />
            </LineChart>
        </ResponsiveContainer>
    </ChartContainer>
);

export const GlobalDistributionChart = () => (
    <ChartContainer title="Global Presence" subtitle="Revenue by Geography">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth={2} />
                    ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} cursor={false} />
                <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span className="text-gray-600 text-xs font-medium ml-1">{value}</span>}
                />
            </PieChart>
        </ResponsiveContainer>
    </ChartContainer>
);
