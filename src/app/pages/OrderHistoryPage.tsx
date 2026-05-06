import { useState } from 'react';
import { Package, ShoppingBag, ChevronDown, ChevronUp, ArrowLeft, Clock, Truck, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Link, useOutletContext } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { orders } from '../data/mockData';

const statusConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  Pending:    { icon: <Clock size={13} />,        color: 'text-amber-700',   bg: 'bg-amber-100' },
  Processing: { icon: <AlertCircle size={13} />,  color: 'text-blue-700',    bg: 'bg-blue-100' },
  Shipped:    { icon: <Truck size={13} />,         color: 'text-purple-700',  bg: 'bg-purple-100' },
  Completed:  { icon: <CheckCircle size={13} />,   color: 'text-[#4A6741]',   bg: 'bg-[#4A6741]/10' },
  Cancelled:  { icon: <XCircle size={13} />,       color: 'text-red-700',     bg: 'bg-red-100' },
};

export function OrderHistoryPage() {
  const { user, isAuthenticated } = useAuth();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const { onAuthOpen } = useOutletContext<{ onCartOpen: () => void; onAuthOpen: () => void }>();

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#FAF3EB] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-[#F0E4D4] flex items-center justify-center mx-auto mb-6">
            <Package size={32} className="text-[#C4A882]" />
          </div>
          <h1 className="font-serif text-3xl text-[#2C1810] mb-3">Your Orders</h1>
          <p className="text-[#8B5E3C] mb-6">
            Sign in to your account to view your order history, track deliveries, and manage your purchases.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={onAuthOpen}
              className="w-full py-3 bg-[#2C1810] text-[#FAF3EB] rounded-full text-sm font-medium hover:bg-[#3D2318] transition-colors"
            >
              Sign In to View Orders
            </button>
            <Link to="/shop" className="w-full py-3 border border-[rgba(44,24,16,0.12)] text-[#8B5E3C] rounded-full text-sm hover:bg-[#F0E4D4] transition-colors">
              Browse Coffee
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter orders for logged-in user (or show all for admins)
  const userOrders = user.role === 'Admin'
    ? [...orders].sort((a, b) => b.date.localeCompare(a.date))
    : orders.filter(o => o.customerEmail === user.email).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="min-h-screen bg-[#FAF3EB]">
      {/* Header */}
      <div className="bg-[#2C1810] text-[#FAF3EB] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-[#C4A882] hover:text-[#FAF3EB] text-sm mb-4 transition-colors">
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <h1 className="font-serif text-4xl mb-1">My Orders</h1>
          <p className="text-[#C4A882]">Hello, {user.name.split(' ')[0]} — here's your order history.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {userOrders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={48} className="text-[#C4A882] mx-auto mb-4" />
            <h2 className="font-serif text-2xl text-[#2C1810] mb-2">No orders yet</h2>
            <p className="text-[#8B5E3C] mb-6">
              Your order history will appear here once you've made your first purchase.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2C1810] text-[#FAF3EB] rounded-full text-sm font-medium hover:bg-[#3D2318] transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-[#8B5E3C]">
              {userOrders.length} order{userOrders.length !== 1 ? 's' : ''} total
            </p>

            {userOrders.map(order => {
              const status = statusConfig[order.status] || statusConfig.Pending;
              const isExpanded = expandedOrder === order.id;

              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-[rgba(44,24,16,0.08)] overflow-hidden">
                  {/* Order Header */}
                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    className="w-full px-5 py-4 flex items-center gap-4 hover:bg-[#FAF3EB] transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-sm text-[#2C1810]">{order.id}</span>
                        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${status.bg} ${status.color}`}>
                          {status.icon}
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[#8B5E3C] flex-wrap">
                        <span>{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span>·</span>
                        <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                        <span>·</span>
                        <span className="font-medium text-[#2C1810]">${order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Product thumbnails */}
                    <div className="hidden sm:flex items-center -space-x-2">
                      {order.items.slice(0, 3).map((item, i) => (
                        <img
                          key={i}
                          src={item.image}
                          alt={item.productName}
                          className="w-8 h-8 rounded-lg object-cover border-2 border-white"
                        />
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-8 h-8 rounded-lg bg-[#F0E4D4] border-2 border-white flex items-center justify-center">
                          <span className="text-xs text-[#8B5E3C]">+{order.items.length - 3}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-[#8B5E3C] shrink-0 ml-2">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  {/* Expanded order details */}
                  {isExpanded && (
                    <div className="border-t border-[rgba(44,24,16,0.08)] px-5 py-4">
                      {/* Order items */}
                      <div className="space-y-3 mb-5">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="w-12 h-12 rounded-xl object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-[#2C1810] truncate">{item.productName}</p>
                              <p className="text-xs text-[#8B5E3C]">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                            </div>
                            <span className="text-sm font-medium text-[#2C1810] shrink-0">
                              ${(item.quantity * item.price).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Totals + address */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-[#F0E4D4] rounded-xl p-4">
                          <p className="text-xs text-[#8B5E3C] mb-2 uppercase tracking-wider">Shipping Address</p>
                          <p className="text-sm text-[#2C1810]">
                            {order.customerName}<br />
                            {order.shippingAddress.street}<br />
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
                            {order.shippingAddress.country}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-[#8B5E3C]">
                            <span>Subtotal</span>
                            <span>${order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm text-[#8B5E3C]">
                            <span>Shipping</span>
                            <span>
                              {order.shipping === 0
                                ? <span className="text-[#4A6741]">Free</span>
                                : `$${order.shipping.toFixed(2)}`
                              }
                            </span>
                          </div>
                          <div className="flex justify-between text-sm font-medium text-[#2C1810] pt-2 border-t border-[rgba(44,24,16,0.08)]">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                          </div>

                          {['Pending', 'Processing'].includes(order.status) && (
                            <div className="pt-2">
                              <span className="inline-flex items-center gap-1.5 text-xs text-[#4A6741] bg-[#4A6741]/10 px-3 py-1.5 rounded-full">
                                <Truck size={12} />
                                Order is being prepared
                              </span>
                            </div>
                          )}
                          {order.status === 'Shipped' && (
                            <div className="pt-2">
                              <span className="inline-flex items-center gap-1.5 text-xs text-purple-700 bg-purple-100 px-3 py-1.5 rounded-full">
                                <Truck size={12} />
                                On its way to you!
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}