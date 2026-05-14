import { useState, useEffect } from 'react';
import { Package, ShoppingBag, ChevronDown, ChevronUp, ArrowLeft, Clock, Truck, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Link, useOutletContext } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { api, ApiOrder } from '../services/api';

const statusConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  Pending:    { icon: <Clock size={13} />,        color: 'text-amber-700',   bg: 'bg-amber-100' },
  Processing: { icon: <AlertCircle size={13} />,  color: 'text-blue-700',    bg: 'bg-blue-100' },
  Shipped:    { icon: <Truck size={13} />,         color: 'text-purple-700',  bg: 'bg-purple-100' },
  Completed:  { icon: <CheckCircle size={13} />,   color: 'text-[#4A6741]',   bg: 'bg-[#4A6741]/10' },
  Cancelled:  { icon: <XCircle size={13} />,       color: 'text-red-700',     bg: 'bg-red-100' },
};

export function OrderHistoryPage() {
  const { user, isAuthenticated } = useAuth();
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { onAuthOpen } = useOutletContext<{ onCartOpen: () => void; onAuthOpen: () => void }>();

  useEffect(() => {
    if (!isAuthenticated) { setIsLoading(false); return; }
    setIsLoading(true);
    api.orders.getMyOrders()
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

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

  return (
    <div className="min-h-screen bg-[#FAF3EB]">
      {/* Header */}
      <div className="bg-[#2C1810] text-[#FAF3EB] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-[#C4A882] hover:text-[#FAF3EB] text-sm mb-4 transition-colors">
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <h1 className="font-serif text-4xl mb-1">My Orders</h1>
          <p className="text-[#C4A882]">Hello, {user.username} — here's your order history.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-20 text-[#8B5E3C]">Loading your orders…</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={48} className="text-[#C4A882] mx-auto mb-4" />
            <h2 className="font-serif text-2xl text-[#2C1810] mb-2">No orders yet</h2>
            <p className="text-[#8B5E3C] mb-6">
              When you place an order, it will appear here.
            </p>
            <Link to="/shop" className="inline-block px-6 py-3 bg-[#2C1810] text-[#FAF3EB] rounded-full text-sm font-medium hover:bg-[#3D2318] transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const config = statusConfig[order.status] ?? statusConfig['Pending'];
              const isOpen = expandedOrder === order.id;
              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {/* Order header */}
                  <button
                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-[#FAF3EB]/50 transition-colors"
                    onClick={() => setExpandedOrder(isOpen ? null : order.id)}
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div>
                        <p className="font-semibold text-[#2C1810] text-sm">Order #{order.id}</p>
                        <p className="text-xs text-[#8B5E3C] mt-0.5">
                          {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.color} ${config.bg}`}>
                        {config.icon}
                        {order.status}
                      </span>
                      <span className="font-semibold text-[#2C1810]">${parseFloat(order.total).toFixed(2)}</span>
                      {isOpen ? <ChevronUp size={16} className="text-[#8B5E3C]" /> : <ChevronDown size={16} className="text-[#8B5E3C]" />}
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isOpen && (
                    <div className="border-t border-[#F0E4D4] px-6 py-5 space-y-4">
                      {order.orderDetails && order.orderDetails.length > 0 ? (
                        <div className="space-y-3">
                          {order.orderDetails.map(detail => (
                            <div key={detail.id} className="flex items-center gap-4">
                              {detail.product?.image_url ? (
                                <img src={detail.product.image_url} alt={detail.product.name} className="w-12 h-12 rounded-xl object-cover bg-[#F0E4D4]" />
                              ) : (
                                <div className="w-12 h-12 rounded-xl bg-[#F0E4D4] flex items-center justify-center">
                                  <Package size={16} className="text-[#C4A882]" />
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="text-sm font-medium text-[#2C1810]">{detail.product?.name ?? `Product #${detail.product_id}`}</p>
                                <p className="text-xs text-[#8B5E3C]">Qty: {detail.quantity} × ${parseFloat(detail.unit_price).toFixed(2)}</p>
                              </div>
                              <p className="text-sm font-semibold text-[#2C1810]">
                                ${(detail.quantity * parseFloat(detail.unit_price)).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-[#8B5E3C]">No item details available.</p>
                      )}

                      <div className="pt-3 border-t border-[#F0E4D4] text-sm space-y-1">
                        <div className="flex justify-between text-[#8B5E3C]">
                          <span>Subtotal</span>
                          <span>${parseFloat(order.subtotal).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[#8B5E3C]">
                          <span>Shipping</span>
                          <span>{parseFloat(order.shipping_cost) === 0 ? 'Free' : `$${parseFloat(order.shipping_cost).toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-[#2C1810] pt-1">
                          <span>Total</span>
                          <span>${parseFloat(order.total).toFixed(2)}</span>
                        </div>
                      </div>

                      {order.shipping_address && (
                        <div className="pt-2 text-xs text-[#8B5E3C]">
                          <p className="font-medium text-[#2C1810] mb-0.5">Shipped to</p>
                          <p>{order.shipping_address.street}, {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}</p>
                        </div>
                      )}
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
