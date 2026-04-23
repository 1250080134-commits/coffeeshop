import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();
  const shipping = subtotal >= 75 ? 0 : 5.99;
  const total = subtotal + shipping;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#FAF3EB] z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(44,24,16,0.12)] bg-[#2C1810] text-[#FAF3EB]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} />
            <h2 className="text-lg">Your Cart</h2>
            {totalItems > 0 && (
              <span className="bg-[#4A6741] text-white text-xs px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-[#3D2318] transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-20 h-20 rounded-full bg-[#F0E4D4] flex items-center justify-center">
                <ShoppingBag size={32} className="text-[#C4A882]" />
              </div>
              <div>
                <p className="text-[#2C1810] font-medium">Your cart is empty</p>
                <p className="text-sm text-[#8B5E3C] mt-1">Add some exceptional beans to get started.</p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#2C1810] text-[#FAF3EB] rounded-full text-sm hover:bg-[#3D2318] transition-colors"
              >
                Browse Coffee
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {subtotal < 75 && (
                <div className="bg-[#F0E4D4] rounded-xl p-3 text-sm text-[#8B5E3C]">
                  Add <span className="font-medium text-[#2C1810]">${(75 - subtotal).toFixed(2)}</span> more for free shipping!
                  <div className="mt-2 h-1.5 rounded-full bg-[#E8D0B5]">
                    <div
                      className="h-full bg-[#4A6741] rounded-full transition-all"
                      style={{ width: `${Math.min((subtotal / 75) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
              {subtotal >= 75 && (
                <div className="bg-[#4A6741]/10 border border-[#4A6741]/30 rounded-xl p-3 text-sm text-[#4A6741]">
                  You've unlocked free shipping!
                </div>
              )}

              {items.map(item => (
                <div key={item.product.id} className="flex gap-3 bg-white rounded-xl p-3 shadow-sm">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#2C1810] font-medium leading-tight">{item.product.name}</p>
                    <p className="text-xs text-[#8B5E3C] mt-0.5">
                      {item.product.roastLevel ? `${item.product.roastLevel} Roast` : item.product.categoryName}
                      {item.product.weight && ` · ${item.product.weight}`}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-[#F0E4D4] rounded-full px-1 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#E8D0B5] transition-colors"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="text-sm text-[#2C1810] w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#E8D0B5] disabled:opacity-40 transition-colors"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#2C1810]">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[#8B5E3C] hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[rgba(44,24,16,0.12)] bg-white">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-[#8B5E3C]">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-[#8B5E3C]">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-[#4A6741]">Free</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-[#2C1810] font-medium pt-2 border-t border-[rgba(44,24,16,0.12)]">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              onClick={onClose}
              className="block w-full text-center py-3 bg-[#2C1810] text-[#FAF3EB] rounded-full hover:bg-[#3D2318] transition-colors text-sm font-medium"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
