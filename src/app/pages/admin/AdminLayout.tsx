import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { LayoutDashboard, Package, ShoppingBag, Users, Coffee, Menu, LogOut, BookOpen } from 'lucide-react';
import { Toaster } from 'sonner';

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: <LayoutDashboard size={16} />, exact: true },
  { label: 'Inventory', to: '/admin/inventory', icon: <Package size={16} /> },
  { label: 'Orders', to: '/admin/orders', icon: <ShoppingBag size={16} /> },
  { label: 'Users', to: '/admin/users', icon: <Users size={16} /> },
  { label: 'API Docs', to: '/admin/api-docs', icon: <BookOpen size={16} /> },
];

export function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            <p className="text-sm font-medium text-[#2C1810]">Artisan Bean Hub</p>
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
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                active
                  ? 'bg-[#2C1810] text-[#FAF3EB] shadow-sm'
                  : 'text-[#8B5E3C] hover:bg-[#E8D0B5] hover:text-[#2C1810]'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-[rgba(44,24,16,0.12)]">
        <div className="flex items-center gap-3 px-4 py-2.5 mb-2">
          <div className="w-7 h-7 rounded-full bg-[#E8D0B5] flex items-center justify-center text-[#8B5E3C] text-xs font-medium">
            AR
          </div>
          <div>
            <p className="text-xs text-[#2C1810] font-medium">Alex Roaster</p>
            <p className="text-xs text-[#8B5E3C]">Admin</p>
          </div>
        </div>
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-[#8B5E3C] hover:bg-[#E8D0B5] hover:text-[#2C1810] transition-colors"
        >
          <LogOut size={15} />
          Back to Shop
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF3EB] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-[#F5EBE0] border-r border-[rgba(44,24,16,0.12)]">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 h-full w-64 bg-[#F5EBE0] z-50 lg:hidden shadow-2xl">
            <Sidebar />
          </aside>
        </>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 h-14 bg-[#2C1810] text-[#FAF3EB] shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-[#3D2318] transition-colors">
            <Menu size={18} />
          </button>
          <span className="font-serif text-sm">Admin Dashboard</span>
          <Link to="/" className="text-xs text-[#C4A882]">Shop</Link>
        </header>

        {/* Content */}
        <main className="flex-1 p-5 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}