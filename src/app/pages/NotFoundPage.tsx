import { Link } from 'react-router';
import { Coffee } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#FAF3EB] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-[#F0E4D4] flex items-center justify-center mx-auto mb-6">
          <Coffee size={36} className="text-[#C4A882]" />
        </div>
        <h1 className="font-serif text-4xl text-[#2C1810] mb-2">404</h1>
        <p className="text-[#8B5E3C] mb-6">Oops! This page seems to have gone cold.</p>
        <Link to="/" className="px-6 py-3 bg-[#2C1810] text-[#FAF3EB] rounded-full text-sm hover:bg-[#3D2318] transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
