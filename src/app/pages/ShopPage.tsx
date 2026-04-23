import { useState, useMemo } from 'react';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useSearchParams } from 'react-router';
import { products, categories } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';

const roastLevels = ['Light', 'Medium', 'Dark'] as const;
const processingMethods = ['Washed', 'Natural', 'Anaerobic', 'Honey'] as const;
const origins = [...new Set(products.filter(p => p.origin).map(p => p.origin!))].sort();

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');

  const activeCategory = searchParams.get('category') || 'all';
  const activeRoasts = searchParams.getAll('roast');
  const activeOrigins = searchParams.getAll('origin');
  const activeMethods = searchParams.getAll('method');

  const toggleParam = (key: string, value: string) => {
    const current = searchParams.getAll(key);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    if (current.includes(value)) {
      current.filter(v => v !== value).forEach(v => newParams.append(key, v));
    } else {
      [...current, value].forEach(v => newParams.append(key, v));
    }
    setSearchParams(newParams);
  };

  const setCategory = (slug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', slug);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setSearchQuery('');
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory && activeCategory !== 'all') {
      const cat = categories.find(c => c.slug === activeCategory);
      if (cat) result = result.filter(p => p.categoryId === cat.id);
    }

    if (activeRoasts.length > 0) {
      result = result.filter(p => p.roastLevel && activeRoasts.includes(p.roastLevel));
    }

    if (activeOrigins.length > 0) {
      result = result.filter(p => p.origin && activeOrigins.includes(p.origin));
    }

    if (activeMethods.length > 0) {
      result = result.filter(p => p.processingMethod && activeMethods.includes(p.processingMethod));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.origin?.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.flavorNotes?.some(n => n.toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case 'price-asc': return result.sort((a, b) => a.price - b.price);
      case 'price-desc': return result.sort((a, b) => b.price - a.price);
      case 'rating': return result.sort((a, b) => b.rating - a.rating);
      case 'name': return result.sort((a, b) => a.name.localeCompare(b.name));
      default: return result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [activeCategory, activeRoasts, activeOrigins, activeMethods, searchQuery, sortBy]);

  const hasActiveFilters = activeRoasts.length > 0 || activeOrigins.length > 0 || activeMethods.length > 0 || searchQuery;

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="text-sm font-medium text-[#2C1810] mb-3">Category</h3>
        <div className="space-y-2">
          {[{ slug: 'all', name: 'All Products' }, ...categories].map(cat => (
            <button
              key={cat.slug}
              onClick={() => setCategory(cat.slug)}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                activeCategory === cat.slug
                  ? 'bg-[#2C1810] text-[#FAF3EB]'
                  : 'text-[#8B5E3C] hover:bg-[#F0E4D4]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Roast Level */}
      <div>
        <h3 className="text-sm font-medium text-[#2C1810] mb-3">Roast Level</h3>
        <div className="space-y-2">
          {roastLevels.map(level => (
            <label key={level} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={activeRoasts.includes(level)}
                onChange={() => toggleParam('roast', level)}
                className="w-4 h-4 accent-[#2C1810] rounded"
              />
              <span className="text-sm text-[#8B5E3C] group-hover:text-[#2C1810] transition-colors">{level}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Processing Method */}
      <div>
        <h3 className="text-sm font-medium text-[#2C1810] mb-3">Processing Method</h3>
        <div className="space-y-2">
          {processingMethods.map(method => (
            <label key={method} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={activeMethods.includes(method)}
                onChange={() => toggleParam('method', method)}
                className="w-4 h-4 accent-[#2C1810] rounded"
              />
              <span className="text-sm text-[#8B5E3C] group-hover:text-[#2C1810] transition-colors">{method}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Origin */}
      <div>
        <h3 className="text-sm font-medium text-[#2C1810] mb-3">Origin</h3>
        <div className="space-y-2">
          {origins.map(origin => (
            <label key={origin} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={activeOrigins.includes(origin)}
                onChange={() => toggleParam('origin', origin)}
                className="w-4 h-4 accent-[#2C1810] rounded"
              />
              <span className="text-sm text-[#8B5E3C] group-hover:text-[#2C1810] transition-colors">{origin}</span>
            </label>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700"
        >
          <X size={12} /> Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF3EB]">
      {/* Header */}
      <div className="bg-[#2C1810] text-[#FAF3EB] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-4xl mb-2">The Coffee Shop</h1>
          <p className="text-[#C4A882]">Exceptional single-origins and blends, roasted fresh weekly.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search beans, origins, flavors..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-white border border-[rgba(44,24,16,0.12)] rounded-full text-sm text-[#2C1810] placeholder-[#8B5E3C]/60 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30"
          />
          <div className="flex gap-3">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-[rgba(44,24,16,0.12)] rounded-full text-sm text-[#8B5E3C]"
            >
              <SlidersHorizontal size={14} /> Filters
              {hasActiveFilters && <span className="w-2 h-2 bg-[#4A6741] rounded-full" />}
            </button>
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-8 py-2.5 bg-white border border-[rgba(44,24,16,0.12)] rounded-full text-sm text-[#8B5E3C] focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="rating">Top Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">A–Z</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B5E3C] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeRoasts.map(r => (
              <button key={r} onClick={() => toggleParam('roast', r)} className="flex items-center gap-1.5 text-xs px-3 py-1 bg-[#2C1810] text-[#FAF3EB] rounded-full">
                {r} Roast <X size={10} />
              </button>
            ))}
            {activeMethods.map(m => (
              <button key={m} onClick={() => toggleParam('method', m)} className="flex items-center gap-1.5 text-xs px-3 py-1 bg-[#2C1810] text-[#FAF3EB] rounded-full">
                {m} <X size={10} />
              </button>
            ))}
            {activeOrigins.map(o => (
              <button key={o} onClick={() => toggleParam('origin', o)} className="flex items-center gap-1.5 text-xs px-3 py-1 bg-[#2C1810] text-[#FAF3EB] rounded-full">
                {o} <X size={10} />
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar (desktop) */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[rgba(44,24,16,0.08)] sticky top-24">
              <FilterPanel />
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <p className="text-sm text-[#8B5E3C] mb-4">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </p>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[#8B5E3C] mb-4">No products match your filters.</p>
                <button onClick={clearAllFilters} className="text-sm text-[#2C1810] underline">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-medium text-[#2C1810]">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <X size={20} className="text-[#8B5E3C]" />
              </button>
            </div>
            <FilterPanel />
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full mt-6 py-3 bg-[#2C1810] text-[#FAF3EB] rounded-full text-sm font-medium"
            >
              Show {filteredProducts.length} results
            </button>
          </div>
        </>
      )}
    </div>
  );
}
