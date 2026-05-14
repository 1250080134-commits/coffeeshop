import { useState, useEffect } from 'react';
import { Clock, Thermometer, Coffee, ChevronDown, ChevronUp, ArrowRight, Droplets, Star, BookOpen } from 'lucide-react';
import { Link } from 'react-router';
import { Footer } from '../components/Footer';
import { api, ApiBrewingGuide } from '../services/api';

// ── Images ─────────────────────────────────────────────────────────────────────
const IMG_POUR_OVER   = 'https://images.unsplash.com/photo-1748894851733-be6747a9c061?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3VyJTIwb3ZlciUyMGNvZmZlZSUyMGJyZXdpbmclMjBtZXRob2QlMjBiYXJpc3RhfGVufDF8fHx8MTc3ODEyNzk2N3ww&ixlib=rb-4.1.0&q=80&w=1080';
const IMG_ESPRESSO    = 'https://images.unsplash.com/photo-1762657424875-8ec26d3db9f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3ByZXNzbyUyMG1hY2hpbmUlMjBjb2ZmZWUlMjBleHRyYWN0aW9uJTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NzgxMjc5Njh8MA&ixlib=rb-4.1.0&q=80&w=1080';
const IMG_MOKA        = 'https://images.unsplash.com/photo-1585683034983-b8c9d72a095a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2thJTIwcG90JTIwc3RvdmV0b3AlMjBjb2ZmZWUlMjBicmV3aW5nJTIwSXRhbGlhbnxlbnwxfHx8fDE3NzgxMjc5Njh8MA&ixlib=rb-4.1.0&q=80&w=1080';
const IMG_FRENCH      = 'https://images.unsplash.com/photo-1646799935616-1992b36d254e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVuY2glMjBwcmVzcyUyMGNvZmZlZSUyMHBsdW5nZXIlMjBicmV3aW5nJTIwbW9ybmluZ3xlbnwxfHx8fDE3NzgxMjc5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080';
const IMG_AEROPRESS   = 'https://images.unsplash.com/photo-1598639298075-9f62f1fc5463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBhZXJvcHJlc3MlMjBjaGVtZXglMjBicmV3aW5nJTIwYWx0ZXJuYXRpdmUlMjBtZXRob2RzfGVufDF8fHx8MTc3ODEyNzk3MXww&ixlib=rb-4.1.0&q=80&w=1080';
const IMG_COLD_BREW   = 'https://images.unsplash.com/photo-1495221521568-8b714b2cb6fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xkJTIwYnJldyUyMGNvZmZlZSUyMGltbWVyc2lvbiUyMGdsYXNzJTIwamFyJTIwZHJpcHxlbnwxfHx8fDE3NzgxMjc5NzV8MA&ixlib=rb-4.1.0&q=80&w=1080';

// ── Types ───────────────────────────────────────────────────────────────────────
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

interface BrewingGuide {
  id: string;
  name: string;
  tagline: string;
  image: string;
  difficulty: Difficulty;
  brewTime: string;
  waterTemp: string;
  grindSize: string;
  grindDetail: string;
  ratio: string;
  yield: string;
  equipment: string[];
  steps: { title: string; detail: string }[];
  proTips: string[];
  bestWith: string;
  flavorProfile: string;
  recommendedRoast: string;
}

