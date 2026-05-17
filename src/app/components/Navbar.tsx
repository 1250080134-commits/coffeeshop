import { useState } from 'react';
import { ShoppingCart, Coffee, Menu, X, Search, User, LogOut, Package, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

interface NavbarProps {
  onCartOpen: () => void;
  onAuthOpen: () => void;
  isAdmin?: boolean;
}

export function Navbar({ onCartOpen, onAuthOpen, isAdmin = false }: NavbarProps) {
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
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

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    toast.success("You've been signed out.");
    navigate('/');
  };

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
              Fondo
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
          <div className="flex items-center gap-2">
            {!isAdmin && (
              <>
                <button
                  onClick={() => navigate('/shop')}
                  className="p-2 rounded-full hover:bg-[#3D2318] transition-colors"
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>

                {/* Cart */}
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

                {/* User / Auth */}
                {isAuthenticated && user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#3D2318] hover:bg-[#4a2c1e] rounded-full transition-colors"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#C4A882] flex items-center justify-center">
                        <span className="text-[10px] text-[#2C1810] font-medium">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="max-w-[80px] truncate">{user.username}</span>
                      <ChevronDown size={11} />
                    </button>

                    {userMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                        <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg border border-[rgba(44,24,16,0.08)] z-50 overflow-hidden">
                          <div className="px-4 py-3 border-b border-[rgba(44,24,16,0.06)]">
                            <p className="text-xs font-medium text-[#2C1810] truncate">{user.username}</p>
                            <p className="text-xs text-[#8B5E3C] truncate">{user.email}</p>
                          </div>
                          <Link
                            to="/orders"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#2C1810] hover:bg-[#FAF3EB] transition-colors"
                          >
                            <Package size={13} /> Order History
                          </Link>
                          {user.role === 'Admin' && (
                            <Link
                              to="/admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#2C1810] hover:bg-[#FAF3EB] transition-colors"
                            >
                              <User size={13} /> Admin Portal
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-[rgba(44,24,16,0.06)]"
                          >
                            <LogOut size={13} /> Sign Out
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={onAuthOpen}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#C4A882] text-[#2C1810] hover:bg-[#E8D0B5] rounded-full transition-colors font-medium"
                  >
                    <User size={12} />
                    Sign In
                  </button>
                )}
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
              <>
                {isAuthenticated && user ? (
                  <>
                    <Link
                      to="/orders"
                      onClick={() => setMobileOpen(false)}
                      className="text-[#E8D0B5] hover:text-white text-sm py-1"
                    >
                      Order History
                    </Link>
                    <div className="border-t border-[#4a2c1e] pt-2 mt-1">
                      <p className="text-xs text-[#C4A882] mb-1">Signed in as {user.username}</p>
                      {user.role === 'Admin' && (
                        <Link to="/admin" onClick={() => setMobileOpen(false)} className="block text-[#E8D0B5] hover:text-white text-sm py-1">
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => { handleLogout(); setMobileOpen(false); }}
                        className="text-left text-red-400 hover:text-red-300 text-sm py-1"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => { onAuthOpen(); setMobileOpen(false); }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#C4A882] text-[#2C1810] rounded-full text-sm font-medium mt-1"
                  >
                    Sign In / Create Account
                  </button>
                )}

              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
