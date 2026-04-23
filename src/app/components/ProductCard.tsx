import { ShoppingCart, Star, Leaf } from 'lucide-react';
import { Product } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const roastColors: Record<string, string> = {
  Light: 'bg-[#F5DEB3] text-[#8B5E3C]',
  Medium: 'bg-[#C4A882] text-[#2C1810]',
  Dark: 'bg-[#2C1810] text-[#FAF3EB]',
};

const badgeColors: Record<string, string> = {
  Bestseller: 'bg-[#4A6741] text-white',
  Sale: 'bg-red-600 text-white',
  Limited: 'bg-[#8B5E3C] text-white',
  New: 'bg-[#2C6B8A] text-white',
  Rare: 'bg-purple-700 text-white',
  Organic: 'bg-[#4A6741] text-white',
  'Top Pick': 'bg-[#C4A882] text-[#2C1810]',
  Premium: 'bg-[#2C1810] text-[#FAF3EB]',
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) return;
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`, {
      description: `$${product.price.toFixed(2)}`,
    });
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-[rgba(44,24,16,0.08)] hover:-translate-y-1">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Overlays */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.badge && (
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${badgeColors[product.badge] || 'bg-gray-800 text-white'}`}>
                {product.badge}
              </span>
            )}
            {product.roastLevel && (
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${roastColors[product.roastLevel]}`}>
                {product.roastLevel} Roast
              </span>
            )}
          </div>
          {product.stock <= 10 && product.stock > 0 && (
            <div className="absolute bottom-3 right-3 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              Only {product.stock} left
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-sm font-medium bg-black/60 px-4 py-2 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-[#2C1810] font-medium leading-tight">{product.name}</h3>
            {product.processingMethod === 'Anaerobic' || product.badge === 'Organic' ? (
              <Leaf size={14} className="text-[#4A6741] mt-1 shrink-0" />
            ) : null}
          </div>

          {product.origin && (
            <p className="text-xs text-[#8B5E3C] mb-2">{product.origin} · {product.processingMethod}</p>
          )}

          <p className="text-xs text-[#8B5E3C] line-clamp-2 mb-3">{product.shortDescription}</p>

          {/* Flavor notes */}
          {product.flavorNotes && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.flavorNotes.slice(0, 3).map(note => (
                <span key={note} className="text-xs bg-[#F0E4D4] text-[#8B5E3C] px-2 py-0.5 rounded-full">
                  {note}
                </span>
              ))}
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-xs text-[#2C1810] font-medium">{product.rating}</span>
            <span className="text-xs text-[#8B5E3C]">({product.reviewCount})</span>
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[#2C1810] font-medium">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-xs text-[#8B5E3C] line-through ml-2">${product.originalPrice.toFixed(2)}</span>
              )}
              {product.weight && (
                <span className="text-xs text-[#8B5E3C] ml-1">/ {product.weight}</span>
              )}
            </div>
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2C1810] text-[#FAF3EB] text-xs rounded-full hover:bg-[#3D2318] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ShoppingCart size={12} />
              Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
