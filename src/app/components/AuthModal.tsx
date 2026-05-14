import { useState } from 'react';
import { X, Coffee, Eye, EyeOff, Loader2, User, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export function AuthModal({ open, onClose, defaultTab = 'login' }: AuthModalProps) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});

  if (!open) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    const result = await login(loginEmail, loginPassword);
    setLoading(false);
    if (result.success) {
      toast.success(result.message);
      onClose();
    } else {
      setLoginError(result.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!regName.trim()) errors.name = 'Name is required.';
    if (!regEmail.includes('@')) errors.email = 'Valid email is required.';
    if (regPassword.length < 8) errors.password = 'Min 8 characters.';
    if (regPassword !== regConfirm) errors.confirm = 'Passwords do not match.';
    setRegErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    const result = await register(regName, regEmail, regPassword);
    setLoading(false);
    if (result.success) {
      toast.success(result.message);
      onClose();
    } else {
      setRegErrors({ email: result.message });
    }
  };

  const demoUsers = [
    { email: 'sarah.m@email.com', label: 'Customer (Sarah)', password: 'Customer@123' },
    { email: 'admin@artisanbean.com', label: 'Admin (Admin)', password: 'Admin@12345' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-[61] flex items-center justify-center p-4">
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[#2C1810] px-8 pt-8 pb-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-[#E8D0B5] hover:bg-[#3D2318] transition-colors"
            >
              <X size={16} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#C4A882] flex items-center justify-center">
                <Coffee size={18} className="text-[#2C1810]" />
              </div>
              <span className="font-serif text-lg text-[#FAF3EB]">Fondo</span>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-[#1a0d08] rounded-full p-1">
              <button
                onClick={() => { setTab('login'); setLoginError(''); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-sm transition-colors ${
                  tab === 'login' ? 'bg-[#C4A882] text-[#2C1810]' : 'text-[#C4A882] hover:text-white'
                }`}
              >
                <LogIn size={14} />
                Sign In
              </button>
              <button
                onClick={() => { setTab('register'); setRegErrors({}); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-sm transition-colors ${
                  tab === 'register' ? 'bg-[#C4A882] text-[#2C1810]' : 'text-[#C4A882] hover:text-white'
                }`}
              >
                <User size={14} />
                Create Account
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-6">
            {tab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <p className="text-[#2C1810] mb-5">
                    Welcome back! Sign in to your account to manage orders and track deliveries.
                  </p>

                  {/* Demo hint */}
                  <div className="bg-[#F0E4D4] rounded-xl p-3 mb-5">
                    <p className="text-xs text-[#8B5E3C] mb-2">Demo accounts (click to fill):</p>
                    <div className="flex flex-wrap gap-2">
                      {demoUsers.map(d => (
                        <button
                          key={d.email}
                          type="button"
                          onClick={() => { setLoginEmail(d.email); setLoginPassword(d.password); }}
                          className="text-xs bg-white text-[#2C1810] px-3 py-1 rounded-full border border-[rgba(44,24,16,0.12)] hover:bg-[#E8D0B5] transition-colors"
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#8B5E3C] mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => { setLoginEmail(e.target.value); setLoginError(''); }}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 bg-[#F5EBE0] border border-transparent rounded-xl text-sm text-[#2C1810] placeholder-[#8B5E3C]/50 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#8B5E3C] mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={e => { setLoginPassword(e.target.value); setLoginError(''); }}
                      placeholder="Your password"
                      className="w-full px-4 py-2.5 pr-10 bg-[#F5EBE0] border border-transparent rounded-xl text-sm text-[#2C1810] placeholder-[#8B5E3C]/50 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B5E3C] hover:text-[#2C1810]"
                    >
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">{loginError}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#2C1810] text-[#FAF3EB] rounded-full font-medium hover:bg-[#3D2318] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>

                <p className="text-center text-sm text-[#8B5E3C]">
                  Don't have an account?{' '}
                  <button type="button" onClick={() => setTab('register')} className="text-[#2C1810] underline">
                    Create one
                  </button>
                </p>
              </form>
            )}

            {tab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <p className="text-[#2C1810]">
                  Join our community to enjoy faster checkout, order tracking, and exclusive offers.
                </p>

                <div>
                  <label className="block text-xs text-[#8B5E3C] mb-1.5">Username</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={e => { setRegName(e.target.value); setRegErrors(p => ({ ...p, name: '' })); }}
                    placeholder="your_username"
                    className={`w-full px-4 py-2.5 bg-[#F5EBE0] border rounded-xl text-sm text-[#2C1810] placeholder-[#8B5E3C]/50 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30 ${regErrors.name ? 'border-red-400' : 'border-transparent'}`}
                  />
                  {regErrors.name && <p className="text-xs text-red-500 mt-1">{regErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs text-[#8B5E3C] mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={e => { setRegEmail(e.target.value); setRegErrors(p => ({ ...p, email: '' })); }}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-2.5 bg-[#F5EBE0] border rounded-xl text-sm text-[#2C1810] placeholder-[#8B5E3C]/50 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30 ${regErrors.email ? 'border-red-400' : 'border-transparent'}`}
                  />
                  {regErrors.email && <p className="text-xs text-red-500 mt-1">{regErrors.email}</p>}
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-[#8B5E3C] mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        type={showPw ? 'text' : 'password'}
                        value={regPassword}
                        onChange={e => { setRegPassword(e.target.value); setRegErrors(p => ({ ...p, password: '' })); }}
                        placeholder="Min 8 chars"
                        className={`w-full px-4 py-2.5 pr-9 bg-[#F5EBE0] border rounded-xl text-sm text-[#2C1810] placeholder-[#8B5E3C]/50 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30 ${regErrors.password ? 'border-red-400' : 'border-transparent'}`}
                      />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B5E3C]">
                        {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                    {regErrors.password && <p className="text-xs text-red-500 mt-1">{regErrors.password}</p>}
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-[#8B5E3C] mb-1.5">Confirm</label>
                    <div className="relative">
                      <input
                        type={showConfirmPw ? 'text' : 'password'}
                        value={regConfirm}
                        onChange={e => { setRegConfirm(e.target.value); setRegErrors(p => ({ ...p, confirm: '' })); }}
                        placeholder="Repeat password"
                        className={`w-full px-4 py-2.5 pr-9 bg-[#F5EBE0] border rounded-xl text-sm text-[#2C1810] placeholder-[#8B5E3C]/50 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30 ${regErrors.confirm ? 'border-red-400' : 'border-transparent'}`}
                      />
                      <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B5E3C]">
                        {showConfirmPw ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                    {regErrors.confirm && <p className="text-xs text-red-500 mt-1">{regErrors.confirm}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#4A6741] text-white rounded-full font-medium hover:bg-[#3d5836] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>

                <p className="text-center text-sm text-[#8B5E3C]">
                  Already have an account?{' '}
                  <button type="button" onClick={() => setTab('login')} className="text-[#2C1810] underline">
                    Sign in
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
