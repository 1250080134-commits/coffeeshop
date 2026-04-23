import { useState } from 'react';
import { ShoppingCart, Coffee, Menu, X, Search, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  onCartOpen: () => void;
  isAdmin?: boolean;
}

export function Navbar({ onCartOpen, isAdmin = false }: NavbarProps) {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = isAdmin
    ? [
        { label: 'Dashboard', to: '/admin' },
        { label: 'Inventory', to: '/admin/inventory' },
        { label: 'Orders', to: '/admin/orders' },
        { label: 'Users', to: '/admin/users' },
      ]
    : [
        { label: 'Shop', to: '/shop' },
        { label: 'Our Story', to: '/story' },
        { label: 'Brewing Guides', to: '/guides' },
      ];

  return (
    <header className="sticky top-0 z-50 bg-[#2C1810] text-[#FAF3EB] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-[#C4A882] flex items-center justify-center group-hover:bg-[#E8D0B5] transition-colors">
              <Coffee size={16} className="text-[#2C1810]" />
            </div>
            <span className="font-serif text-lg tracking-wide hidden sm:block">
              Artisan Bean Hub
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-[#E8D0B5] hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {!isAdmin && (
              <>
                <button
                  onClick={() => navigate('/shop')}
                  className="p-2 rounded-full hover:bg-[#3D2318] transition-colors"
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>
                <button
                  onClick={onCartOpen}
                  className="relative p-2 rounded-full hover:bg-[#3D2318] transition-colors"
                  aria-label="Cart"
                >
                  <ShoppingCart size={18} />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#4A6741] text-white text-xs rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
                <Link
                  to="/admin"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#4A6741] hover:bg-[#3d5836] rounded-full transition-colors"
                >
                  <User size={12} />
                  Admin
                </Link>
              </>
            )}
            {isAdmin && (
              <Link
                to="/"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#4A6741] hover:bg-[#3d5836] rounded-full transition-colors"
              >
                View Shop
              </Link>
            )}
            <button
              className="md:hidden p-2 rounded-full hover:bg-[#3D2318] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#3D2318] border-t border-[#4a2c1e] px-4 py-4">
          <nav className="flex flex-col gap-3">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="text-[#E8D0B5] hover:text-white text-sm py-1"
              >
                {link.label}
              </Link>
            ))}
            {!isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="text-[#E8D0B5] hover:text-white text-sm py-1"
              >
                Admin Dashboard
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
