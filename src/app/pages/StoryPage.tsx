import { ArrowRight, Leaf, Heart, Globe, Award, Coffee, Users, MapPin } from 'lucide-react';
import { Link } from 'react-router';
import { Footer } from '../components/Footer';

const ROASTERY_IMG   = 'https://images.unsplash.com/photo-1719581228567-4d928454c793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGVjaWFsdHklMjBjb2ZmZWUlMjByb2FzdGVyeSUyMHNtYWxsJTIwYmF0Y2glMjByb2FzdGluZ3xlbnwxfHx8fDE3NzgxMjc5NjF8MA&ixlib=rb-4.1.0&q=80&w=1080';
const FARM_IMG        = 'https://images.unsplash.com/photo-1746623691146-cf22b3ef7f55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBmYXJtJTIwaGFydmVzdCUyMGZhcm1lcnMlMjBwaWNraW5nJTIwYmVhbnN8ZW58MXx8fHwxNzc4MTI3OTY3fDA&ixlib=rb-4.1.0&q=80&w=1080';
const CUPPING_IMG     = 'https://images.unsplash.com/photo-1595950206430-5026b909c06d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXBwaW5nJTIwdGFzdGluZyUyMHNwZWNpYWx0eSUyMHF1YWxpdHklMjBjb250cm9sfGVufDF8fHx8MTc3ODEyNzk3NXww&ixlib=rb-4.1.0&q=80&w=1080';
const PROCESSING_IMG  = 'https://images.unsplash.com/photo-1646444084006-6fbaa719f67e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFuJTIwcHJvY2Vzc2luZyUyMHdhc2hpbmclMjBmZXJtZW50YXRpb24lMjBuYXR1cmFsfGVufDF8fHx8MTc3ODEyNzk3Mnww&ixlib=rb-4.1.0&q=80&w=1080';

const timeline = [
  {
    year: '2024',
    title: 'The Idea Takes Root',
    text: 'It started with a simple frustration: great Vietnamese coffee was everywhere in our neighborhood — but no single place honored it the way it deserved. We began sketching the concept of Fondo in a small apartment in Ho Chi Minh City.',
  },
  {
    year: 'Early 2025',
    title: 'Finding Our Beans',
    text: 'We spent months traveling through the Central Highlands — Da Lat, Buon Ma Thuot, Kon Tum — building relationships with local farmers and discovering the incredible diversity of Vietnamese-grown arabica and robusta.',
  },
  {
    year: 'Mid 2025',
    title: 'Crafting the Space',
    text: 'We found our home: a sun-filled corner shophouse in a quiet Saigon alley. We designed every detail ourselves — the warm terracotta walls, hand-thrown ceramic cups, and the open brew bar where guests can watch every step.',
  },
  {
    year: '2026',
    title: 'Fondo Opens Its Doors',
    text: 'In 2026, Fondo officially opened. From day one, our mission was clear: serve exceptional Vietnamese coffee, honor the farmers who grow it, and create a space where every guest feels the warmth of coming home.',
  },
];

const values = [
  {
    icon: <Leaf size={22} />,
    title: 'Vietnamese Roots',
    text: 'Every cup we serve traces back to Vietnamese soil. We source exclusively from farms across the Central Highlands, celebrating the unique terroir that makes Vietnamese coffee unlike any other in the world.',
  },
  {
    icon: <Heart size={22} />,
    title: 'Farmer Partnerships',
    text: 'We pay above-market prices and visit our growers in person. When farmers thrive, the quality of every cup rises with them. Their names and stories are part of ours.',
  },
  {
    icon: <Globe size={22} />,
    title: 'Community & Warmth',
    text: 'Fondo is derived from the word for "foundation" — and community is ours. We host brewing workshops, tasting sessions, and open our doors to anyone who wants to learn, share, or simply slow down.',
  },
  {
    icon: <Award size={22} />,
    title: 'Uncompromising Quality',
    text: "From bean selection to brew temperature, we obsess over every variable. Tradition and precision aren't opposites at Fondo — they are the same thing.",
  },
];

