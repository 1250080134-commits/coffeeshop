import { useState } from 'react';
import { ArrowLeft, CheckCircle, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { products } from '../data/mockData';

type Step = 'shipping' | 'review' | 'confirmation';

interface ShippingForm {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const initialForm: ShippingForm = {
  firstName: '', lastName: '', email: '',
  street: '', city: '', state: '', zip: '', country: 'USA',
};

export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('shipping');
  const [form, setForm] = useState<ShippingForm>(initialForm);
  const [errors, setErrors] = useState<Partial<ShippingForm>>({});
  const [orderId] = useState(`ORD-2024-${String(Math.floor(Math.random() * 900) + 100)}`);

  const shipping = subtotal >= 75 ? 0 : 5.99;
  const total = subtotal + shipping;

  // Stock validation
  const stockIssues = items.filter(item => {
    const prod = products.find(p => p.id === item.product.id);
    return prod && prod.stock < item.quantity;
  });

  const validate = (): boolean => {
    const newErrors: Partial<ShippingForm> = {};
    if (!form.firstName.trim()) newErrors.firstName = 'Required';
    if (!form.lastName.trim()) newErrors.lastName = 'Required';
    if (!form.email.includes('@')) newErrors.email = 'Valid email required';
    if (!form.street.trim()) newErrors.street = 'Required';
    if (!form.city.trim()) newErrors.city = 'Required';
    if (!form.state.trim()) newErrors.state = 'Required';
    if (!form.zip.trim()) newErrors.zip = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (stockIssues.length > 0) {
      toast.error('Some items are out of stock. Please update your cart.');
      return;
    }
    if (validate()) setStep('review');
  };

  const handlePlaceOrder = () => {
    clearCart();
    setStep('confirmation');
    toast.success('Order placed successfully!');
  };

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-screen bg-[#FAF3EB] flex items-center justify-center px-4">
        <div className="text-center">
          <Package size={48} className="text-[#C4A882] mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-[#2C1810] mb-2">Your cart is empty</h2>
          <p className="text-[#8B5E3C] mb-6">Add some great coffee before checking out.</p>
          <Link to="/shop" className="px-6 py-3 bg-[#2C1810] text-[#FAF3EB] rounded-full text-sm">
            Browse Coffee
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-[#FAF3EB] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-3xl p-10 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-[#4A6741]/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-[#4A6741]" />
          </div>
          <h1 className="font-serif text-3xl text-[#2C1810] mb-2">Order Confirmed!</h1>
          <p className="text-[#8B5E3C] mb-2">Thank you, <strong>{form.firstName}</strong>!</p>
          <p className="text-sm text-[#8B5E3C] mb-6">
            Your order <strong className="text-[#2C1810]">{orderId}</strong> has been placed and is being processed.
            A confirmation will be sent to <strong>{form.email}</strong>.
          </p>
          <div className="bg-[#F0E4D4] rounded-2xl p-4 mb-6 text-left">
            <p className="text-xs text-[#8B5E3C] mb-1">Shipping to</p>
            <p className="text-sm text-[#2C1810]">
              {form.firstName} {form.lastName}<br />
              {form.street}, {form.city}, {form.state} {form.zip}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link to="/shop" className="w-full py-3 bg-[#2C1810] text-[#FAF3EB] rounded-full text-sm font-medium">
              Continue Shopping
            </Link>
            <Link to="/" className="w-full py-3 border border-[rgba(44,24,16,0.12)] text-[#8B5E3C] rounded-full text-sm">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const Field = ({ label, name, type = 'text', half = false }: { label: string; name: keyof ShippingForm; type?: string; half?: boolean }) => (
    <div className={half ? 'flex-1' : 'w-full'}>
      <label className="block text-xs text-[#8B5E3C] mb-1">{label}</label>
      <input
        type={type}
        value={form[name]}
        onChange={e => {
          setForm(prev => ({ ...prev, [name]: e.target.value }));
          if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
        }}
        className={`w-full px-4 py-2.5 bg-[#F5EBE0] border rounded-xl text-sm text-[#2C1810] placeholder-[#8B5E3C]/50 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30 ${
          errors[name] ? 'border-red-400' : 'border-transparent'
        }`}
      />
      {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF3EB] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-[#8B5E3C] hover:text-[#2C1810] mb-6">
          <ArrowLeft size={15} /> Back
        </button>

        <h1 className="font-serif text-3xl text-[#2C1810] mb-6">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-3 mb-8">
          {['Shipping', 'Review'].map((s, i) => {
            const stepKey = s.toLowerCase() as Step;
            const active = step === stepKey;
            const done = (step === 'review' && i === 0);
            return (
              <div key={s} className="flex items-center gap-3">
                <div className={`flex items-center gap-2 text-sm ${active ? 'text-[#2C1810]' : done ? 'text-[#4A6741]' : 'text-[#8B5E3C]'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${active ? 'bg-[#2C1810] text-white' : done ? 'bg-[#4A6741] text-white' : 'bg-[#F0E4D4] text-[#8B5E3C]'}`}>
                    {done ? '✓' : i + 1}
                  </div>
                  {s}
                </div>
                {i < 1 && <div className="w-8 h-px bg-[rgba(44,24,16,0.12)]" />}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2">
            {step === 'shipping' && (
              <form onSubmit={handleShippingSubmit} className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-medium text-[#2C1810] mb-5">Shipping Information</h2>

                {stockIssues.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 text-sm text-red-700">
                    <strong>Stock issue:</strong> {stockIssues.map(i => i.product.name).join(', ')} {stockIssues.length === 1 ? 'has' : 'have'} insufficient stock. Please update your cart.
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Field label="First Name" name="firstName" half />
                    <Field label="Last Name" name="lastName" half />
                  </div>
                  <Field label="Email Address" name="email" type="email" />
                  <Field label="Street Address" name="street" />
                  <div className="flex gap-4">
                    <Field label="City" name="city" half />
                    <Field label="State" name="state" half />
                  </div>
                  <div className="flex gap-4">
                    <Field label="ZIP Code" name="zip" half />
                    <div className="flex-1">
                      <label className="block text-xs text-[#8B5E3C] mb-1">Country</label>
                      <select
                        value={form.country}
                        onChange={e => setForm(prev => ({ ...prev, country: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-[#F5EBE0] border border-transparent rounded-xl text-sm text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30"
                      >
                        <option>USA</option>
                        <option>Canada</option>
                        <option>UK</option>
                        <option>Australia</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full py-3.5 bg-[#2C1810] text-[#FAF3EB] rounded-full font-medium hover:bg-[#3D2318] transition-colors"
                >
                  Continue to Review
                </button>
              </form>
            )}

            {step === 'review' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-medium text-[#2C1810] mb-5">Review Your Order</h2>

                <div className="bg-[#F0E4D4] rounded-xl p-4 mb-5">
                  <p className="text-xs text-[#8B5E3C] mb-1">Shipping to</p>
                  <p className="text-sm text-[#2C1810]">
                    {form.firstName} {form.lastName} · {form.email}
                  </p>
                  <p className="text-sm text-[#8B5E3C]">
                    {form.street}, {form.city}, {form.state} {form.zip}, {form.country}
                  </p>
                  <button onClick={() => setStep('shipping')} className="text-xs text-[#8B5E3C] underline mt-1">
                    Edit
                  </button>
                </div>

                <div className="space-y-3 mb-5">
                  {items.map(item => (
                    <div key={item.product.id} className="flex items-center gap-3 py-2 border-b border-[rgba(44,24,16,0.08)]">
                      <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-sm text-[#2C1810]">{item.product.name}</p>
                        <p className="text-xs text-[#8B5E3C]">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm text-[#2C1810] font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full py-3.5 bg-[#4A6741] text-white rounded-full font-medium hover:bg-[#3d5836] transition-colors"
                >
                  Place Order — ${total.toFixed(2)}
                </button>
                <p className="text-xs text-center text-[#8B5E3C] mt-3">
                  This is a demo — no real payment or order is processed.
                </p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-24">
              <h3 className="font-medium text-[#2C1810] mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                {items.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm text-[#8B5E3C]">
                    <span className="truncate mr-2">{item.product.name} ×{item.quantity}</span>
                    <span className="shrink-0">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[rgba(44,24,16,0.08)] pt-3 space-y-2">
                <div className="flex justify-between text-sm text-[#8B5E3C]">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#8B5E3C]">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-[#4A6741]">Free</span> : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-medium text-[#2C1810] pt-2 border-t border-[rgba(44,24,16,0.08)]">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
