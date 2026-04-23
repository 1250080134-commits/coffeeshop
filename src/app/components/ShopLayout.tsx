import { useState } from 'react';
import { Outlet } from 'react-router';
import { Navbar } from './Navbar';
import { CartDrawer } from './CartDrawer';

export function ShopLayout() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF3EB]">
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <Outlet context={{ onCartOpen: () => setCartOpen(true) }} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}