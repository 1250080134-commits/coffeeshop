import { useState } from 'react';
import { ArrowLeft, CheckCircle, Package, CreditCard, Smartphone, DollarSign, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { api, ApiError } from '../services/api';

type Step = 'shipping' | 'payment' | 'review' | 'confirmation';

interface ShippingForm {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  ward: string;
  city: string;
  province: string;
  zip: string;
  country: string;
}

interface PaymentForm {
  method: 'card' | 'paypal' | 'applepay';
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
}

const initialShipping: ShippingForm = {
  firstName: '', lastName: '', email: '',
  street: '', ward: '', city: '', province: '', zip: '', country: 'Việt Nam',
};

const initialPayment: PaymentForm = {
  method: 'card',
  cardName: '', cardNumber: '', cardExpiry: '', cardCvv: '',
};

const STEPS: { key: Step; label: string }[] = [
  { key: 'shipping', label: 'Shipping' },
  { key: 'payment', label: 'Payment' },
  { key: 'review', label: 'Review' },
];

export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('shipping');
  const [shipping, setShipping] = useState<ShippingForm>(() => ({
    ...initialShipping,
    firstName: user?.username || '',
    lastName: '',
    email: user?.email || '',
  }));
  const [payment, setPayment] = useState<PaymentForm>(initialPayment);
  const [shippingErrors, setShippingErrors] = useState<Partial<ShippingForm>>({});
  const [paymentErrors, setPaymentErrors] = useState<Partial<PaymentForm>>({});
  const [placedOrderId, setPlacedOrderId] = useState<number | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const shippingCost = subtotal >= 75 ? 0 : 5.99;
  const total = subtotal + shippingCost;

  // Real-time stock validation — use live cart data
  const stockIssues = items.filter(item => item.quantity > item.product.stock);

  // ── Validation ─────────────────────────────────────────────────────────────
  const validateShipping = (): boolean => {
    const errs: Partial<ShippingForm> = {};
    if (!shipping.firstName.trim()) errs.firstName = 'Required';
    if (!shipping.lastName.trim()) errs.lastName = 'Required';
    if (!shipping.email.includes('@')) errs.email = 'Valid email required';
    if (!shipping.street.trim()) errs.street = 'Required';
    if (!shipping.ward.trim()) errs.ward = 'Required';
    if (!shipping.city.trim()) errs.city = 'Required';
    if (!shipping.province.trim()) errs.province = 'Required';
    if (!shipping.zip.trim()) errs.zip = 'Required';
    setShippingErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePayment = (): boolean => {
    if (payment.method !== 'card') return true;
    const errs: Partial<PaymentForm> = {};
    if (!payment.cardName.trim()) errs.cardName = 'Required';
    if (payment.cardNumber.replace(/\s/g, '').length < 16) errs.cardNumber = 'Enter a valid 16-digit card number';
    if (!payment.cardExpiry.match(/^\d{2}\/\d{2}$/)) errs.cardExpiry = 'Format: MM/YY';
    if (payment.cardCvv.length < 3) errs.cardCvv = 'Invalid CVV';
    setPaymentErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleShippingNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (stockIssues.length > 0) {
      toast.error('Some items are out of stock. Please update your cart.');
      return;
    }
    if (validateShipping()) setStep('payment');
  };

  const handlePaymentNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePayment()) setStep('review');
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const response = await api.orders.create({
        items: items.map(i => ({
          product_id:      i.product.id,
          quantity:        i.quantity,
          grind_size:      i.grindSize,
          selected_weight: i.selectedWeight,
        })),
        shipping_address: {
          street:   shipping.street,
          ward:     shipping.ward,
          city:     shipping.city,
          province: shipping.province,
          zip:      shipping.zip,
          country:  shipping.country,
        },
        payment_method: (payment.method as 'card' | 'paypal' | 'applepay') || 'card',
        notes: undefined,
      });
      setPlacedOrderId(response.data.id);
      clearCart();
      setStep('confirmation');
      toast.success('Order placed successfully!');
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        toast.error('Some items ran out of stock. Please review your cart.');
      } else if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error('Order could not be placed. Please try again.');
      }
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // ── Shared field component ─────────────────────────────────────────────────
  const ShipField = ({ label, name, type = 'text', half = false }: { label: string; name: keyof ShippingForm; type?: string; half?: boolean }) => (
    <div className={half ? 'flex-1' : 'w-full'}>
      <label className="block text-xs text-[#8B5E3C] mb-1">{label}</label>
      <input
        type={type}
        value={shipping[name]}
        onChange={e => {
          setShipping(prev => ({ ...prev, [name]: e.target.value }));
          if (shippingErrors[name]) setShippingErrors(prev => ({ ...prev, [name]: undefined }));
        }}
        className={`w-full px-4 py-2.5 bg-[#F5EBE0] border rounded-xl text-sm text-[#2C1810] placeholder-[#8B5E3C]/50 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30 ${
          shippingErrors[name] ? 'border-red-400' : 'border-transparent'
        }`}
      />
      {shippingErrors[name] && <p className="text-xs text-red-500 mt-1">{shippingErrors[name]}</p>}
    </div>
  );

  // ── Empty cart guard ───────────────────────────────────────────────────────
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

  // ── Confirmation screen ────────────────────────────────────────────────────
  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-[#FAF3EB] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-3xl p-10 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-[#4A6741]/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-[#4A6741]" />
          </div>
          <h1 className="font-serif text-3xl text-[#2C1810] mb-2">Order Confirmed!</h1>
          <p className="text-[#8B5E3C] mb-2">Thank you, <strong>{shipping.firstName}</strong>!</p>
          <p className="text-sm text-[#8B5E3C] mb-6">
            Your order <strong className="text-[#2C1810]">#{placedOrderId ?? '—'}</strong> has been placed.
            A confirmation will be sent to <strong>{shipping.email}</strong>.
          </p>
          <div className="bg-[#F0E4D4] rounded-2xl p-4 mb-6 text-left">
            <p className="text-xs text-[#8B5E3C] mb-1">Shipping to</p>
            <p className="text-sm text-[#2C1810]">
              {shipping.firstName} {shipping.lastName}<br />
              {shipping.street}, {shipping.ward}, {shipping.city}, {shipping.province} {shipping.zip}
            </p>
            <p className="text-xs text-[#8B5E3C] mt-2">
              Payment via {payment.method === 'card' ? 'Credit Card' : payment.method === 'paypal' ? 'PayPal' : 'Apple Pay'}
              {payment.method === 'card' && payment.cardNumber && ` ···· ${payment.cardNumber.replace(/\s/g, '').slice(-4)}`}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link to="/orders" className="w-full py-3 bg-[#4A6741] text-white rounded-full text-sm font-medium hover:bg-[#3d5836] transition-colors">
              View Order History
            </Link>
            <Link to="/shop" className="w-full py-3 bg-[#2C1810] text-[#FAF3EB] rounded-full text-sm font-medium hover:bg-[#3D2318] transition-colors">
              Continue Shopping
            </Link>
            <Link to="/" className="w-full py-3 border border-[rgba(44,24,16,0.12)] text-[#8B5E3C] rounded-full text-sm hover:bg-[#F0E4D4] transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Step indicator helper ──────────────────────────────────────────────────
  const stepIndex = STEPS.findIndex(s => s.key === step);

  return (
    <div className="min-h-screen bg-[#FAF3EB] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-[#8B5E3C] hover:text-[#2C1810] mb-6">
          <ArrowLeft size={15} /> Back
        </button>

        <h1 className="font-serif text-3xl text-[#2C1810] mb-6">Checkout</h1>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {STEPS.map((s, i) => {
            const isActive = step === s.key;
            const isDone = i < stepIndex;
            return (
              <div key={s.key} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 text-sm ${isActive ? 'text-[#2C1810]' : isDone ? 'text-[#4A6741]' : 'text-[#8B5E3C]'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                    isActive ? 'bg-[#2C1810] text-white' : isDone ? 'bg-[#4A6741] text-white' : 'bg-[#F0E4D4] text-[#8B5E3C]'
                  }`}>
                    {isDone ? '✓' : i + 1}
                  </div>
                  {s.label}
                </div>
                {i < STEPS.length - 1 && <div className="w-8 h-px bg-[rgba(44,24,16,0.12)]" />}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Main form ──────────────────────────────────────────────────── */}
          <div className="lg:col-span-2">

            {/* STEP 1: Shipping */}
            {step === 'shipping' && (
              <form onSubmit={handleShippingNext} className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-medium text-[#2C1810] mb-5">Shipping Information</h2>

                {stockIssues.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 text-sm text-red-700">
                    <strong>Stock issue:</strong> {stockIssues.map(i => i.product.name).join(', ')} {stockIssues.length === 1 ? 'has' : 'have'} insufficient stock.
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <ShipField label="Họ (Last Name)" name="lastName" half />
                    <ShipField label="Tên (First Name)" name="firstName" half />
                  </div>
                  <ShipField label="Email" name="email" type="email" />
                  <ShipField label="Số nhà, tên đường (Street Address)" name="street" />
                  <ShipField label="Phường/Xã (Ward/Commune)" name="ward" />
                  <div className="flex flex-col sm:flex-row gap-4">
                    <ShipField label="Quận/Huyện (District)" name="city" half />
                    <ShipField label="Tỉnh/Thành phố (Province/City)" name="province" half />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <ShipField label="Mã bưu chính (Postal Code)" name="zip" half />
                    <div className="flex-1">
                      <label className="block text-xs text-[#8B5E3C] mb-1">Quốc gia (Country)</label>
                      <select
                        value={shipping.country}
                        onChange={e => setShipping(prev => ({ ...prev, country: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-[#F5EBE0] border border-transparent rounded-xl text-sm text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30"
                      >
                        {['Việt Nam', 'USA', 'Canada', 'UK', 'Australia', 'Germany', 'France', 'Japan'].map(c => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full py-3.5 bg-[#2C1810] text-[#FAF3EB] rounded-full font-medium hover:bg-[#3D2318] transition-colors"
                >
                  Continue to Payment
                </button>
              </form>
            )}

            {/* STEP 2: Payment */}
            {step === 'payment' && (
              <form onSubmit={handlePaymentNext} className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-medium text-[#2C1810] mb-5">Payment Method</h2>

                {/* Method selection */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { id: 'card', icon: <CreditCard size={18} />, label: 'Card' },
                    { id: 'paypal', icon: <DollarSign size={18} />, label: 'PayPal' },
                    { id: 'applepay', icon: <Smartphone size={18} />, label: 'Apple Pay' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPayment(prev => ({ ...prev, method: opt.id as PaymentForm['method'] }))}
                      className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all ${
                        payment.method === opt.id
                          ? 'border-[#2C1810] bg-[#2C1810] text-[#FAF3EB]'
                          : 'border-[rgba(44,24,16,0.15)] text-[#8B5E3C] hover:border-[#8B5E3C]'
                      }`}
                    >
                      {opt.icon}
                      <span className="text-sm">{opt.label}</span>
                    </button>
                  ))}
                </div>

                {/* Credit card form */}
                {payment.method === 'card' && (
                  <div className="space-y-4">
                    <div
                      className="rounded-2xl p-5 mb-2"
                      style={{ background: 'linear-gradient(135deg, #2C1810 0%, #4a2c1e 60%, #3d5836 100%)' }}
                    >
                      <p className="text-[#C4A882] text-xs tracking-widest mb-6">FONDO</p>
                      <p className="text-[#FAF3EB] font-mono text-lg tracking-widest">
                        {payment.cardNumber
                          ? payment.cardNumber.replace(/(.{4})/g, '$1 ').trim()
                          : '•••• •••• •••• ••••'}
                      </p>
                      <div className="flex justify-between mt-4">
                        <div>
                          <p className="text-[#C4A882] text-xs">Card Holder</p>
                          <p className="text-[#FAF3EB] text-sm">{payment.cardName || 'YOUR NAME'}</p>
                        </div>
                        <div>
                          <p className="text-[#C4A882] text-xs">Expires</p>
                          <p className="text-[#FAF3EB] text-sm">{payment.cardExpiry || 'MM/YY'}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-[#8B5E3C] mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        value={payment.cardName}
                        onChange={e => { setPayment(p => ({ ...p, cardName: e.target.value })); setPaymentErrors(p => ({ ...p, cardName: '' })); }}
                        placeholder="Jane Doe"
                        className={`w-full px-4 py-2.5 bg-[#F5EBE0] border rounded-xl text-sm text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30 ${paymentErrors.cardName ? 'border-red-400' : 'border-transparent'}`}
                      />
                      {paymentErrors.cardName && <p className="text-xs text-red-500 mt-1">{paymentErrors.cardName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs text-[#8B5E3C] mb-1">Card Number</label>
                      <input
                        type="text"
                        value={payment.cardNumber}
                        onChange={e => {
                          const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                          const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
                          setPayment(p => ({ ...p, cardNumber: formatted }));
                          setPaymentErrors(p => ({ ...p, cardNumber: '' }));
                        }}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className={`w-full px-4 py-2.5 bg-[#F5EBE0] border rounded-xl text-sm text-[#2C1810] font-mono focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30 ${paymentErrors.cardNumber ? 'border-red-400' : 'border-transparent'}`}
                      />
                      {paymentErrors.cardNumber && <p className="text-xs text-red-500 mt-1">{paymentErrors.cardNumber}</p>}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block text-xs text-[#8B5E3C] mb-1">Expiry Date</label>
                        <input
                          type="text"
                          value={payment.cardExpiry}
                          onChange={e => {
                            let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                            if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                            setPayment(p => ({ ...p, cardExpiry: v }));
                            setPaymentErrors(p => ({ ...p, cardExpiry: '' }));
                          }}
                          placeholder="MM/YY"
                          maxLength={5}
                          className={`w-full px-4 py-2.5 bg-[#F5EBE0] border rounded-xl text-sm text-[#2C1810] font-mono focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30 ${paymentErrors.cardExpiry ? 'border-red-400' : 'border-transparent'}`}
                        />
                        {paymentErrors.cardExpiry && <p className="text-xs text-red-500 mt-1">{paymentErrors.cardExpiry}</p>}
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-[#8B5E3C] mb-1">CVV</label>
                        <input
                          type="text"
                          value={payment.cardCvv}
                          onChange={e => {
                            setPayment(p => ({ ...p, cardCvv: e.target.value.replace(/\D/g, '').slice(0, 4) }));
                            setPaymentErrors(p => ({ ...p, cardCvv: '' }));
                          }}
                          placeholder="123"
                          maxLength={4}
                          className={`w-full px-4 py-2.5 bg-[#F5EBE0] border rounded-xl text-sm text-[#2C1810] font-mono focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30 ${paymentErrors.cardCvv ? 'border-red-400' : 'border-transparent'}`}
                        />
                        {paymentErrors.cardCvv && <p className="text-xs text-red-500 mt-1">{paymentErrors.cardCvv}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#8B5E3C] bg-[#F0E4D4] rounded-xl p-3">
                      <Lock size={12} className="text-[#4A6741] shrink-0" />
                      Your payment info is encrypted and secure. This is a demo — no real charge is made.
                    </div>
                  </div>
                )}

                {/* PayPal mock */}
                {payment.method === 'paypal' && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-[#F0E4D4] flex items-center justify-center mx-auto mb-4">
                      <DollarSign size={28} className="text-[#2C6B8A]" />
                    </div>
                    <p className="text-[#2C1810] font-medium mb-2">Pay with PayPal</p>
                    <p className="text-sm text-[#8B5E3C] mb-4">
                      You'll be redirected to PayPal to complete your payment securely.
                    </p>
                    <div className="inline-flex items-center gap-2 text-xs text-[#8B5E3C] bg-[#F0E4D4] rounded-xl px-4 py-2">
                      <Lock size={12} className="text-[#4A6741]" />
                      Demo mode — no real redirect
                    </div>
                  </div>
                )}

                {/* Apple Pay mock */}
                {payment.method === 'applepay' && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-[#2C1810] flex items-center justify-center mx-auto mb-4">
                      <Smartphone size={28} className="text-white" />
                    </div>
                    <p className="text-[#2C1810] font-medium mb-2">Apple Pay / Google Pay</p>
                    <p className="text-sm text-[#8B5E3C] mb-4">
                      Use Face ID, Touch ID, or passcode to pay instantly on your device.
                    </p>
                    <button
                      type="button"
                      className="mx-auto block w-48 py-3 bg-[#2C1810] text-[#FAF3EB] rounded-full text-sm"
                    >
                      ⬛ Pay ${total.toFixed(2)}
                    </button>
                    <p className="text-xs text-[#8B5E3C] mt-3">Demo mode — click "Review Order" to continue</p>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="flex-1 py-3.5 border border-[rgba(44,24,16,0.12)] text-[#8B5E3C] rounded-full hover:bg-[#F0E4D4] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-3.5 bg-[#2C1810] text-[#FAF3EB] rounded-full font-medium hover:bg-[#3D2318] transition-colors"
                  >
                    Review Order
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Review */}
            {step === 'review' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-medium text-[#2C1810] mb-5">Review Your Order</h2>

                {/* Shipping summary */}
                <div className="bg-[#F0E4D4] rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-[#8B5E3C] uppercase tracking-wider">Shipping</p>
                    <button onClick={() => setStep('shipping')} className="text-xs text-[#8B5E3C] underline">Edit</button>
                  </div>
                  <p className="text-sm text-[#2C1810]">{shipping.firstName} {shipping.lastName} · {shipping.email}</p>
                  <p className="text-sm text-[#8B5E3C]">{shipping.street}, {shipping.ward}, {shipping.city}, {shipping.province} {shipping.zip}, {shipping.country}</p>
                </div>

                {/* Payment summary */}
                <div className="bg-[#F0E4D4] rounded-xl p-4 mb-5">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-[#8B5E3C] uppercase tracking-wider">Payment</p>
                    <button onClick={() => setStep('payment')} className="text-xs text-[#8B5E3C] underline">Edit</button>
                  </div>
                  <p className="text-sm text-[#2C1810] flex items-center gap-2">
                    {payment.method === 'card' && <><CreditCard size={13} /> Credit Card {payment.cardNumber && `···· ${payment.cardNumber.replace(/\s/g, '').slice(-4)}`}</>}
                    {payment.method === 'paypal' && <><DollarSign size={13} /> PayPal</>}
                    {payment.method === 'applepay' && <><Smartphone size={13} /> Apple Pay</>}
                  </p>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-5">
                  {items.map(item => (
                    <div key={item.cartKey} className="flex items-center gap-3 py-2 border-b border-[rgba(44,24,16,0.08)]">
                      <img src={item.product.image_url ?? 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&auto=format&fit=crop&q=80'} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-sm text-[#2C1810]">{item.product.name}</p>
                        <p className="text-xs text-[#8B5E3C]">
                          Qty: {item.quantity}
                          {item.grindSize && ` · ${item.grindSize}`}
                          {item.selectedWeight && ` · ${item.selectedWeight}`}
                        </p>
                      </div>
                      <span className="text-sm text-[#2C1810] font-medium">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="w-full py-3.5 bg-[#4A6741] text-white rounded-full font-medium hover:bg-[#3d5836] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPlacingOrder ? 'Placing Order…' : `Place Order — $${total.toFixed(2)}`}
                </button>
                <p className="text-xs text-center text-[#8B5E3C] mt-3">
                  This is a demo — no real payment or charge is processed.
                </p>
              </div>
            )}
          </div>

          {/* ── Order summary sidebar ───────────────────────────────────────── */}
          <div>
            <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-24">
              <h3 className="font-medium text-[#2C1810] mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                {items.map(item => (
                  <div key={item.cartKey} className="flex gap-2.5 text-sm">
                    <img src={item.product.image_url ?? 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&auto=format&fit=crop&q=80'} alt={item.product.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[#2C1810] truncate text-xs">{item.product.name}</p>
                      <p className="text-[#8B5E3C] text-xs">×{item.quantity}{item.grindSize && ` · ${item.grindSize}`}</p>
                    </div>
                    <span className="text-[#8B5E3C] text-xs shrink-0">${(item.unitPrice * item.quantity).toFixed(2)}</span>
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
                  <span>{shippingCost === 0 ? <span className="text-[#4A6741]">Free</span> : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-medium text-[#2C1810] pt-2 border-t border-[rgba(44,24,16,0.08)]">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              {subtotal < 75 && (
                <div className="mt-4 bg-[#F0E4D4] rounded-xl p-3 text-xs text-[#8B5E3C]">
                  Add <span className="font-medium text-[#2C1810]">${(75 - subtotal).toFixed(2)}</span> more for free shipping
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
