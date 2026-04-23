import { createBrowserRouter } from 'react-router';
import { ShopLayout } from './components/ShopLayout';
import { AdminLayout } from './pages/admin/AdminLayout';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminUsers } from './pages/admin/AdminUsers';
import AdminApiDocs from './pages/admin/AdminApiDocs';
import { NotFoundPage } from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: ShopLayout,
    children: [
      { index: true, Component: HomePage },
      { path: 'shop', Component: ShopPage },
      { path: 'product/:id', Component: ProductDetailPage },
      { path: 'checkout', Component: CheckoutPage },
      { path: 'story', Component: HomePage },
      { path: 'guides', Component: HomePage },
    ],
  },
  {
    path: '/admin',
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: 'inventory', Component: AdminInventory },
      { path: 'orders', Component: AdminOrders },
      { path: 'users', Component: AdminUsers },
      { path: 'api-docs', Component: AdminApiDocs },
    ],
  },
  { path: '*', Component: NotFoundPage },
]);