// ── Guide Data ──────────────────────────────────────────────────────────────────
const guides: BrewingGuide[] = [
  {
    id: 'pour-over',
    name: 'Pour Over',
    tagline: 'Clarity, control, and extraordinary nuance',
    image: IMG_POUR_OVER,
    difficulty: 'Intermediate',
    brewTime: '4–5 min',
    waterTemp: '90–96 °C / 194–205 °F',
    grindSize: 'Medium-Fine',
    grindDetail: 'Similar to table salt. Too fine = bitter over-extraction; too coarse = sour under-extraction.',
    ratio: '1 : 15',
    yield: '300 ml',
    equipment: ['V60 or Kalita Wave dripper', 'Paper filter (rinsed)', 'Gooseneck kettle', 'Scale (0.1 g precision)', 'Timer', 'Server or cup', '20 g coffee'],
    steps: [
      { title: 'Preheat & Rinse', detail: 'Place filter in dripper, rinse with hot water to eliminate paper taste. This also preheats your server and dripper. Discard rinse water.' },
      { title: 'Weigh & Grind', detail: 'Grind 20 g of coffee fresh. Aim for medium-fine (table salt). Pour grounds into the filter and give the dripper a gentle shake to level.' },
      { title: 'Bloom — 0:00–0:30', detail: 'Start timer. Pour 40 g (2× coffee weight) of 93 °C water in a slow spiral from the centre outward. Watch the grounds swell and bubble — this is CO₂ escaping (degassing). Wait 30 s.' },
      { title: 'First Pour — 0:30–1:15', detail: 'Slowly pour another 100 g in a spiral pattern, keeping water off the filter walls. Maintain a gentle, consistent flow from the gooseneck. Total: 140 g.' },
      { title: 'Second Pour — 1:15–2:00', detail: 'Add 80 g more in the same spiral pattern. Keep water level about 1 cm below the dripper rim. Total: 220 g.' },
      { title: 'Final Pour — 2:00–2:45', detail: 'Add the final 80 g. The bed should look flat and even at the end of each pour. Total water: 300 g.' },
      { title: 'Wait for Drawdown', detail: 'Let the coffee fully drain. Target total brew time: 4:00–4:30. Faster = too coarse; slower = too fine. Adjust grind accordingly for next brew.' },
    ],
    proTips: [
      'Water quality matters enormously. Use filtered water with 75–150 ppm TDS.',
      'A gooseneck kettle is non-negotiable for pour control — standard kettles pour too aggressively.',
      'Bloom aggressively for fresh coffee (roasted <2 weeks ago), or extend to 45 s.',
      'Swirl the server gently after brewing to integrate the layers before pouring.',
    ],
    bestWith: 'Light to medium roasts from washed-process origins',
    flavorProfile: 'Clean, bright, transparent — highlights subtle floral and fruit notes',
    recommendedRoast: 'Ethiopia Yirgacheffe · Kenya AA · Colombia Huila',
  },
  {
    id: 'espresso',
    name: 'Espresso',
    tagline: 'Concentrated intensity — the foundation of all café drinks',
    image: IMG_ESPRESSO,
    difficulty: 'Advanced',
    brewTime: '25–30 sec',
    waterTemp: '90–94 °C / 194–201 °F',
    grindSize: 'Fine',
    grindDetail: 'Finer than table salt, almost powdery. The single most impactful variable in espresso — adjust by ±1 click at a time.',
    ratio: '1 : 2 (in : out)',
    yield: '36–40 g espresso from 18–20 g dose',
    equipment: ['Espresso machine (9 bar)', 'Precision grinder (burr)', 'Portafilter & basket', 'Distribution tool', 'Calibrated tamper', 'Scale (0.1 g)', 'Shot glasses'],
    steps: [
      { title: 'Warm Up & Flush', detail: 'Run water through the group head for 10 s to stabilise temperature. Ensure your portafilter is pre-heated. Temperature stability is critical for consistency.' },
      { title: 'Dose', detail: 'Grind 18–20 g of coffee into the portafilter basket. The dose affects extraction time — heavier doses slow flow, lighter doses speed it up.' },
      { title: 'Distribute', detail: 'Use a distribution tool or the "Stockfleth" hand technique to level the grounds evenly. An even bed prevents channelling, the #1 cause of bad espresso.' },
      { title: 'Tamp', detail: 'Apply 15–20 kg of even, level pressure with your tamper. The goal is a uniformly compressed puck with no cracks or tilt. Twist lightly to polish.' },
      { title: 'Lock In & Start', detail: 'Lock portafilter into the group head immediately after tamping. Start your scale and press brew. Aim for first drops at 7–10 seconds.' },
      { title: 'Extract', detail: 'Target: 36–40 g of liquid espresso in 25–30 seconds. Stop the shot by weight, not time. If outside target, adjust grind fineness for next shot.' },
      { title: 'Evaluate', detail: 'A well-extracted shot has a tiger-striped crema that holds for 2+ minutes. Taste: balanced sweetness, acidity, and bitterness. No single note should dominate.' },
    ],
    proTips: [
      'Pre-infusion (2–5 s at low pressure) reduces channelling significantly if your machine supports it.',
      'Change one variable at a time. Grind → dose → temperature. Never all three simultaneously.',
      'A bottomless portafilter reveals channelling issues immediately — invaluable for dialling in.',
      'Flush blind baskets and group head screens weekly with backflush detergent.',
    ],
    bestWith: 'Medium-dark to dark single-origins or blends with body and sweetness',
    flavorProfile: 'Intense, syrupy, complex — chocolate, caramel, and origin-specific notes condensed',
    recommendedRoast: 'Guatemala Antigua · Brazil Santos · Colombia Huila',
  },
  {
    id: 'moka-pot',
    name: 'Moka Pot',
    tagline: 'The Italian stovetop classic — bold and accessible',
    image: IMG_MOKA,
    difficulty: 'Beginner',
    brewTime: '5–7 min',
    waterTemp: 'Pre-boiled water (~95 °C)',
    grindSize: 'Medium-Fine',
    grindDetail: 'Slightly coarser than espresso — similar to fine sea salt. Too fine causes bitter extraction and pressure build-up.',
    ratio: 'Basket determines dose',
    yield: '120–180 ml (depending on pot size)',
    equipment: ['Moka pot (aluminium or steel)', 'Stove or gas burner', 'Pre-boiled water', 'Coffee (medium-fine grind)', 'Oven mitts or cloth'],
    steps: [
      { title: 'Use Pre-Boiled Water', detail: 'This is the most important tip for a good Moka pot: fill the bottom chamber with water that\'s already hot (just below boiling). Cold water prolongs heat exposure and causes bitter extraction.' },
      { title: 'Fill the Basket', detail: 'Add finely ground coffee to the metal basket. Fill to the brim but do not tamp — just level with your finger. Tamping creates too much resistance and can damage the gasket.' },
      { title: 'Assemble', detail: 'Screw the top and bottom chambers together firmly but carefully — the bottom is hot. Use a cloth to protect your hands. Ensure the rubber gasket is seated correctly.' },
      { title: 'Low & Slow Heat', detail: 'Place on stove over low-medium heat with the lid open. Low heat is key — it slows extraction and reduces bitterness. High heat causes the water to push through too quickly.' },
      { title: 'Watch for Coffee', detail: 'After 3–4 minutes, golden-blonde coffee begins bubbling into the top chamber. Watch this carefully — it should be a steady, gentle flow, not a violent sputter.' },
      { title: 'Remove at First Splutter', detail: 'As soon as you hear a hissing/sputtering sound (or the chamber is about 80% full), remove from heat. That sound signals the water is nearly exhausted and steam is entering.' },
      { title: 'Cool the Base', detail: 'Run cold water over the bottom chamber or place on a damp cloth. This stops extraction and prevents bitter, over-cooked notes. Serve immediately.' },
    ],
    proTips: [
      'Never tamp the grounds — the Moka pot uses steam pressure, not pump pressure.',
      'Medium-dark roasts work exceptionally well; avoid very light roasts which can taste sour.',
      'Clean your Moka pot with water only — no soap. Soap strips the seasoning that builds up.',
      'Aluminium pots require seasoning with the first 2–3 brews before the coffee tastes right.',
    ],
    bestWith: 'Medium-dark to dark roasts, or blends designed for espresso',
    flavorProfile: 'Bold, full-bodied, slightly bitter — rich and aromatic with a heavy texture',
    recommendedRoast: 'Guatemala Antigua · Brazil Santos Ground · Sumatra Mandheling',
  },
  {
    id: 'french-press',
    name: 'French Press',
    tagline: 'Full immersion brewing — rich body and effortless simplicity',
    image: IMG_FRENCH,
    difficulty: 'Beginner',
    brewTime: '4 min steep',
    waterTemp: '93–96 °C / 199–205 °F',
    grindSize: 'Coarse',
    grindDetail: 'Similar to coarse sea salt or breadcrumbs. The metal mesh filter allows fine grounds to pass, so coarse grind prevents grit in the cup.',
    ratio: '1 : 15',
    yield: '400–600 ml',
    equipment: ['French press (glass or steel)', 'Gooseneck or standard kettle', 'Scale', 'Timer', 'Spoon or paddle', '27–40 g coffee'],
    steps: [
      { title: 'Preheat the Press', detail: 'Fill your French press with hot water and let sit for 30 s. Pour out the water. Preheating prevents thermal shock that cools your brew water and causes under-extraction.' },
      { title: 'Grind & Measure', detail: 'Grind 27 g of coffee to coarse — roughly like breadcrumbs or coarse sea salt. Add to the preheated press. Using a scale is highly recommended.' },
      { title: 'Start the Bloom', detail: 'Start timer. Add 54 g (double the coffee weight) of 93 °C water. Give a gentle stir to ensure all grounds are saturated. Bloom for 30 s.' },
      { title: 'Add Remaining Water', detail: 'Pour the remaining water (346 g) slowly over the grounds, filling to 2 cm below the top. Place the lid (plunger up) to retain heat. Do not plunge yet.' },
      { title: 'Steep for 4 Minutes', detail: 'Leave undisturbed for 4 full minutes. You can experiment with 3:30 for brighter cups or 4:30 for richer body, depending on your preference.' },
      { title: 'Break the Crust', detail: 'At 4 minutes, use a spoon to gently break the crust of grounds floating on the surface. Skim off the foam and loose grounds on top.' },
      { title: 'Plunge & Pour Immediately', detail: 'Plunge slowly and evenly with light, consistent pressure over 20–30 s. Pour all the coffee out immediately — never leave it in the press, or it will over-extract and become bitter.' },
    ],
    proTips: [
      'Pour all coffee out immediately after plunging — do not leave it sitting in the press.',
      'If plunging is difficult, your grind is too fine. If it drops on its own, too coarse.',
      'Adding a finer paper filter step (pour through a V60 paper) creates a cleaner cup without silt.',
      'Steel French presses retain heat better than glass for the full 4-minute steep.',
    ],
    bestWith: 'Medium to dark roasts from natural or honey-processed origins',
    flavorProfile: 'Full-bodied, rounded, oily texture — lower clarity than filter but more mouthfeel',
    recommendedRoast: 'Colombia Huila · Brazil Santos · Peru Organic Ground',
  },
  {
    id: 'aeropress',
    name: 'AeroPress',
    tagline: 'The most versatile brewer ever made',
    image: IMG_AEROPRESS,
    difficulty: 'Intermediate',
    brewTime: '1:30–2 min',
    waterTemp: '80–92 °C / 176–198 °F',
    grindSize: 'Medium-Fine',
    grindDetail: 'Flexible grind range — coarser for longer steep times, finer for shorter. One of the AeroPress\'s greatest advantages is grind versatility.',
    ratio: '1 : 10 to 1 : 14',
    yield: '150–220 ml',
    equipment: ['AeroPress (original or Go)', 'Paper or metal filter', 'Kettle', 'Scale', 'Timer', 'Paddle or spoon', 'Mug', '15–18 g coffee'],
    steps: [
      { title: 'Set Up (Inverted Method)', detail: 'Flip the AeroPress upside down with the plunger partially inserted at number 4. This inverted method prevents premature dripping and gives more control over steep time.' },
      { title: 'Rinse Filter', detail: 'Place a paper filter in the filter cap, rinse with hot water. This removes paper taste. If using a metal filter, no rinsing needed.' },
      { title: 'Add Coffee', detail: 'Add 15 g of medium-fine ground coffee to the inverted AeroPress. Give a gentle tap to level.' },
      { title: 'Bloom at Low Temp', detail: 'Pour 30 g of 85 °C water. The AeroPress works beautifully at lower temperatures than other methods — less bitterness from lower-solubility compounds. Stir 5 times. Wait 30 s.' },
      { title: 'Fill & Steep', detail: 'Add remaining water to reach 150 g total. Stir gently 3 times clockwise. Attach the filter cap tightly. Total steep time: 1 minute from first pour.' },
      { title: 'Flip & Press', detail: 'At 1:00, carefully flip the AeroPress onto your mug. Press down slowly and steadily over 20–30 seconds. Stop when you hear hissing — that\'s air, not coffee.' },
      { title: 'Dilute to Taste', detail: 'The base concentrate can be enjoyed as-is (espresso-style) or diluted with 100–150 g of hot water for an Americano-style cup. Experiment with ratios.' },
    ],
    proTips: [
      'The AeroPress is the best travel brewer — it\'s virtually unbreakable, lightweight, and consistent.',
      'Metal filters produce a fuller body with more oils; paper filters create a cleaner, brighter cup.',
      'Try the "James Hoffmann Ultimate AeroPress Recipe": 11 g coffee, 200 g 99°C water, 2 min steep, no agitation, 30 s press.',
      'Short stir after adding water creates more even extraction than long stirring.',
    ],
    bestWith: 'Any roast level works — highly adaptable to personal taste',
    flavorProfile: 'Variable by recipe — can produce clean filter-style or rich espresso-like results',
    recommendedRoast: 'Costa Rica Tarrazu · Kenya AA · Ethiopia Yirgacheffe',
  },
  {
    id: 'cold-brew',
    name: 'Cold Brew',
    tagline: 'Patience rewarded — smooth, sweet, and ultra-low acidity',
    image: IMG_COLD_BREW,
    difficulty: 'Beginner',
    brewTime: '12–24 hours',
    waterTemp: 'Room temp (20 °C) or refrigerator (4 °C)',
    grindSize: 'Extra Coarse',
    grindDetail: 'Coarser than French press — similar to rough gravel or cracked peppercorns. Fine grounds cause over-extraction in the long steep time.',
    ratio: '1 : 8',
    yield: '400–800 ml concentrate',
    equipment: ['Large jar or pitcher (1 L+)', 'Fine mesh strainer or cheesecloth', 'Coffee filter', 'Scale', '100 g coffee', 'Cold or room-temp filtered water'],
    steps: [
      { title: 'Grind Extra Coarse', detail: 'Grind 100 g of coffee on your coarsest setting — noticeably coarser than French press. Cold extraction is slower, so a coarser grind is needed to prevent over-extraction over 12–24 hours.' },
      { title: 'Combine in Jar', detail: 'Add ground coffee to your jar or pitcher. Pour 800 ml of room-temperature filtered water over the grounds. The coffee-to-water ratio for cold brew concentrate is 1:8.' },
      { title: 'Stir & Submerge', detail: 'Stir gently to ensure all grounds are wet and no dry pockets remain. Press any floating grounds beneath the waterline. Cover loosely with a lid, cloth, or plastic wrap.' },
      { title: 'Room Temp or Fridge?', detail: 'Room temperature (20 °C) brew: 12–14 hours. Results in a slightly brighter, fruitier cup. Refrigerator (4 °C) brew: 18–24 hours. Produces smoother, sweeter results. Both are valid.' },
      { title: 'First Strain', detail: 'After steeping, strain through a fine mesh strainer to remove the bulk of grounds. Pour slowly to avoid disturbing the sediment.' },
      { title: 'Second Strain', detail: 'Pour through a coffee filter or double layer of cheesecloth for a crystal-clear concentrate. This step takes 10–20 minutes but dramatically improves clarity.' },
      { title: 'Store & Dilute', detail: 'Store in a sealed bottle in the fridge for up to 14 days. To serve: dilute 1:1 with water or milk over ice for standard strength, or drink as concentrate for a stronger hit.' },
    ],
    proTips: [
      'Make a double batch — cold brew keeps for 2 weeks and you\'ll go through it faster than you expect.',
      'Nitrogen-infuse by shaking vigorously and pouring over ice for a naturally creamy texture.',
      'Add a pinch of salt to the finished brew — it suppresses bitterness and enhances sweetness.',
      'Medium roasts work better than dark for cold brew — dark roasts can become muddy and astringent.',
    ],
    bestWith: 'Medium natural or honey-processed origins with fruit-forward sweetness',
    flavorProfile: 'Smooth, chocolatey, low acidity — sweet and clean with almost no bitterness',
    recommendedRoast: 'Colombia Huila · Brazil Santos Ground · Peru Organic Ground',
  },
];