const origins = [
  { region: 'Buon Ma Thuot, Dak Lak', elevation: '500–800m', varieties: 'Robusta, Arabica', flag: '🇻🇳' },
  { region: 'Da Lat, Lam Dong', elevation: '1,400–1,600m', varieties: 'Arabica, Culi', flag: '🇻🇳' },
  { region: 'Kon Tum Highlands', elevation: '900–1,200m', varieties: 'Arabica, Catimor', flag: '🇻🇳' },
  { region: 'Son La', elevation: '800–1,100m', varieties: 'Arabica', flag: '🇻🇳' },
];

const team = [
  { name: 'Minh Tuan', role: 'Co-Founder & Head Barista', credential: 'SCA Certified Barista', initials: 'MT' },
  { name: 'Lan Anh', role: 'Co-Founder & Bean Sourcer', credential: 'Q-Grader Certified', initials: 'LA' },
  { name: 'Duc Hieu', role: 'Lead Roaster', credential: 'SCA Roasting Skills — Professional', initials: 'DH' },
  { name: 'Thu Ha', role: 'Hospitality & Community', credential: 'Specialty Coffee Educator', initials: 'TH' },
];

export function StoryPage() {
  return (
    <div className="min-h-screen bg-[#FAF3EB]">

      {/* HERO */}
      <section
        className="relative min-h-[70vh] flex items-end overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a0d08 0%, #2C1810 50%, #3d1f10 100%)' }}
      >
        <div className="absolute inset-0 opacity-25">
          <img src={ROASTERY_IMG} alt="Our coffee shop" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810] via-transparent to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pb-20 pt-32">
          <span className="inline-flex items-center gap-2 text-[#C4A882] text-xs tracking-widest uppercase mb-5">
            <Coffee size={13} /> Born in Vietnam, Opened 2026
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-[#FAF3EB] mb-6 leading-tight max-w-3xl">
            Rooted in Vietnam. <em className="text-[#C4A882]">Built on Foundation.</em>
          </h1>
          <p className="text-[#E8D0B5] text-lg max-w-2xl leading-relaxed mb-8">
            Fondo is a Vietnamese specialty coffee shop that opened in 2026 with one purpose: to be a
            true foundation for extraordinary coffee — for the farmers who grow it, the community
            that gathers around it, and every guest who walks through our door.
          </p>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-6 sm:gap-8 text-center">
            {[
              { value: '2026', label: 'Year Founded' },
              { value: '100%', label: 'Vietnamese Sourced' },
              { value: '4+', label: 'Growing Regions' },
              { value: 'Saigon', label: 'Home City' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="text-3xl font-serif text-[#C4A882]">{stat.value}</p>
                <p className="text-xs text-[#E8D0B5] uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs tracking-widest uppercase text-[#8B5E3C] mb-4 block">Our Story</span>
            <h2 className="font-serif text-4xl text-[#2C1810] mb-6 leading-tight">
              A Vietnamese Coffee Shop Built on a Single Word: Foundation
            </h2>
            <div className="space-y-4 text-[#8B5E3C] leading-relaxed">
              <p>
                Fondo is a Vietnamese specialty coffee shop that opened its doors in 2026 in the heart
                of Ho Chi Minh City. We were born from a deep love of Vietnamese coffee culture — the
                slow drip of a phin filter, the ritual of condensed milk stirring into dark,
                rich robusta, the conversations that stretch long past the last sip.
              </p>
              <p>
                The name <strong className="text-[#2C1810]">Fondo</strong> means "foundation" — and it
                captures everything we believe in. Coffee is a foundation: for mornings, for conversations,
                for communities, and for the livelihoods of the farmers who dedicate their lives to
                growing it. We named our shop Fondo to remind ourselves — and everyone who visits — that
                great coffee is never accidental. It is built, carefully, from the ground up.
              </p>
              <p>
                We source exclusively from Vietnamese farms across the Central Highlands, working directly
                with growers to celebrate the country's remarkable coffee heritage — from the bold,
                chocolatey robusta of Dak Lak to the bright, floral arabica of Da Lat's cool plateaus.
              </p>
              <p>
                At Fondo, every cup is a story that begins in Vietnamese soil and ends in your hands.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-[#2C1810] text-[#FAF3EB] rounded-full hover:bg-[#3D2318] transition-colors text-sm font-medium"
            >
              Explore Our Coffees <ArrowRight size={15} />
            </Link>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden aspect-[4/3]">
              <img src={FARM_IMG} alt="Vietnamese coffee farm" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-[#2C1810] text-[#FAF3EB] rounded-2xl p-5 shadow-xl max-w-xs">
              <p className="text-xs text-[#C4A882] mb-1">The Name Behind the Shop</p>
              <p className="text-2xl font-serif">Fondo</p>
              <p className="text-xs text-[#E8D0B5] mt-2">"Foundation" — the base of everything we do.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-20 px-4 bg-[#F0E4D4]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs tracking-widest uppercase text-[#8B5E3C] mb-4 block">Our Journey</span>
            <h2 className="font-serif text-4xl text-[#2C1810]">How Fondo Came to Be</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-[#C4A882]/40 -translate-x-1/2" />
            <div className="space-y-10">
              {timeline.map((item, i) => (
                <div
                  key={item.year}
                  className={`relative flex gap-8 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                >
                  <div className={`flex-1 pl-16 sm:pl-0 ${i % 2 === 0 ? 'sm:text-right sm:pr-12' : 'sm:text-left sm:pl-12'}`}>
                    <span className="text-xs font-medium text-[#C4A882] tracking-widest">{item.year}</span>
                    <h3 className="text-lg text-[#2C1810] mt-1 mb-2">{item.title}</h3>
                    <p className="text-sm text-[#8B5E3C] leading-relaxed">{item.text}</p>
                  </div>
                  <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#C4A882] border-4 border-[#F0E4D4] mt-1 shrink-0" />
                  <div className="hidden sm:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs tracking-widest uppercase text-[#8B5E3C] mb-4 block">What We Stand For</span>
            <h2 className="font-serif text-4xl text-[#2C1810] mb-4">Our Core Principles</h2>
            <p className="text-[#8B5E3C] max-w-xl mx-auto">
              Fondo is built on four pillars — each one a layer of the foundation we return to
              in every decision we make, from sourcing to serving.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 shadow-sm border border-[rgba(44,24,16,0.08)] hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#F0E4D4] flex items-center justify-center text-[#8B5E3C] mb-5">
                  {v.icon}
                </div>
                <h3 className="text-[#2C1810] mb-3">{v.title}</h3>
                <p className="text-sm text-[#8B5E3C] leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOURCING */}
      <section className="py-20 px-4 bg-[#2C1810]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs tracking-widest uppercase text-[#C4A882] mb-4 block">Farm to Cup</span>
            <h2 className="font-serif text-4xl text-[#FAF3EB] mb-4">Our Vietnamese Sourcing Process</h2>
            <p className="text-[#C4A882] max-w-xl mx-auto">
              Every bean at Fondo travels through a careful, intentional process before it reaches your cup.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: '01', icon: <MapPin size={20} />, title: 'Farm Visits', desc: 'We travel to our partner farms in the Central Highlands every harvest season — walking the land, meeting the families, and understanding the conditions that shape each lot.' },
              { step: '02', icon: <Leaf size={20} />, title: 'Cherry Selection', desc: 'We select only hand-picked, fully ripe cherries. Vietnamese robusta and arabica each have their own peak — we pick them at exactly the right moment.' },
              { step: '03', icon: <Coffee size={20} />, title: 'Processing', desc: "We work with farmers to choose and monitor the processing method — wet, dry, or honey — that best expresses each variety's unique character." },
              { step: '04', icon: <Award size={20} />, title: 'Quality Cupping', desc: 'Every lot is cupped by our team before purchase. We score blind, and only the best make it to our roaster. Quality over quantity, always.' },
              { step: '05', icon: <Coffee size={20} />, title: 'Precision Roasting', desc: "We roast in small batches, developing custom profiles for each origin to highlight its best qualities — whether that's the dark richness of Dak Lak or the bright clarity of Da Lat." },
            ].map((item, i) => (
              <div key={i} className="relative">
                {i < 4 && (
                  <div className="hidden md:block absolute top-8 left-[60%] right-0 h-px bg-[#C4A882]/20 z-0" />
                )}
                <div className="relative z-10 text-center px-3">
                  <div className="w-16 h-16 rounded-full bg-[#3D2318] border-2 border-[#C4A882]/30 flex items-center justify-center mx-auto mb-4 text-[#C4A882]">
                    {item.icon}
                  </div>
                  <span className="text-xs text-[#C4A882]/60 font-mono">{item.step}</span>
                  <h3 className="text-[#FAF3EB] mt-1 mb-2 text-sm">{item.title}</h3>
                  <p className="text-xs text-[#C4A882] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ORIGINS */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="text-xs tracking-widest uppercase text-[#8B5E3C] mb-4 block">Where We Source</span>
              <h2 className="font-serif text-4xl text-[#2C1810] mb-6">The Highlands Behind Every Cup</h2>
              <p className="text-[#8B5E3C] leading-relaxed mb-8">
                Vietnam is one of the world's great coffee nations — yet so much of its diversity
                remains unexplored. At Fondo, we focus exclusively on Vietnamese-grown beans,
                building long-term relationships with growers across the country's finest regions.
              </p>
              <div className="space-y-3">
                {origins.map(origin => (
                  <div
                    key={origin.region}
                    className="flex items-center gap-4 bg-white rounded-xl p-4 border border-[rgba(44,24,16,0.08)] hover:border-[#C4A882] transition-colors"
                  >
                    <span className="text-2xl">{origin.flag}</span>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-[#2C1810]">{origin.region}</span>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-[#8B5E3C]">⬆ {origin.elevation}</span>
                        <span className="text-xs text-[#C4A882]">{origin.varieties}</span>
                      </div>
                    </div>
                    <Link
                      to="/shop"
                      className="text-xs text-[#8B5E3C] hover:text-[#2C1810] flex items-center gap-1"
                    >
                      Shop <ArrowRight size={11} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-3xl overflow-hidden aspect-[16/9]">
                <img src={CUPPING_IMG} alt="Cupping session" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-3xl overflow-hidden aspect-[16/9]">
                <img src={PROCESSING_IMG} alt="Coffee processing" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs tracking-widest uppercase text-[#8B5E3C] mb-4 block">The People</span>
            <h2 className="font-serif text-4xl text-[#2C1810] mb-4">The Faces of Fondo</h2>
            <p className="text-[#8B5E3C] max-w-xl mx-auto">
              We are a small team of coffee professionals who share a deep respect for Vietnamese
              coffee culture and the people who make it possible.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {team.map((member, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 rounded-full bg-[#2C1810] flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#C4A882] font-serif text-xl">{member.initials}</span>
                </div>
                <h4 className="text-[#2C1810] text-sm mb-0.5">{member.name}</h4>
                <p className="text-xs text-[#8B5E3C]">{member.role}</p>
                <span className="inline-block mt-2 text-xs bg-[#F0E4D4] text-[#8B5E3C] px-2.5 py-0.5 rounded-full">
                  {member.credential}
                </span>
              </div>
            ))}
          </div>
          <div className="bg-[#2C1810] rounded-3xl p-10 md:p-14 text-center">
            <Users size={32} className="text-[#C4A882] mx-auto mb-5" />
            <h2 className="font-serif text-3xl text-[#FAF3EB] mb-4">
              Come Be Part of the Foundation
            </h2>
            <p className="text-[#C4A882] max-w-xl mx-auto mb-8 leading-relaxed">
              Fondo is more than a coffee shop — it is a gathering place. Whether you are a daily
              regular, a coffee curious beginner, or a seasoned enthusiast, there is a seat here for you.
              Come taste what Vietnam grows.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <Link
                to="/shop"
                className="flex-1 py-3.5 bg-[#C4A882] text-[#2C1810] rounded-full font-medium hover:bg-[#E8D0B5] transition-colors text-sm"
              >
                Browse Our Coffees
              </Link>
              <Link
                to="/guides"
                className="flex-1 py-3.5 border border-[#C4A882] text-[#C4A882] rounded-full hover:bg-[#C4A882]/10 transition-colors text-sm"
              >
                Read Brewing Guides
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
