import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Star, Minus, Plus, Leaf, Globe, Coffee, ChevronDown } from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router';
import { api, ApiProduct } from '../services/api';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { ProductCard } from '../components/ProductCard';

const roastBadge: Record<string, string> = {
  Light:  'bg-amber-100 text-amber-800',
  Medium: 'bg-[#C4A882] text-[#2C1810]',
  Dark:   'bg-[#2C1810] text-white',
};

const GRIND_OPTIONS = [
  { id: 'Whole Bean',   label: 'Whole Bean',   desc: 'Grind fresh at home' },
  { id: 'Espresso',     label: 'Espresso',      desc: 'Fine · Espresso machines' },
  { id: 'Pour Over',    label: 'Pour Over',     desc: 'Medium-fine · V60, Chemex' },
  { id: 'Drip',         label: 'Drip / Filter', desc: 'Medium · Drip machines' },
  { id: 'French Press', label: 'French Press',  desc: 'Coarse · Cold Brew too' },
];

const WEIGHT_OPTIONS = [
  { label: '250g', multiplier: 1.0 },
  { label: '500g', multiplier: 1.8 },
  { label: '1kg',  multiplier: 3.4 },
];

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [related, setRelated] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedGrind, setSelectedGrind] = useState('Whole Bean');
  const [selectedWeight, setSelectedWeight] = useState('250g');
  const [grindDropdownOpen, setGrindDropdownOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    api.products.getById(Number(id))
      .then(res => {
        setProduct(res.data);
        // Load related products from the same category
        return api.products.getAll({ category_id: res.data.category_id, limit: 4 });
      })
      .then(res => {
        setRelated(res.data.filter(p => p.id !== Number(id)).slice(0, 3));
      })
      .catch(() => setProduct(null))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF3EB] flex items-center justify-center">
        <div className="text-[#8B5E3C]">Loading…</div>
      </div>
    );
  }

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

  const price         = parseFloat(product.price);
  const originalPrice = product.original_price ? parseFloat(product.original_price) : null;
  const rating        = product.rating ? parseFloat(product.rating) : null;

  // Accessories category (id=3 by default) don't need grind selection
  const isCoffee     = product.category_id !== 3;
  const isWholeBean  = product.category_id === 1;
  const weightMultiplier = WEIGHT_OPTIONS.find(w => w.label === selectedWeight)?.multiplier ?? 1;
  const unitPrice    = parseFloat((price * weightMultiplier).toFixed(2));
  const roastPercent = product.roast_level === 'Light' ? 25 : product.roast_level === 'Medium' ? 60 : 90;
  const selectedGrindOption = GRIND_OPTIONS.find(g => g.id === selectedGrind);

  const handleAddToCart = () => {
    if (product.stock < quantity) {
      toast.error(`Only ${product.stock} in stock.`);
      return;
    }
    addToCart(product, quantity, {
      grindSize:      isCoffee ? selectedGrind : undefined,
      selectedWeight: isCoffee ? selectedWeight : undefined,
      unitPrice,
    });
    toast.success(`${product.name} added to cart!`, {
      description: isCoffee ? `${selectedGrind} · ${selectedWeight}` : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF3EB]">
      <div className="max-w-7xl mx-auto px-4 py-8">
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
                src={product.image_url ?? 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80'}
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
                {product.category?.name ?? 'Coffee'}
              </span>
              {product.roast_level && (
                <span className={`text-xs px-3 py-1 rounded-full ${roastBadge[product.roast_level]}`}>
                  {product.roast_level} Roast
                </span>
              )}
            </div>

            <h1 className="font-serif text-4xl text-[#2C1810] mb-2">{product.name}</h1>

            {product.origin && (
              <p className="flex items-center gap-1.5 text-[#8B5E3C] text-sm mb-4">
                <Globe size={14} />
                {product.origin}{product.processing_method ? ` · ${product.processing_method} process` : ''}
              </p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(n => (
                  <Star
                    key={n}
                    size={14}
                    className={n <= Math.round(rating ?? 0) ? 'fill-amber-400 text-amber-400' : 'text-gray-300 fill-gray-300'}
                  />
                ))}
              </div>
              <span className="text-sm text-[#2C1810] font-medium">{rating?.toFixed(1) ?? '—'}</span>
              <span className="text-sm text-[#8B5E3C]">({product.review_count} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl text-[#2C1810] font-medium">${unitPrice.toFixed(2)}</span>
              {originalPrice && selectedWeight === '250g' && (
                <span className="text-lg text-[#8B5E3C] line-through">${originalPrice.toFixed(2)}</span>
              )}
              <span className="text-sm text-[#8B5E3C]">/ {selectedWeight}</span>
            </div>

            <p className="text-[#8B5E3C] leading-relaxed mb-6">
              {product.description ?? product.short_description}
            </p>

            {/* Flavor notes */}
            {product.flavor_notes && product.flavor_notes.length > 0 && (
              <div className="mb-6">
                <p className="text-xs text-[#8B5E3C] uppercase tracking-wider mb-2">Flavor Notes</p>
                <div className="flex flex-wrap gap-2">
                  {product.flavor_notes.map(note => (
                    <span key={note} className="text-sm bg-[#F0E4D4] text-[#8B5E3C] px-3 py-1 rounded-full">
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Roast intensity */}
            {product.roast_level && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-[#8B5E3C] uppercase tracking-wider">Roast Intensity</p>
                  <span className="text-xs text-[#8B5E3C]">{product.roast_level}</span>
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

            {/* Coffee-specific selectors */}
            {isCoffee && (
              <div className="space-y-4 mb-6">
                {/* Weight */}
                <div>
                  <p className="text-xs text-[#8B5E3C] uppercase tracking-wider mb-2">Weight</p>
                  <div className="flex gap-2">
                    {WEIGHT_OPTIONS.map(opt => (
                      <button
                        key={opt.label}
                        onClick={() => setSelectedWeight(opt.label)}
                        className={`flex-1 py-2.5 px-3 rounded-xl border-2 text-sm transition-all ${
                          selectedWeight === opt.label
                            ? 'border-[#2C1810] bg-[#2C1810] text-[#FAF3EB]'
                            : 'border-[rgba(44,24,16,0.15)] text-[#8B5E3C] hover:border-[#8B5E3C] bg-white'
                        }`}
                      >
                        <span className="block">{opt.label}</span>
                        <span className={`text-xs ${selectedWeight === opt.label ? 'text-[#C4A882]' : 'text-[#8B5E3C]/70'}`}>
                          ${(price * opt.multiplier).toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grind */}
                <div>
                  <p className="text-xs text-[#8B5E3C] uppercase tracking-wider mb-2">
                    Grind Size{!isWholeBean && ' (Pre-ground default shown)'}
                  </p>
                  <div className="hidden sm:grid grid-cols-5 gap-1.5">
                    {GRIND_OPTIONS.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedGrind(opt.id)}
                        title={opt.desc}
                        className={`py-2 px-1 rounded-xl border-2 text-center transition-all ${
                          selectedGrind === opt.id
                            ? 'border-[#2C1810] bg-[#2C1810] text-[#FAF3EB]'
                            : 'border-[rgba(44,24,16,0.15)] text-[#8B5E3C] hover:border-[#8B5E3C] bg-white'
                        }`}
                      >
                        <span className="block text-xs leading-tight">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="sm:hidden relative">
                    <button
                      onClick={() => setGrindDropdownOpen(!grindDropdownOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-white border border-[rgba(44,24,16,0.15)] rounded-xl text-sm text-[#2C1810]"
                    >
                      <div>
                        <span>{selectedGrindOption?.label}</span>
                        <span className="text-xs text-[#8B5E3C] ml-2">— {selectedGrindOption?.desc}</span>
                      </div>
                      <ChevronDown size={14} className={`text-[#8B5E3C] transition-transform ${grindDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {grindDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-[rgba(44,24,16,0.12)] rounded-xl mt-1 shadow-lg z-10 overflow-hidden">
                        {GRIND_OPTIONS.map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => { setSelectedGrind(opt.id); setGrindDropdownOpen(false); }}
                            className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                              selectedGrind === opt.id ? 'bg-[#F0E4D4] text-[#2C1810]' : 'text-[#8B5E3C] hover:bg-[#FAF3EB]'
                            }`}
                          >
                            <span className="font-medium text-[#2C1810]">{opt.label}</span>
                            <span className="text-xs ml-2 text-[#8B5E3C]">— {opt.desc}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedGrindOption && (
                    <p className="text-xs text-[#8B5E3C] mt-1.5">{selectedGrindOption.desc}</p>
                  )}
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
                  Add to Cart — ${(unitPrice * quantity).toFixed(2)}
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
              {product.processing_method === 'Washed' && (
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
