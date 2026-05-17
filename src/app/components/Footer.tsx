import { Coffee, Instagram, Twitter, Youtube, Mail } from 'lucide-react';
import { Link } from 'react-router';

export function Footer() {
  return (
    <footer className="bg-[#2C1810] text-[#E8D0B5] py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#C4A882] flex items-center justify-center">
              <Coffee size={16} className="text-[#2C1810]" />
            </div>
            <span className="font-serif text-lg text-[#FAF3EB]">Fondo</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs text-[#C4A882] mb-6">
            Connecting passionate coffee lovers with exceptional single-origin beans from the world's finest growing regions. Roasted fresh. Delivered with care.
          </p>
          <div className="flex items-center gap-3">
            {[
              { icon: <Instagram size={16} />, label: 'Instagram', href: '#' },
              { icon: <Twitter size={16} />, label: 'Twitter', href: '#' },
              { icon: <Youtube size={16} />, label: 'YouTube', href: '#' },
              { icon: <Mail size={16} />, label: 'Email', href: '#' },
            ].map(s => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-8 h-8 rounded-full bg-[#3D2318] flex items-center justify-center text-[#C4A882] hover:bg-[#C4A882] hover:text-[#2C1810] transition-colors"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Shop links */}
        <div>
          <h4 className="text-[#FAF3EB] mb-4 text-sm uppercase tracking-wider">Shop</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { label: 'Whole Bean', to: '/shop?category=whole-bean' },
              { label: 'Ground Coffee', to: '/shop?category=ground' },
              { label: 'Accessories', to: '/shop?category=accessories' },
              { label: 'Subscriptions', to: '/shop' },
              { label: 'Gift Cards', to: '/shop' },
            ].map(item => (
              <li key={item.label}>
                <Link to={item.to} className="hover:text-[#FAF3EB] transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Info links */}
        <div>
          <h4 className="text-[#FAF3EB] mb-4 text-sm uppercase tracking-wider">Explore</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { label: 'Our Story', to: '/story' },
              { label: 'Brewing Guides', to: '/guides' },
              { label: 'Order History', to: '/orders' },
              { label: 'FAQ', to: '/story' },
              { label: 'Contact Us', to: '/story' },
            ].map(item => (
              <li key={item.label}>
                <Link to={item.to} className="hover:text-[#FAF3EB] transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Newsletter strip */}
      <div className="max-w-7xl mx-auto mt-12 mb-8 bg-[#3D2318] rounded-2xl px-6 py-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1">
          <p className="text-[#FAF3EB] font-medium mb-1">Get brewing tips in your inbox</p>
          <p className="text-sm text-[#C4A882]">Weekly guides, origin stories, and early access to new arrivals.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 min-w-0 sm:w-56 px-4 py-2.5 bg-[#2C1810] text-[#FAF3EB] text-sm rounded-full border border-[rgba(196,168,130,0.2)] placeholder-[#8B5E3C] focus:outline-none focus:border-[#C4A882]"
          />
          <button className="px-5 py-2.5 bg-[#C4A882] text-[#2C1810] text-sm rounded-full hover:bg-[#E8D0B5] transition-colors font-medium whitespace-nowrap">
            Subscribe
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-[rgba(255,255,255,0.08)] flex flex-col sm:flex-row justify-between gap-4 text-xs text-[#8B5E3C]">
        <p>© {new Date().getFullYear()} Fondo. All rights reserved.</p>
        <div className="flex gap-5">
          <Link to="/" className="hover:text-[#C4A882] transition-colors">Privacy Policy</Link>
          <Link to="/" className="hover:text-[#C4A882] transition-colors">Terms of Service</Link>
          <Link to="/" className="hover:text-[#C4A882] transition-colors">Accessibility</Link>
        </div>
      </div>
    </footer>
  );
}