// ── Processing Methods ──────────────────────────────────────────────────────────
const processingMethods = [
  {
    name: 'Washed (Wet-Process)',
    tag: 'Washed',
    color: 'bg-blue-100 text-blue-800',
    tagColor: 'bg-blue-600',
    icon: <Droplets size={18} />,
    description: 'The coffee cherry\'s fruit is fully removed before drying. This highlights the bean\'s intrinsic character and the terroir of the growing region.',
    flavorResult: 'Clean, bright, transparent. Higher acidity. Floral and citrus notes are prominent.',
    origins: 'Ethiopia, Colombia, Kenya, Guatemala',
    process: [
      'Cherries de-pulped immediately after harvest',
      'Fermented in water tanks for 24–72 hours to break down mucilage',
      'Washed with clean water to remove fermentation residue',
      'Dried on raised beds or patios for 10–20 days',
    ],
    bestBrewed: 'Pour Over, AeroPress — methods that reward clarity',
  },
  {
    name: 'Natural (Dry-Process)',
    tag: 'Natural',
    color: 'bg-amber-100 text-amber-800',
    tagColor: 'bg-amber-600',
    icon: <Coffee size={18} />,
    description: 'The whole cherry is dried with the fruit intact for weeks, allowing the fruit\'s sugars to ferment directly into the bean.',
    flavorResult: 'Fruity, wine-like, full-bodied. Lower acidity. Blueberry, tropical fruit, and chocolate are common notes.',
    origins: 'Ethiopia (Harrar), Brazil, Yemen',
    process: [
      'Whole intact cherries spread on raised beds or patios',
      'Turned regularly to ensure even drying and prevent mould',
      'Dried slowly for 3–6 weeks as the fruit shrivels and ferments',
      'Hull removed mechanically once fully dry',
    ],
    bestBrewed: 'French Press, Cold Brew — methods that appreciate body and sweetness',
  },
  {
    name: 'Honey Process',
    tag: 'Honey',
    color: 'bg-orange-100 text-orange-800',
    tagColor: 'bg-orange-500',
    icon: <Star size={18} />,
    description: 'A hybrid of washed and natural. The cherry is de-pulped, but some or all of the sticky mucilage (the "honey") is left on the bean during drying.',
    flavorResult: 'Balanced, sweet, and complex. Medium acidity. Caramel, stone fruit, and brown sugar are common.',
    origins: 'Costa Rica, El Salvador, Brazil',
    process: [
      'Cherry de-pulped but mucilage left on (0–100% depending on honey type)',
      'Black Honey: 100% mucilage, 2–6 weeks drying — most complex',
      'Red Honey: ~50% mucilage, 2–3 weeks — balanced',
      'Yellow Honey: ~25% mucilage, 1–2 weeks — lighter, cleaner',
    ],
    bestBrewed: 'Pour Over, Drip — showcases the complex middle ground of sweetness and clarity',
  },
  {
    name: 'Anaerobic Fermentation',
    tag: 'Anaerobic',
    color: 'bg-purple-100 text-purple-800',
    tagColor: 'bg-purple-600',
    icon: <BookOpen size={18} />,
    description: 'An experimental modern method where cherries ferment in sealed tanks with no oxygen, creating unique aromatic compounds not found in traditional methods.',
    flavorResult: 'Intense, polarising, and experimental. Wine-like, tropical, sometimes funky. High complexity and uniqueness.',
    origins: 'Costa Rica, Panama, Colombia (emerging everywhere)',
    process: [
      'Whole or de-pulped cherries sealed in pressurised tanks',
      'CO₂ fills the tank, creating an oxygen-free environment',
      'Fermentation time: 24–200 hours depending on style',
      'Dried after fermentation — washed or natural finish',
    ],
    bestBrewed: 'AeroPress, Pour Over — to capture the full complexity',
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────────
const difficultyConfig: Record<Difficulty, { color: string; bg: string }> = {
  Beginner:     { color: 'text-[#4A6741]',  bg: 'bg-[#4A6741]/10' },
  Intermediate: { color: 'text-amber-700',   bg: 'bg-amber-100' },
  Advanced:     { color: 'text-red-700',     bg: 'bg-red-100' },
};

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#F0E4D4] rounded-xl p-3 text-center">
      <p className="text-xs text-[#8B5E3C] mb-0.5">{label}</p>
      <p className="text-sm text-[#2C1810] leading-snug">{value}</p>
    </div>
  );
}

