import React from "react";
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
} from "recharts";

/* ===================== SAMPLE DATA ===================== */
const data = [
  { name: "00:00", load: 45, api: 2400, growth: 12, orders: 40, revenue: 2400 },
  { name: "04:00", load: 30, api: 1398, growth: 15, orders: 30, revenue: 1398 },
  { name: "08:00", load: 85, api: 9800, growth: 22, orders: 85, revenue: 9800 },
  { name: "12:00", load: 70, api: 3908, growth: 28, orders: 70, revenue: 3908 },
  { name: "16:00", load: 92, api: 4800, growth: 35, orders: 92, revenue: 4800 },
  { name: "20:00", load: 60, api: 3800, growth: 42, orders: 60, revenue: 3800 },
];

const categoryData = [
  { name: "Electronics", value: 400 },
  { name: "Fashion", value: 300 },
  { name: "Home", value: 300 },
  { name: "Beauty", value: 200 },
  { name: "Accessories", value: 150 },
];

/* ===================== COLORS ===================== */
const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"];

/* ===================== TOOLTIP STYLE ===================== */
const tooltipStyle = {
  backgroundColor: "#fff",
  border: "1px solid #f3f4f6",
  borderRadius: "14px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  padding: "10px 14px",
  fontSize: "12px",
  fontWeight: 700,
  color: "#111827",
};

/* ===================== CHART CONTAINER ===================== */
const ChartContainer = ({
  title,
  subtitle,
  children,
  rightContent,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  rightContent?: React.ReactNode;
}) => {
  return (
    <div
      className="
        relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6
        shadow-sm transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg hover:border-primary/50
        h-full min-h-[420px] flex flex-col
      "
    >
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-primary/15 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-secondary/10 blur-3xl rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary via-primary/70 to-transparent"></div>

      <div className="relative flex items-start justify-between mb-6">
        <div>
          <h3 className="text-secondary font-bold text-lg tracking-tight">{title}</h3>
          <p className="text-secondary/70 text-xs font-semibold uppercase tracking-wider mt-1">{subtitle}</p>
        </div>
        {rightContent && <div>{rightContent}</div>}
      </div>

      <div className="relative flex-1 min-h-0">{children}</div>
    </div>
  );
};

/* ===================== CATEGORY DISTRIBUTION CHART ===================== */
export const CategoryDistributionChart = () => (
  <ChartContainer title="Category Distribution" subtitle="Products by Category">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={categoryData}
          cx="50%"
          cy="45%"
          innerRadius={75}
          outerRadius={105}
          paddingAngle={4}
          dataKey="value"
        >
          {categoryData.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} cursor={false} />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          iconSize={9}
          formatter={(value) => (
            <span className="text-secondary/80 text-xs font-semibold ml-1">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  </ChartContainer>
);

/* ===================== ORDER TRENDS CHART ===================== */
export const OrderTrendsChart = () => (
  <ChartContainer
    title="Order Analytics"
    subtitle="Orders Over Time"
    rightContent={
      <div className="text-right">
        <p className="text-[10px] font-semibold text-secondary/60 uppercase">Total Orders</p>
        <p className="text-lg font-extrabold text-primary">377</p>
      </div>
    }
  >
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
        <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: "#9CA3AF" }} dy={10} />
        <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{ fill: "#9CA3AF" }} />
        <Tooltip cursor={{ fill: "#FAFAFA" }} contentStyle={tooltipStyle} />
        <Bar dataKey="orders" fill="#FF6F00" radius={[10, 10, 10, 10]} barSize={34} />
      </BarChart>
    </ResponsiveContainer>
  </ChartContainer>
);

/* ===================== REVENUE TREND CHART ===================== */
export const RevenueTrendChart = () => (
  <ChartContainer
    title="Revenue Trend"
    subtitle="Global Revenue Growth"
    rightContent={
      <div className="text-right">
        <p className="text-[10px] font-semibold text-secondary/60 uppercase">Today Revenue</p>
        <p className="text-lg font-extrabold text-primary">$26.1K</p>
      </div>
    }
  >
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF6F00" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#FF6F00" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
        <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: "#9CA3AF" }} dy={10} />
        <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{ fill: "#9CA3AF" }} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area type="monotone" dataKey="revenue" stroke="#FF6F00" strokeWidth={3} fill="url(#colorRevenue)" />
      </AreaChart>
    </ResponsiveContainer>
  </ChartContainer>
);

/* ===================== VENDOR GROWTH CHART ===================== */
export const VendorGrowthChart = () => (
  <ChartContainer title="Vendor Acquisition" subtitle="Global Partner Growth">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
        <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: "#9CA3AF" }} dy={10} />
        <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{ fill: "#9CA3AF" }} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line
          type="monotone"
          dataKey="growth"
          stroke="#FFD54F"
          strokeWidth={3}
          dot={{ fill: "#FFD54F", strokeWidth: 2, r: 4, stroke: "#fff" }}
          activeDot={{ r: 7, strokeWidth: 0, fill: "#FFD54F" }}
        />
      </LineChart>
    </ResponsiveContainer>
  </ChartContainer>
);
