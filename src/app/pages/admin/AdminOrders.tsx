import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { api, ApiOrder } from '../../services/api';
import { toast } from 'sonner';

const statusOptions = ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'] as const;
type OrderStatus = typeof statusOptions[number];

const statusColors: Record<OrderStatus, string> = {
  Pending:    'bg-amber-100 text-amber-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped:    'bg-purple-100 text-purple-700',
  Completed:  'bg-[#4A6741]/10 text-[#4A6741]',
  Cancelled:  'bg-red-100 text-red-700',
};

export function AdminOrders() {
  const [orders, setOrders]   = useState<ApiOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'All'>('All');

  useEffect(() => {
    api.orders.getAll({ limit: 200 })
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setIsLoading(false));
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {
      const updated = await api.orders.updateStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? updated.data : o));
      toast.success(`Order #${orderId} → ${newStatus}`);
    } catch {
      toast.error('Failed to update status.');
    }
  };

  const filtered = orders.filter(o => {
    const matchStatus = filterStatus === 'All' || o.status === filterStatus;
    const matchSearch = !searchQuery || String(o.id).includes(searchQuery) || o.customer?.email?.includes(searchQuery) || o.customer?.username?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-[#2C1810]">Orders</h1>
        <p className="text-sm text-[#8B5E3C]">Manage and fulfill customer orders.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E3C]" />
          <input
            type="text"
            placeholder="Search by order ID or customer…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[rgba(44,24,16,0.12)] rounded-xl text-sm text-[#2C1810] placeholder-[#8B5E3C]/50 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/20"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as OrderStatus | 'All')}
          className="px-4 py-2.5 bg-white border border-[rgba(44,24,16,0.12)] rounded-xl text-sm text-[#2C1810] focus:outline-none"
        >
          <option value="All">All Statuses</option>
          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-[#8B5E3C]">Loading orders…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-[#8B5E3C]">No orders found.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-[rgba(44,24,16,0.06)] overflow-hidden">
              <button
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#FAF3EB]/50 transition-colors"
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-5 text-left flex-wrap">
                  <p className="text-sm font-medium text-[#2C1810]">Order #{order.id}</p>
                  <p className="text-xs text-[#8B5E3C]">{order.customer?.username ?? '—'} · {order.customer?.email ?? ''}</p>
                  <p className="text-xs text-[#8B5E3C]">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusColors[order.status as OrderStatus] ?? ''}`}>{order.status}</span>
                  <span className="text-sm font-semibold text-[#2C1810]">${parseFloat(order.total).toFixed(2)}</span>
                  {expandedId === order.id ? <ChevronUp size={15} className="text-[#8B5E3C]" /> : <ChevronDown size={15} className="text-[#8B5E3C]" />}
                </div>
              </button>

              {expandedId === order.id && (
                <div className="border-t border-[#F0E4D4] px-5 py-4 space-y-4">
                  {/* Status update */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="text-xs text-[#8B5E3C]">Update status:</p>
                    {statusOptions.map(s => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(order.id, s)}
                        className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                          order.status === s
                            ? `${statusColors[s]} border-transparent font-medium`
                            : 'border-[rgba(44,24,16,0.12)] text-[#8B5E3C] hover:bg-[#F0E4D4]'
                        }`}
                      >{s}</button>
                    ))}
                  </div>

                  {/* Order items */}
                  {order.orderDetails && order.orderDetails.length > 0 && (
                    <div className="space-y-2">
                      {order.orderDetails.map(d => (
                        <div key={d.id} className="flex items-center justify-between text-sm">
                          <span className="text-[#2C1810]">{d.product?.name ?? `Product #${d.product_id}`}</span>
                          <span className="text-[#8B5E3C]">×{d.quantity} @ ${parseFloat(d.unit_price).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Shipping */}
                  {order.shipping_address && (
                    <p className="text-xs text-[#8B5E3C]">
                      Ship to: {order.shipping_address.street}, {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
