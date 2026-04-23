import { RouterProvider } from 'react-router';
import { router } from './routes';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#2C1810',
            color: '#FAF3EB',
            border: 'none',
            borderRadius: '999px',
            fontSize: '14px',
          },
        }}
      />
    </CartProvider>
  );
}
