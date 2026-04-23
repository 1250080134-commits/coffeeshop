import { useState } from 'react';
import { Search, ChevronDown, Eye, X } from 'lucide-react';
import { Order, orders as initialOrders } from '../../data/mockData';
import { toast } from 'sonner';

type Status = Order['status'];

const statuses: Status[] = ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'];

const statusColors: Record<Status, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Completed: 'bg-[#4A6741]/10 text-[#4A6741]',
  Cancelled: 'bg-red-100 text-red-700',
};

export function AdminOrders() {
  const [orderList, setOrderList] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<Status | 'All'>('All');
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  const updateStatus = (id: string, status: Status) => {
    setOrderList(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    toast.success(`Order ${id} updated to ${status}`);
  };

  const filtered = orderList.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl text-[#2C1810]">Orders</h1>
        <p className="text-sm text-[#8B5E3C]">{orderList.length} total orders</p>
      </div>

      {/* Status summary */}
      <div className="flex flex-wrap gap-2">
        {(['All', ...statuses] as const).map(s => {
          const count = s === 'All' ? orderList.length : orderList.filter(o => o.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-1.5 rounded-full text-xs transition-colors ${
                filterStatus === s
                  ? 'bg-[#2C1810] text-[#FAF3EB]'
                  : 'bg-white border border-[rgba(44,24,16,0.12)] text-[#8B5E3C] hover:bg-[#F0E4D4]'
              }`}
            >
              {s} ({count})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B5E3C]" />
        <input
          type="text"
          placeholder="Search by order ID or customer..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[rgba(44,24,16,0.12)] rounded-full text-sm text-[#2C1810] placeholder-[#8B5E3C]/60 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[rgba(44,24,16,0.06)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F5EBE0]">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-[#8B5E3C] font-medium">Order ID</th>
                <th className="text-left px-4 py-3 text-xs text-[#8B5E3C] font-medium">Customer</th>
                <th className="text-left px-4 py-3 text-xs text-[#8B5E3C] font-medium">Date</th>
                <th className="text-left px-4 py-3 text-xs text-[#8B5E3C] font-medium">Items</th>
                <th className="text-right px-4 py-3 text-xs text-[#8B5E3C] font-medium">Total</th>
                <th className="text-center px-4 py-3 text-xs text-[#8B5E3C] font-medium">Status</th>
                <th className="text-center px-4 py-3 text-xs text-[#8B5E3C] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id} className="border-t border-[rgba(44,24,16,0.05)] hover:bg-[#FAF3EB] transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-[#2C1810]">{order.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-[#2C1810]">{order.customerName}</p>
                    <p className="text-xs text-[#8B5E3C]">{order.customerEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#8B5E3C]">{order.date}</td>
                  <td className="px-4 py-3 text-xs text-[#8B5E3C]">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                  <td className="px-4 py-3 text-right font-medium text-[#2C1810]">${order.total.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={e => updateStatus(order.id, e.target.value as Status)}
                          className={`appearance-none pl-3 pr-7 py-1 rounded-full text-xs cursor-pointer ${statusColors[order.status]} focus:outline-none`}
                        >
                          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <button
                        onClick={() => setViewOrder(order)}
                        className="p-1.5 text-[#8B5E3C] hover:text-[#2C1810] rounded-lg hover:bg-[#F0E4D4] transition-colors"
                      >
                        <Eye size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-10 text-[#8B5E3C] text-sm">No orders found.</div>
        )}
      </div>

      {/* Order Detail Modal */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[rgba(44,24,16,0.08)]">
              <div>
                <h2 className="font-medium text-[#2C1810]">{viewOrder.id}</h2>
                <p className="text-xs text-[#8B5E3C]">{viewOrder.date}</p>
              </div>
              <button onClick={() => setViewOrder(null)}>
                <X size={18} className="text-[#8B5E3C]" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              {/* Customer */}
              <div className="bg-[#F0E4D4] rounded-xl p-4">
                <p className="text-xs text-[#8B5E3C] mb-1">Customer</p>
                <p className="text-sm text-[#2C1810] font-medium">{viewOrder.customerName}</p>
                <p className="text-xs text-[#8B5E3C]">{viewOrder.customerEmail}</p>
              </div>

              {/* Shipping */}
              <div>
                <p className="text-xs text-[#8B5E3C] mb-2">Shipping Address</p>
                <p className="text-sm text-[#2C1810]">
                  {viewOrder.shippingAddress.street}<br />
                  {viewOrder.shippingAddress.city}, {viewOrder.shippingAddress.state} {viewOrder.shippingAddress.zip}<br />
                  {viewOrder.shippingAddress.country}
                </p>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs text-[#8B5E3C] mb-2">Order Items</p>
                <div className="space-y-2">
                  {viewOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-[rgba(44,24,16,0.06)]">
                      <img src={item.image} alt={item.productName} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-sm text-[#2C1810]">{item.productName}</p>
                        <p className="text-xs text-[#8B5E3C]">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium text-[#2C1810]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-[rgba(44,24,16,0.08)] pt-3 space-y-1">
                <div className="flex justify-between text-sm text-[#8B5E3C]">
                  <span>Subtotal</span>
                  <span>${viewOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#8B5E3C]">
                  <span>Shipping</span>
                  <span>{viewOrder.shipping === 0 ? 'Free' : `$${viewOrder.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-[#2C1810] font-medium pt-1 border-t border-[rgba(44,24,16,0.08)]">
                  <span>Total</span>
                  <span>${viewOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Status update */}
              <div>
                <p className="text-xs text-[#8B5E3C] mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {statuses.map(s => (
                    <button
                      key={s}
                      onClick={() => { updateStatus(viewOrder.id, s); setViewOrder(prev => prev ? { ...prev, status: s } : null); }}
                      className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                        viewOrder.status === s
                          ? `${statusColors[s]} ring-2 ring-offset-1 ring-current`
                          : 'bg-[#F0E4D4] text-[#8B5E3C] hover:bg-[#E8D0B5]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
