import { TrendingUp, Package, ShoppingBag, Users, ArrowUpRight, Coffee } from 'lucide-react';
import { Link } from 'react-router';
import { orders, products, users } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

const salesData = [
  { month: 'Nov', revenue: 1240 },
  { month: 'Dec', revenue: 2180 },
  { month: 'Jan', revenue: 1890 },
  { month: 'Feb', revenue: 2340 },
  { month: 'Mar', revenue: 2890 },
  { month: 'Apr', revenue: 3260 },
];

const categoryData = [
  { name: 'Whole Bean', value: 62 },
  { name: 'Ground', value: 25 },
  { name: 'Accessories', value: 13 },
];

const statusColors: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Completed: 'bg-[#4A6741]/10 text-[#4A6741]',
  Cancelled: 'bg-red-100 text-red-700',
};

export function AdminDashboard() {
  const totalRevenue = orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const lowStock = products.filter(p => p.stock <= 15).length;
  const totalCustomers = users.filter(u => u.role === 'Customer').length;

  const recentOrders = [...orders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const topProducts = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-[#2C1810]">Dashboard</h1>
        <p className="text-[#8B5E3C] text-sm mt-1">Welcome back! Here's what's brewing.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Revenue', value: `$${totalRevenue.toFixed(0)}`,
            icon: <TrendingUp size={18} />, change: '+18%', color: 'bg-[#4A6741]/10 text-[#4A6741]',
          },
          {
            label: 'Pending Orders', value: pendingOrders.toString(),
            icon: <ShoppingBag size={18} />, change: 'Needs attention', color: 'bg-amber-100 text-amber-700',
          },
          {
            label: 'Total Products', value: products.length.toString(),
            icon: <Coffee size={18} />, change: `${lowStock} low stock`, color: 'bg-[#2C6B8A]/10 text-[#2C6B8A]',
          },
          {
            label: 'Customers', value: totalCustomers.toString(),
            icon: <Users size={18} />, change: '+3 this month', color: 'bg-[#8B5E3C]/10 text-[#8B5E3C]',
          },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-[rgba(44,24,16,0.06)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#8B5E3C]">{kpi.label}</span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${kpi.color}`}>
                {kpi.icon}
              </div>
            </div>
            <p className="text-2xl font-medium text-[#2C1810]">{kpi.value}</p>
            <p className="text-xs text-[#8B5E3C] mt-1">{kpi.change}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-[rgba(44,24,16,0.06)]">
          <h3 className="font-medium text-[#2C1810] mb-4">Revenue Over Time</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,24,16,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8B5E3C' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#8B5E3C' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip
                formatter={(v: number) => [`$${v}`, 'Revenue']}
                contentStyle={{ border: 'none', borderRadius: '12px', background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#2C1810" strokeWidth={2.5} dot={{ fill: '#C4A882', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[rgba(44,24,16,0.06)]">
          <h3 className="font-medium text-[#2C1810] mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryData} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11, fill: '#8B5E3C' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#8B5E3C' }} axisLine={false} tickLine={false} width={80} />
              <Tooltip
                formatter={(v: number) => [`${v}%`, 'Share']}
                contentStyle={{ border: 'none', borderRadius: '12px', background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="value" fill="#C4A882" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders + top products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-[rgba(44,24,16,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-[#2C1810]">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs text-[#8B5E3C] flex items-center gap-1 hover:text-[#2C1810]">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(44,24,16,0.08)]">
                  <th className="text-left text-xs text-[#8B5E3C] pb-2 font-normal">Order ID</th>
                  <th className="text-left text-xs text-[#8B5E3C] pb-2 font-normal">Customer</th>
                  <th className="text-left text-xs text-[#8B5E3C] pb-2 font-normal">Date</th>
                  <th className="text-left text-xs text-[#8B5E3C] pb-2 font-normal">Status</th>
                  <th className="text-right text-xs text-[#8B5E3C] pb-2 font-normal">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className="border-b border-[rgba(44,24,16,0.05)] hover:bg-[#FAF3EB] transition-colors">
                    <td className="py-2.5 text-[#2C1810] font-mono text-xs">{order.id}</td>
                    <td className="py-2.5 text-[#2C1810]">{order.customerName}</td>
                    <td className="py-2.5 text-[#8B5E3C] text-xs">{order.date}</td>
                    <td className="py-2.5">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right text-[#2C1810] font-medium">${order.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[rgba(44,24,16,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-[#2C1810]">Top Products</h3>
            <Link to="/admin/inventory" className="text-xs text-[#8B5E3C] flex items-center gap-1 hover:text-[#2C1810]">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-xs text-[#8B5E3C] w-4">{i + 1}.</span>
                <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#2C1810] truncate">{p.name}</p>
                  <p className="text-xs text-[#8B5E3C]">{p.reviewCount} reviews</p>
                </div>
                <span className="text-xs font-medium text-[#2C1810]">${p.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low stock alert */}
      {lowStock > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Package size={16} className="text-amber-600" />
            <h3 className="text-sm font-medium text-amber-800">Low Stock Alert</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {products.filter(p => p.stock <= 15).map(p => (
              <span key={p.id} className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                {p.name} ({p.stock} left)
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