// ── Component ───────────────────────────────────────────────────────────────────
export function BrewingGuidesPage() {
  const [activeGuide, setActiveGuide] = useState<string>('pour-over');
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});
  const [filterDifficulty, setFilterDifficulty] = useState<'All' | Difficulty>('All');
  // API-loaded guides; fall back to static guides if the endpoint returns nothing
  const [apiGuides, setApiGuides] = useState<ApiBrewingGuide[] | null>(null);

  useEffect(() => {
    api.guides.getAll()
      .then(res => {
        if (res.data && res.data.length > 0) setApiGuides(res.data);
      })
      .catch(() => { /* silently use static fallback */ });
  }, []);

  // Merge: prefer API data, fall back to local static guides
  const activeGuides: BrewingGuide[] = apiGuides
    ? apiGuides.map(g => ({
        id:              g.slug,
        name:            g.method,
        tagline:         g.tagline ?? '',
        image:           g.image_url ?? '',
        difficulty:      g.difficulty as Difficulty,
        brewTime:        g.brew_time ?? '',
        waterTemp:       g.water_temp ?? '',
        grindSize:       g.grind_size ?? '',
        grindDetail:     g.grind_detail ?? '',
        ratio:           g.ratio ?? '',
        yield:           g.brew_yield ?? '',
        equipment:       g.equipment ?? [],
        steps:           (g.steps as { title: string; detail: string }[]) ?? [],
        proTips:         g.pro_tips ?? [],
        bestWith:        g.best_with ?? '',
        flavorProfile:   g.flavor_profile ?? '',
        recommendedRoast: g.recommended_roast ?? '',
      }))
    : guides;

  const guide = activeGuides.find(g => g.id === activeGuide) ?? activeGuides[0];
  const diff  = guide ? difficultyConfig[guide.difficulty] : difficultyConfig['Beginner'];

  const toggleStep = (stepIdx: number) => {
    const key = `${activeGuide}-${stepIdx}`;
    setExpandedSteps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredGuides = filterDifficulty === 'All'
    ? activeGuides
    : activeGuides.filter(g => g.difficulty === filterDifficulty);

  if (!guide) {
    return (
      <div className="min-h-screen bg-[#FAF3EB] flex items-center justify-center">
        <p className="text-[#8B5E3C]">Loading brewing guides…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF3EB]">

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section
        className="relative py-24 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2C1810 0%, #3d1f10 60%, #4a2c1e 100%)' }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C4A882' fill-opacity='0.4'%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3C/g%3E%3C/svg%3E")` }}
        />
        <div className="relative max-w-7xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 text-[#C4A882] text-xs tracking-widest uppercase mb-5">
            <BookOpen size={13} /> The Fondo Brewing Library
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl text-[#FAF3EB] mb-5 leading-tight">
            Brewing <em className="text-[#C4A882]">Guides</em>
          </h1>
          <p className="text-[#E8D0B5] text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Six methods, technical specifications, step-by-step recipes, and an in-depth look at how coffee 
            processing methods shape the flavors in your cup.
          </p>

          {/* Method quick-select */}
          <div className="flex flex-wrap justify-center gap-2">
            {activeGuides.map(g => (
              <button
                key={g.id}
                onClick={() => setActiveGuide(g.id)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  activeGuide === g.id
                    ? 'bg-[#C4A882] text-[#2C1810] font-medium'
                    : 'bg-[#3D2318] text-[#E8D0B5] hover:bg-[#4a2c1e]'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACTIVE GUIDE DETAIL ────────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* ── Left: Image + quick specs ─────────────────────────────────── */}
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <div className="rounded-3xl overflow-hidden aspect-[4/3] mb-5">
                  <img
                    key={guide.id}
                    src={guide.image}
                    alt={guide.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Quick Specs */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[rgba(44,24,16,0.08)] mb-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-serif text-2xl text-[#2C1810]">{guide.name}</h2>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${diff.bg} ${diff.color}`}>
                      {guide.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-[#8B5E3C] italic mb-4">{guide.tagline}</p>

                  <div className="grid grid-cols-2 gap-2.5">
                    <Pill label="Brew Time"  value={guide.brewTime} />
                    <Pill label="Water Temp" value={guide.waterTemp} />
                    <Pill label="Grind Size" value={guide.grindSize} />
                    <Pill label="Ratio"      value={guide.ratio} />
                  </div>

                  <div className="mt-3 bg-[#F0E4D4] rounded-xl p-3">
                    <p className="text-xs text-[#8B5E3C] mb-1">Grind Detail</p>
                    <p className="text-xs text-[#2C1810] leading-relaxed">{guide.grindDetail}</p>
                  </div>
                </div>

                {/* Equipment */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[rgba(44,24,16,0.08)]">
                  <h3 className="text-sm text-[#2C1810] mb-3">Equipment Needed</h3>
                  <ul className="space-y-1.5">
                    {guide.equipment.map((eq, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-[#8B5E3C]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C4A882] shrink-0" />
                        {eq}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* ── Right: Steps + Pro Tips + Recommendations ─────────────────── */}
            <div className="lg:col-span-3 space-y-8">

              {/* Steps */}
              <div>
                <h3 className="text-[#2C1810] text-xl mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 bg-[#2C1810] rounded-full flex items-center justify-center text-white">
                    <BookOpen size={13} />
                  </span>
                  Step-by-Step Recipe
                </h3>
                <div className="space-y-2.5">
                  {guide.steps.map((step, i) => {
                    const key = `${activeGuide}-${i}`;
                    const expanded = expandedSteps[key] !== false; // default expanded
                    return (
                      <div
                        key={i}
                        className="bg-white rounded-2xl border border-[rgba(44,24,16,0.08)] overflow-hidden"
                      >
                        <button
                          onClick={() => toggleStep(i)}
                          className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[#FAF3EB] transition-colors"
                        >
                          <div className="w-7 h-7 rounded-full bg-[#2C1810] text-[#FAF3EB] flex items-center justify-center text-xs font-medium shrink-0">
                            {i + 1}
                          </div>
                          <span className="flex-1 text-sm font-medium text-[#2C1810]">{step.title}</span>
                          {expanded ? <ChevronUp size={15} className="text-[#8B5E3C]" /> : <ChevronDown size={15} className="text-[#8B5E3C]" />}
                        </button>
                        {expanded && (
                          <div className="px-5 pb-4 pl-16">
                            <p className="text-sm text-[#8B5E3C] leading-relaxed">{step.detail}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pro Tips */}
              <div className="bg-[#2C1810] rounded-2xl p-6">
                <h3 className="text-[#C4A882] mb-4 flex items-center gap-2">
                  <Star size={16} className="fill-[#C4A882] text-[#C4A882]" />
                  Pro Tips
                </h3>
                <ul className="space-y-3">
                  {guide.proTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#E8D0B5]">
                      <span className="w-5 h-5 rounded-full bg-[#C4A882]/20 flex items-center justify-center text-[#C4A882] text-xs shrink-0 mt-0.5">{i + 1}</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-[rgba(44,24,16,0.08)]">
                  <p className="text-xs text-[#8B5E3C] mb-1 uppercase tracking-wider">Best With</p>
                  <p className="text-sm text-[#2C1810]">{guide.bestWith}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-[rgba(44,24,16,0.08)]">
                  <p className="text-xs text-[#8B5E3C] mb-1 uppercase tracking-wider">Flavor Profile</p>
                  <p className="text-sm text-[#2C1810]">{guide.flavorProfile}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-[rgba(44,24,16,0.08)]">
                  <p className="text-xs text-[#8B5E3C] mb-1 uppercase tracking-wider">Try With</p>
                  <p className="text-sm text-[#2C1810]">{guide.recommendedRoast}</p>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-[#F0E4D4] rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1">
                  <p className="text-[#2C1810] font-medium mb-1">Ready to try {guide.name}?</p>
                  <p className="text-sm text-[#8B5E3C]">Shop our recommended beans for this brewing method.</p>
                </div>
                <Link
                  to="/shop"
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#2C1810] text-[#FAF3EB] rounded-full text-sm hover:bg-[#3D2318] transition-colors whitespace-nowrap"
                >
                  Shop Beans <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GUIDE CARDS OVERVIEW ──────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-[#F0E4D4]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2 className="font-serif text-3xl text-[#2C1810]">All Brewing Methods</h2>
              <p className="text-[#8B5E3C] text-sm mt-1">Quick reference — click any method to dive in</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setFilterDifficulty(d)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                    filterDifficulty === d
                      ? 'bg-[#2C1810] text-[#FAF3EB]'
                      : 'bg-white text-[#8B5E3C] hover:bg-[#E8D0B5]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGuides.map(g => {
              const dc = difficultyConfig[g.difficulty];
              return (
                <button
                  key={g.id}
                  onClick={() => { setActiveGuide(g.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`group text-left bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border-2 ${
                    activeGuide === g.id ? 'border-[#2C1810]' : 'border-transparent hover:border-[#C4A882]'
                  }`}
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img src={g.image} alt={g.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                      <h3 className="font-serif text-white text-xl">{g.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${dc.bg} ${dc.color}`}>{g.difficulty}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-[#8B5E3C] italic mb-3">{g.tagline}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-[#8B5E3C]">
                        <Clock size={11} /> {g.brewTime}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[#8B5E3C]">
                        <Thermometer size={11} /> {g.grindSize}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── QUICK REFERENCE TABLE ─────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl text-[#2C1810] mb-2">Quick Reference Table</h2>
            <p className="text-[#8B5E3C]">All brewing parameters at a glance — print it, save it, laminate it.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-[rgba(44,24,16,0.08)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#2C1810] text-[#FAF3EB]">
                    {['Method', 'Difficulty', 'Brew Time', 'Water Temp', 'Grind', 'Ratio', 'Yield'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-medium tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeGuides.map((g, i) => {
                    const dc = difficultyConfig[g.difficulty];
                    return (
                      <tr
                        key={g.id}
                        onClick={() => { setActiveGuide(g.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className={`cursor-pointer transition-colors hover:bg-[#FAF3EB] border-b border-[rgba(44,24,16,0.05)] ${
                          i % 2 === 0 ? '' : 'bg-[#FAF3EB]/50'
                        } ${activeGuide === g.id ? 'bg-[#F0E4D4]' : ''}`}
                      >
                        <td className="px-4 py-3 font-medium text-[#2C1810] whitespace-nowrap">{g.name}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${dc.bg} ${dc.color}`}>{g.difficulty}</span>
                        </td>
                        <td className="px-4 py-3 text-[#8B5E3C] whitespace-nowrap">{g.brewTime}</td>
                        <td className="px-4 py-3 text-[#8B5E3C] whitespace-nowrap">{g.waterTemp.split('/')[0].trim()}</td>
                        <td className="px-4 py-3 text-[#8B5E3C]">{g.grindSize}</td>
                        <td className="px-4 py-3 text-[#8B5E3C] font-mono">{g.ratio}</td>
                        <td className="px-4 py-3 text-[#8B5E3C]">{g.yield}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESSING METHODS ────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-[#2C1810]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs tracking-widest uppercase text-[#C4A882] mb-4 block">Understanding Coffee Science</span>
            <h2 className="font-serif text-4xl text-[#FAF3EB] mb-4">Processing Methods Explained</h2>
            <p className="text-[#C4A882] max-w-2xl mx-auto">
              The method used to remove the coffee cherry's fruit from the bean is one of the most 
              significant variables shaping the flavors in your cup — often more impactful than origin or variety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {processingMethods.map((method, i) => (
              <div key={i} className="bg-[#3D2318] rounded-2xl p-7">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#2C1810] flex items-center justify-center text-[#C4A882]">
                    {method.icon}
                  </div>
                  <div>
                    <h3 className="text-[#FAF3EB]">{method.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full text-white ${method.tagColor}`}>
                      {method.tag}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-[#C4A882] leading-relaxed mb-5">{method.description}</p>

                <div className="space-y-3 mb-5">
                  <div className="bg-[#2C1810] rounded-xl p-3">
                    <p className="text-xs text-[#C4A882]/70 mb-1">Flavor Result</p>
                    <p className="text-sm text-[#E8D0B5]">{method.flavorResult}</p>
                  </div>
                  <div className="bg-[#2C1810] rounded-xl p-3">
                    <p className="text-xs text-[#C4A882]/70 mb-1">Common Origins</p>
                    <p className="text-sm text-[#E8D0B5]">{method.origins}</p>
                  </div>
                  <div className="bg-[#2C1810] rounded-xl p-3">
                    <p className="text-xs text-[#C4A882]/70 mb-1">Best Brewed With</p>
                    <p className="text-sm text-[#E8D0B5]">{method.bestBrewed}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-[#C4A882]/70 uppercase tracking-wider mb-2">The Process</p>
                  <ul className="space-y-2">
                    {method.process.map((step, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-[#C4A882]">
                        <span className="w-4 h-4 rounded-full bg-[#C4A882]/20 flex items-center justify-center text-[#C4A882] shrink-0 mt-0.5">{j + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GRIND SIZE REFERENCE ─────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl text-[#2C1810] mb-2">Grind Size Visual Guide</h2>
            <p className="text-[#8B5E3C]">Grind size is the single most impactful variable you can adjust for any brew method.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(44,24,16,0.08)]">
            {/* Spectrum bar */}
            <div className="relative h-3 rounded-full mb-6 overflow-hidden"
              style={{ background: 'linear-gradient(to right, #8B5E3C, #C4A882, #E8D0B5)' }}
            />
            <div className="flex justify-between text-xs text-[#8B5E3C] mb-8 -mt-2">
              <span>Extra Fine</span>
              <span>Fine</span>
              <span>Med-Fine</span>
              <span>Medium</span>
              <span>Med-Coarse</span>
              <span>Coarse</span>
              <span>Extra Coarse</span>
            </div>

            <div className="space-y-3">
              {[
                { size: 'Extra Fine', texture: 'Powder / Turkish coffee', methods: 'Turkish Coffee', impact: 'Maximum extraction — only for ibriks/cezves', pos: '5%' },
                { size: 'Fine', texture: 'Fine sea salt', methods: 'Espresso', impact: 'High pressure extraction in 25–30 s', pos: '20%' },
                { size: 'Medium-Fine', texture: 'Table salt', methods: 'Pour Over (V60), Moka Pot, AeroPress', impact: 'Balanced extraction — most versatile range', pos: '40%' },
                { size: 'Medium', texture: 'Sand', methods: 'Drip / Flat-bottom pourover (Kalita)', impact: 'Ideal for longer, slower pour-over brews', pos: '55%' },
                { size: 'Coarse', texture: 'Sea salt / breadcrumbs', methods: 'French Press, Percolator', impact: 'Prevents grounds passing through mesh filter', pos: '75%' },
                { size: 'Extra Coarse', texture: 'Rough gravel', methods: 'Cold Brew', impact: 'Prevents over-extraction in 12–24 hr steep', pos: '95%' },
              ].map((row, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-[#FAF3EB] transition-colors">
                  <div className="w-24 shrink-0">
                    <span className="text-xs font-medium text-[#2C1810]">{row.size}</span>
                    <p className="text-xs text-[#8B5E3C] mt-0.5">{row.texture}</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-1.5 mb-1">
                      {row.methods.split(', ').map(m => (
                        <span key={m} className="text-xs bg-[#F0E4D4] text-[#8B5E3C] px-2 py-0.5 rounded-full">{m}</span>
                      ))}
                    </div>
                    <p className="text-xs text-[#8B5E3C]">{row.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-[#F0E4D4]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl text-[#2C1810] mb-4">Ready to Brew Something Exceptional?</h2>
          <p className="text-[#8B5E3C] mb-8 leading-relaxed">
            Every guide above was developed using our single-origin beans. The right bean makes every method better — 
            and we have one for each brewing style.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2C1810] text-[#FAF3EB] rounded-full hover:bg-[#3D2318] transition-colors font-medium"
            >
              Shop All Coffees <ArrowRight size={16} />
            </Link>
            <Link
              to="/story"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[rgba(44,24,16,0.2)] text-[#8B5E3C] rounded-full hover:bg-[#E8D0B5] transition-colors"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
