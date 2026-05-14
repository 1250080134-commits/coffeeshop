import { useState, useEffect } from 'react';
import { TrendingUp, Package, ShoppingBag, Users, ArrowUpRight, Coffee } from 'lucide-react';
import { Link } from 'react-router';
import { api, ApiOrder, ApiProduct } from '../../services/api';
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
  Pending:    'bg-amber-100 text-amber-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped:    'bg-purple-100 text-purple-700',
  Completed:  'bg-[#4A6741]/10 text-[#4A6741]',
  Cancelled:  'bg-red-100 text-red-700',
};

export function AdminDashboard() {
  const [orders,   setOrders]   = useState<ApiOrder[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.orders.getAll({ limit: 100 }),
      api.products.getAll({ limit: 100 }),
      api.users.getAll({ limit: 1 }),
    ]).then(([ordRes, prodRes, userRes]) => {
      setOrders(ordRes.data);
      setProducts(prodRes.data);
      setUserCount(userRes.pagination?.total ?? 0);
    }).catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const totalRevenue  = orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + parseFloat(o.total), 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const lowStock      = products.filter(p => p.stock <= 15).length;

  const recentOrders  = [...orders].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5);
  const topProducts   = [...products].sort((a, b) => (b.review_count ?? 0) - (a.review_count ?? 0)).slice(0, 5);

  if (isLoading) {
    return <div className="text-center py-20 text-[#8B5E3C]">Loading dashboard…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-[#2C1810]">Dashboard</h1>
        <p className="text-sm text-[#8B5E3C]">Welcome back. Here's what's happening at the Hub.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue',   value: `$${totalRevenue.toFixed(0)}`,  icon: <TrendingUp size={18} />, color: 'text-[#4A6741]', bg: 'bg-[#4A6741]/10' },
          { label: 'Pending Orders',  value: pendingOrders,                   icon: <ShoppingBag size={18} />, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Low Stock Items', value: lowStock,                        icon: <Package size={18} />,    color: 'text-red-600',   bg: 'bg-red-50' },
          { label: 'Total Customers', value: userCount,                       icon: <Users size={18} />,      color: 'text-blue-600',  bg: 'bg-blue-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-[rgba(44,24,16,0.06)]">
            <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-semibold text-[#2C1810]">{stat.value}</p>
            <p className="text-xs text-[#8B5E3C] mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-[rgba(44,24,16,0.06)]">
          <h3 className="text-sm font-medium text-[#2C1810] mb-4">Monthly Revenue (Static Preview)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E4D4" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8B5E3C' }} />
              <YAxis tick={{ fontSize: 11, fill: '#8B5E3C' }} />
              <Tooltip formatter={(v: number) => [`$${v}`, 'Revenue']} contentStyle={{ borderRadius: '8px', border: '1px solid #F0E4D4' }} />
              <Line type="monotone" dataKey="revenue" stroke="#2C1810" strokeWidth={2} dot={{ fill: '#C4A882', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[rgba(44,24,16,0.06)]">
          <h3 className="text-sm font-medium text-[#2C1810] mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11, fill: '#8B5E3C' }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#8B5E3C' }} width={80} />
              <Tooltip formatter={(v: number) => [`${v}%`, 'Share']} contentStyle={{ borderRadius: '8px' }} />
              <Bar dataKey="value" fill="#C4A882" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[rgba(44,24,16,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[#2C1810]">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs text-[#8B5E3C] hover:text-[#2C1810] flex items-center gap-1">View all <ArrowUpRight size={11} /></Link>
          </div>
          <div className="space-y-2.5">
            {recentOrders.length === 0 ? (
              <p className="text-xs text-[#8B5E3C]">No orders yet.</p>
            ) : recentOrders.map(o => (
              <div key={o.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-[#2C1810] font-medium">Order #{o.id}</p>
                  <p className="text-xs text-[#8B5E3C]">{new Date(o.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[o.status] ?? ''}`}>{o.status}</span>
                  <p className="text-xs text-[#8B5E3C] mt-0.5">${parseFloat(o.total).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[rgba(44,24,16,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[#2C1810]">Top Products</h3>
            <Link to="/admin/inventory" className="text-xs text-[#8B5E3C] hover:text-[#2C1810] flex items-center gap-1">Manage <ArrowUpRight size={11} /></Link>
          </div>
          <div className="space-y-2.5">
            {topProducts.length === 0 ? (
              <p className="text-xs text-[#8B5E3C]">No products yet.</p>
            ) : topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 text-sm">
                <span className="text-[#8B5E3C] text-xs w-4">{i + 1}</span>
                <div className="w-8 h-8 rounded-lg bg-[#F0E4D4] flex items-center justify-center shrink-0">
                  <Coffee size={13} className="text-[#8B5E3C]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#2C1810] font-medium truncate">{p.name}</p>
                  <p className="text-xs text-[#8B5E3C]">{p.review_count} reviews</p>
                </div>
                <p className="text-xs font-medium text-[#2C1810]">${parseFloat(p.price).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
