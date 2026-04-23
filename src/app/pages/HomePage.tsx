import { ArrowRight, Star, Coffee, Leaf, Package, Shield } from 'lucide-react';
import { Link } from 'react-router';
import { products, categories } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';

export function HomePage() {
  const featured = products.filter(p => p.featured).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #2C1810 0%, #4a2c1e 40%, #3d1f10 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C4A882' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-8">
          <span className="inline-flex items-center gap-2 text-[#C4A882] text-sm mb-6 tracking-widest uppercase">
            <Coffee size={14} />
            Specialty Coffee Since 2019
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-[#FAF3EB] mb-6 leading-tight">
            From Origin to Your<br />
            <em className="text-[#C4A882]">Morning Cup</em>
          </h1>
          <p className="text-[#E8D0B5] text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            We source exceptional single-origin beans directly from the world's finest growing regions, 
            roasting them to perfection in small batches for unrivaled freshness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#C4A882] text-[#2C1810] rounded-full hover:bg-[#E8D0B5] transition-colors font-medium"
            >
              Shop All Coffees
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/story"
              className="inline-flex items-center gap-2 px-8 py-4 border border-[#C4A882] text-[#C4A882] rounded-full hover:bg-[#C4A882]/10 transition-colors"
            >
              Our Story
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#C4A882]/60">
          <div className="w-px h-12 bg-gradient-to-b from-[#C4A882]/60 to-transparent" />
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-[#FAF3EB] py-8 border-b border-[rgba(44,24,16,0.08)]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <Leaf size={20} />, title: 'Ethically Sourced', desc: 'Direct trade with farmers' },
            { icon: <Coffee size={20} />, title: 'Small Batch Roasted', desc: 'Peak freshness guaranteed' },
            { icon: <Package size={20} />, title: 'Fast Shipping', desc: 'Free over $75' },
            { icon: <Shield size={20} />, title: '100% Satisfaction', desc: '30-day return policy' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F0E4D4] flex items-center justify-center text-[#8B5E3C] shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="text-sm text-[#2C1810] font-medium">{item.title}</p>
                <p className="text-xs text-[#8B5E3C]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#2C1810] mb-3">Browse by Category</h2>
          <p className="text-[#8B5E3C] max-w-xl mx-auto">
            Whether you prefer whole bean for the freshest grind, convenient ground, or want to elevate your brewing setup.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-md border border-[rgba(44,24,16,0.08)] transition-all hover:-translate-y-1 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#F0E4D4] flex items-center justify-center mx-auto mb-4 group-hover:bg-[#E8D0B5] transition-colors">
                <Coffee size={28} className="text-[#8B5E3C]" />
              </div>
              <h3 className="text-[#2C1810] font-medium mb-2">{cat.name}</h3>
              <p className="text-sm text-[#8B5E3C] mb-4">{cat.description}</p>
              <span className="inline-flex items-center gap-1 text-xs text-[#8B5E3C] group-hover:text-[#2C1810] transition-colors">
                {cat.productCount} products <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-[#F0E4D4]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#2C1810] mb-2">Our Favorites</h2>
              <p className="text-[#8B5E3C]">Handpicked by our head roaster for outstanding quality.</p>
            </div>
            <Link
              to="/shop"
              className="hidden sm:inline-flex items-center gap-2 text-sm text-[#8B5E3C] hover:text-[#2C1810] transition-colors"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm text-[#8B5E3C] hover:text-[#2C1810]"
            >
              View all coffees <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Origin story banner */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl overflow-hidden bg-[#2C1810] relative">
            <div className="absolute inset-0 opacity-30">
              <img
                src="https://images.unsplash.com/photo-1559648617-374af4ae6c2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Coffee brewing"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10 p-12 md:p-16 max-w-2xl">
              <span className="text-[#C4A882] text-xs tracking-widest uppercase mb-4 block">The Artisan Way</span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF3EB] mb-4 leading-tight">
                Every Bean Has a Story Worth Telling
              </h2>
              <p className="text-[#E8D0B5] mb-8 leading-relaxed">
                We travel to origin, build relationships with farmers, and roast in small batches weekly 
                so that every bag arrives at its peak. This isn't just coffee — it's a journey from seed to cup.
              </p>
              <Link
                to="/guides"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C4A882] text-[#2C1810] rounded-full hover:bg-[#E8D0B5] transition-colors font-medium text-sm"
              >
                Explore Brewing Guides
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 px-4 bg-[#F0E4D4]">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#2C1810] text-center mb-10">
            What Our Community Says
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah M.', rating: 5, text: 'The Ethiopia Yirgacheffe has completely changed my mornings. The floral notes are incredible — like nothing I\'ve had from a supermarket.', product: 'Ethiopia Yirgacheffe' },
              { name: 'James H.', rating: 5, text: 'Their roasting is impeccable. I switched from another specialty roaster and I\'m not going back. The Colombia Huila is my new daily driver.', product: 'Colombia Huila' },
              { name: 'Priya S.', rating: 5, text: 'The Panama Geisha is expensive, yes, but every cup is a ceremony. Worth every penny for a special occasion brew.', product: 'Panama Geisha' },
            ].map((review, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-[#2C1810] mb-4 leading-relaxed italic">"{review.text}"</p>
                <div>
                  <p className="text-sm font-medium text-[#2C1810]">{review.name}</p>
                  <p className="text-xs text-[#8B5E3C]">Verified purchase · {review.product}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2C1810] text-[#E8D0B5] py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#C4A882] flex items-center justify-center">
                <Coffee size={16} className="text-[#2C1810]" />
              </div>
              <span className="font-serif text-lg text-[#FAF3EB]">Artisan Bean Hub</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs text-[#C4A882]">
              Connecting passionate coffee lovers with exceptional beans from the world's finest origins.
            </p>
          </div>
          <div>
            <h4 className="text-[#FAF3EB] mb-4 text-sm">Shop</h4>
            <ul className="space-y-2 text-sm">
              {['Whole Bean', 'Ground Coffee', 'Accessories', 'Subscriptions'].map(item => (
                <li key={item}><Link to="/shop" className="hover:text-[#FAF3EB] transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[#FAF3EB] mb-4 text-sm">Info</h4>
            <ul className="space-y-2 text-sm">
              {['Our Story', 'Brewing Guides', 'FAQ', 'Contact'].map(item => (
                <li key={item}><Link to="/story" className="hover:text-[#FAF3EB] transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[rgba(255,255,255,0.1)] flex flex-col sm:flex-row justify-between gap-4 text-xs text-[#8B5E3C]">
          <p>© 2024 Artisan Bean Hub. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-[#C4A882]">Privacy Policy</Link>
            <Link to="/" className="hover:text-[#C4A882]">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
