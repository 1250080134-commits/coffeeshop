import { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router';
import { LayoutDashboard, Package, ShoppingBag, Users, Coffee, Menu, LogOut, BookOpen, Lock } from 'lucide-react';
import { Toaster } from 'sonner';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Dashboard', to: '/admin',           icon: <LayoutDashboard size={16} />, exact: true },
  { label: 'Inventory', to: '/admin/inventory', icon: <Package size={16} /> },
  { label: 'Orders',    to: '/admin/orders',    icon: <ShoppingBag size={16} /> },
  { label: 'Users',     to: '/admin/users',     icon: <Users size={16} /> },
  { label: 'API Docs',  to: '/admin/api-docs',  icon: <BookOpen size={16} /> },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const location             = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Role Guard ──────────────────────────────────────────────────────────────
  // Unauthenticated visitors → redirect to home (AuthModal can open from there).
  // Authenticated non-admins → show a clear "Access Denied" screen rather than
  // silently redirecting, so the user understands what happened.
  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (user.role !== 'Admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF3EB]">
        <div className="text-center max-w-sm px-6 py-10 bg-white rounded-2xl shadow-lg">
          <div className="w-14 h-14 rounded-full bg-[#F5EFE6] flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-[#8B5E3C]" />
          </div>
          <h1 className="font-serif text-2xl text-[#2C1810] mb-2">Admin Only</h1>
          <p className="text-[#8B5E3C] text-sm mb-6">
            Your account doesn't have admin privileges. Contact an administrator if you believe this is a mistake.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-2.5 bg-[#2C1810] text-[#FAF3EB] rounded-full text-sm font-medium hover:bg-[#3D2515] transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // ── Admin UI ────────────────────────────────────────────────────────────────
  const isActive = (to: string, exact = false) => {
    if (exact) return location.pathname === to || location.pathname === to + '/';
    return location.pathname === to || location.pathname.startsWith(to + '/');
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-[rgba(44,24,16,0.12)]">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-[#C4A882] flex items-center justify-center">
            <Coffee size={15} className="text-[#2C1810]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#2C1810]">Fondo</p>
            <p className="text-xs text-[#8B5E3C]">Admin Portal</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => {
          const active = isActive(item.to, item.exact);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                active
                  ? 'bg-[#2C1810] text-[#FAF3EB] font-medium'
                  : 'text-[#5C3D2E] hover:bg-[#F5EFE6]'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-[rgba(44,24,16,0.12)]">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#C4A882] flex items-center justify-center text-[#2C1810] text-xs font-semibold">
            {user.username?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#2C1810] truncate">{user.username}</p>
            <p className="text-xs text-[#8B5E3C]">Admin</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#8B5E3C] hover:bg-[#F5EFE6] hover:text-[#2C1810] transition-colors"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#FAF3EB] overflow-hidden">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-56 shrink-0 bg-white border-r border-[rgba(44,24,16,0.1)] flex-col">
        <Sidebar />
      </aside>

      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-56 bg-white shadow-2xl flex flex-col z-50">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-[rgba(44,24,16,0.1)]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-[#F5EFE6] text-[#2C1810] transition-colors"
          >
            <Menu size={18} />
          </button>
          <span className="font-serif text-sm text-[#2C1810]">Admin Dashboard</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      <Toaster position="bottom-right" />
    </div>
  );
}
