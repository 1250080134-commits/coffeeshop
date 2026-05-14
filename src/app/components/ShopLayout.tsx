import { useState } from 'react';
import { Outlet } from 'react-router';
import { Navbar } from './Navbar';
import { CartDrawer } from './CartDrawer';
import { AuthModal } from './AuthModal';

export function ShopLayout() {
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF3EB]">
      <Navbar
        onCartOpen={() => setCartOpen(true)}
        onAuthOpen={() => setAuthOpen(true)}
      />
      <Outlet context={{ onCartOpen: () => setCartOpen(true), onAuthOpen: () => setAuthOpen(true) }} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
