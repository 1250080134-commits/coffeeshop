import { useState } from 'react';
import { ArrowLeft, ShoppingCart, Star, Minus, Plus, Leaf, Globe, Coffee } from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router';
import { products } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { ProductCard } from '../components/ProductCard';

const roastBadge: Record<string, string> = {
  Light: 'bg-amber-100 text-amber-800',
  Medium: 'bg-[#C4A882] text-[#2C1810]',
  Dark: 'bg-[#2C1810] text-white',
};

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF3EB]">
        <div className="text-center">
          <p className="text-[#8B5E3C] mb-4">Product not found.</p>
          <Link to="/shop" className="text-[#2C1810] underline text-sm">Back to shop</Link>
        </div>
      </div>
    );
  }

  const related = products.filter(p => p.id !== product.id && p.categoryId === product.categoryId).slice(0, 3);

  const handleAddToCart = () => {
    if (product.stock < quantity) {
      toast.error(`Only ${product.stock} in stock.`);
      return;
    }
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  const roastPercent = product.roastLevel === 'Light' ? 25 : product.roastLevel === 'Medium' ? 60 : 90;

  return (
    <div className="min-h-screen bg-[#FAF3EB]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-[#8B5E3C] hover:text-[#2C1810] mb-6 transition-colors"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.badge && (
              <div className="absolute top-5 left-5">
                <span className="bg-[#2C1810] text-[#FAF3EB] text-xs px-3 py-1 rounded-full">
                  {product.badge}
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-[#8B5E3C] bg-[#F0E4D4] px-3 py-1 rounded-full">
                {product.categoryName}
              </span>
              {product.roastLevel && (
                <span className={`text-xs px-3 py-1 rounded-full ${roastBadge[product.roastLevel]}`}>
                  {product.roastLevel} Roast
                </span>
              )}
            </div>

            <h1 className="font-serif text-4xl text-[#2C1810] mb-2">{product.name}</h1>

            {product.origin && (
              <p className="flex items-center gap-1.5 text-[#8B5E3C] text-sm mb-4">
                <Globe size={14} />
                {product.origin} · {product.processingMethod} process
              </p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(n => (
                  <Star
                    key={n}
                    size={14}
                    className={n <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300 fill-gray-300'}
                  />
                ))}
              </div>
              <span className="text-sm text-[#2C1810] font-medium">{product.rating}</span>
              <span className="text-sm text-[#8B5E3C]">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl text-[#2C1810] font-medium">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-[#8B5E3C] line-through">${product.originalPrice.toFixed(2)}</span>
              )}
              {product.weight && (
                <span className="text-sm text-[#8B5E3C]">/ {product.weight}</span>
              )}
            </div>

            <p className="text-[#8B5E3C] leading-relaxed mb-6">{product.description}</p>

            {/* Flavor notes */}
            {product.flavorNotes && (
              <div className="mb-6">
                <p className="text-xs text-[#8B5E3C] uppercase tracking-wider mb-2">Flavor Notes</p>
                <div className="flex flex-wrap gap-2">
                  {product.flavorNotes.map(note => (
                    <span key={note} className="text-sm bg-[#F0E4D4] text-[#8B5E3C] px-3 py-1 rounded-full">
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Roast intensity */}
            {product.roastLevel && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-[#8B5E3C] uppercase tracking-wider">Roast Intensity</p>
                  <span className="text-xs text-[#8B5E3C]">{product.roastLevel}</span>
                </div>
                <div className="h-2 bg-[#F0E4D4] rounded-full">
                  <div
                    className="h-full bg-gradient-to-r from-[#C4A882] to-[#2C1810] rounded-full transition-all"
                    style={{ width: `${roastPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-[#8B5E3C]/60 mt-1">
                  <span>Light</span>
                  <span>Dark</span>
                </div>
              </div>
            )}

            {/* Add to cart */}
            {product.stock > 0 ? (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-3 bg-[#F0E4D4] rounded-full px-2 py-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#E8D0B5] transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-[#2C1810] w-6 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#E8D0B5] transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-xs text-[#8B5E3C]">{product.stock} in stock</span>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#2C1810] text-[#FAF3EB] rounded-full hover:bg-[#3D2318] transition-colors font-medium"
                >
                  <ShoppingCart size={18} />
                  Add to Cart — ${(product.price * quantity).toFixed(2)}
                </button>
              </>
            ) : (
              <div className="py-4 text-center bg-[#F0E4D4] rounded-full text-[#8B5E3C]">
                Out of Stock
              </div>
            )}

            {/* Certifications */}
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-[rgba(44,24,16,0.08)]">
              <div className="flex items-center gap-2 text-xs text-[#8B5E3C]">
                <Leaf size={13} className="text-[#4A6741]" />
                Ethically Sourced
              </div>
              <div className="flex items-center gap-2 text-xs text-[#8B5E3C]">
                <Coffee size={13} className="text-[#8B5E3C]" />
                Small Batch
              </div>
              {product.processingMethod === 'Washed' && (
                <div className="flex items-center gap-2 text-xs text-[#8B5E3C]">
                  <Globe size={13} className="text-[#2C6B8A]" />
                  Washed Process
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="font-serif text-2xl text-[#2C1810] mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}