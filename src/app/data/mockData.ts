export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  price: number;
  originalPrice?: number;
  stock: number;
  roastLevel?: 'Light' | 'Medium' | 'Dark';
  origin?: string;
  processingMethod?: 'Washed' | 'Natural' | 'Anaerobic' | 'Honey';
  description: string;
  shortDescription: string;
  image: string;
  rating: number;
  reviewCount: number;
  weight?: string;
  flavorNotes?: string[];
  featured?: boolean;
  badge?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: Address;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Customer';
  joinDate: string;
  orderCount: number;
  totalSpent: number;
  status: 'Active' | 'Inactive';
}

export const categories: Category[] = [
  { id: 'cat-1', name: 'Whole Bean', slug: 'whole-bean', description: 'Fresh whole beans for the ultimate grind experience', productCount: 6 },
  { id: 'cat-2', name: 'Ground Coffee', slug: 'ground', description: 'Pre-ground for convenience without compromise', productCount: 3 },
  { id: 'cat-3', name: 'Accessories', slug: 'accessories', description: 'Premium brewing tools and equipment', productCount: 2 },
];

export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'Ethiopia Yirgacheffe',
    categoryId: 'cat-1',
    categoryName: 'Whole Bean',
    price: 22.00,
    stock: 48,
    roastLevel: 'Light',
    origin: 'Ethiopia',
    processingMethod: 'Washed',
    description: 'Grown at high altitudes in the birthplace of coffee, this Yirgacheffe delivers an exceptionally clean cup with bright acidity. Hand-picked from smallholder farms at 1800–2200m elevation, then carefully washed to highlight the natural clarity of the bean.',
    shortDescription: 'Bright, floral, and clean with jasmine and bergamot.',
    image: 'https://images.unsplash.com/photo-1680338703568-fc868bef34da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWdodCUyMHJvYXN0JTIwY29mZmVlJTIwYmVhbnMlMjBjbG9zZSUyMHVwfGVufDF8fHx8MTc3NjMyNjUxOXww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.9,
    reviewCount: 128,
    weight: '250g',
    flavorNotes: ['Jasmine', 'Bergamot', 'Peach', 'Lemon Zest'],
    featured: true,
    badge: 'Bestseller',
  },
  {
    id: 'prod-2',
    name: 'Colombia Huila',
    categoryId: 'cat-1',
    categoryName: 'Whole Bean',
    price: 19.50,
    originalPrice: 24.00,
    stock: 62,
    roastLevel: 'Medium',
    origin: 'Colombia',
    processingMethod: 'Washed',
    description: 'Sourced from family farms in the Huila department, nestled in the Andes mountains. This single-origin gem is known for its perfectly balanced profile — sweet, complex, and approachable. Ideal as a daily driver.',
    shortDescription: 'Caramel sweetness balanced with a bright, clean finish.',
    image: 'https://images.unsplash.com/photo-1765533220772-b83d18341db8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGVjaWFsdHklMjBjb2ZmZWUlMjBiZWFucyUyMGJhZyUyMHJvYXN0ZXJ5fGVufDF8fHx8MTc3NjMyNjUxOHww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.7,
    reviewCount: 95,
    weight: '250g',
    flavorNotes: ['Caramel', 'Red Apple', 'Hazelnut', 'Brown Sugar'],
    featured: true,
    badge: 'Sale',
  },
  {
    id: 'prod-3',
    name: 'Guatemala Antigua',
    categoryId: 'cat-1',
    categoryName: 'Whole Bean',
    price: 18.00,
    stock: 35,
    roastLevel: 'Dark',
    origin: 'Guatemala',
    processingMethod: 'Natural',
    description: 'From the volcanic soils of Antigua, Guatemala, this dark roast carries the rich, smoky character that espresso lovers crave. The natural processing amplifies its body, resulting in a deeply satisfying cup with a lingering finish.',
    shortDescription: 'Full-bodied, bold espresso with deep chocolate notes.',
    image: 'https://images.unsplash.com/photo-1646325742177-21f298f470c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwcm9hc3QlMjBjb2ZmZWUlMjBlc3ByZXNzb3xlbnwxfHx8fDE3NzYzMjY1MjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.6,
    reviewCount: 77,
    weight: '250g',
    flavorNotes: ['Dark Chocolate', 'Walnut', 'Tobacco', 'Molasses'],
    featured: true,
  },
  {
    id: 'prod-4',
    name: 'Kenya AA',
    categoryId: 'cat-1',
    categoryName: 'Whole Bean',
    price: 26.00,
    stock: 24,
    roastLevel: 'Light',
    origin: 'Kenya',
    processingMethod: 'Washed',
    description: 'Kenya AA represents the country\'s highest grade, with beans selected for their size, density, and cup quality. This lot from the Kirinyaga region exhibits the unmistakable "Kenya brightness" — a vibrant, wine-like acidity with incredible complexity.',
    shortDescription: 'Vibrant wine-like acidity with blackcurrant and citrus.',
    image: 'https://images.unsplash.com/photo-1633275858168-d53d224b2a8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxFdGhpb3BpYSUyMGNvZmZlZSUyMGZhcm0lMjBvcmlnaW58ZW58MXx8fHwxNzc2MzI2NTI5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.8,
    reviewCount: 64,
    weight: '250g',
    flavorNotes: ['Blackcurrant', 'Grapefruit', 'Tomato', 'Black Tea'],
    featured: false,
    badge: 'Limited',
  },
  {
    id: 'prod-5',
    name: 'Costa Rica Tarrazu',
    categoryId: 'cat-1',
    categoryName: 'Whole Bean',
    price: 24.50,
    stock: 41,
    roastLevel: 'Medium',
    origin: 'Costa Rica',
    processingMethod: 'Anaerobic',
    description: 'This experimental lot from the Tarrazu region undergoes anaerobic fermentation before drying, a modern processing technique that pushes flavor boundaries. The result is a wildly expressive coffee with tropical fruit notes and a syrupy, wine-like body.',
    shortDescription: 'Experimental anaerobic with tropical fruit and wine notes.',
    image: 'https://images.unsplash.com/photo-1559648617-374af4ae6c2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicmV3aW5nJTIwcG91ciUyMG92ZXIlMjBiYXJpc3RhfGVufDF8fHx8MTc3NjIxMzE4MHww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.7,
    reviewCount: 43,
    weight: '250g',
    flavorNotes: ['Mango', 'Passionfruit', 'Red Wine', 'Honey'],
    featured: false,
    badge: 'New',
  },
  {
    id: 'prod-6',
    name: 'Panama Geisha',
    categoryId: 'cat-1',
    categoryName: 'Whole Bean',
    price: 48.00,
    stock: 12,
    roastLevel: 'Light',
    origin: 'Panama',
    processingMethod: 'Washed',
    description: 'The legendary Geisha variety from Panama — the most celebrated coffee in the world. Grown on Boquete\'s misty slopes, each lot is separated and cupped individually. What ends up in your bag is nothing short of an extraordinary coffee experience.',
    shortDescription: 'The world\'s most celebrated variety — floral, tea-like, extraordinary.',
    image: 'https://images.unsplash.com/photo-1672851612794-6687bf0bf1a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDb2xvbWJpYSUyMGNvZmZlZSUyMHBsYW50YXRpb24lMjBoYXJ2ZXN0fGVufDF8fHx8MTc3NjMyNjUzNXww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 5.0,
    reviewCount: 31,
    weight: '100g',
    flavorNotes: ['Jasmine Tea', 'Stone Fruit', 'Elderflower', 'Honey'],
    featured: false,
    badge: 'Rare',
  },
  {
    id: 'prod-7',
    name: 'Brazil Santos Ground',
    categoryId: 'cat-2',
    categoryName: 'Ground Coffee',
    price: 15.00,
    stock: 89,
    roastLevel: 'Medium',
    origin: 'Brazil',
    processingMethod: 'Natural',
    description: 'Brazil Santos is the quintessential everyday espresso base — naturally processed for a fuller body and roasted to a smooth medium. Our ground version is milled to espresso fineness, ready to drop straight into your portafilter.',
    shortDescription: 'Classic smooth espresso base, naturally processed.',
    image: 'https://images.unsplash.com/photo-1769266018588-3aaff4f2ec06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91bmQlMjBjb2ZmZWUlMjBwb3dkZXIlMjBjbG9zZSUyMHVwfGVufDF8fHx8MTc3NjMyNjUyMnww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.5,
    reviewCount: 112,
    weight: '250g',
    flavorNotes: ['Chocolate', 'Almond', 'Caramel', 'Cream'],
    featured: true,
  },
  {
    id: 'prod-8',
    name: 'Sumatra Mandheling Ground',
    categoryId: 'cat-2',
    categoryName: 'Ground Coffee',
    price: 16.50,
    stock: 57,
    roastLevel: 'Dark',
    origin: 'Indonesia',
    processingMethod: 'Natural',
    description: 'Processed using Indonesia\'s unique "wet-hulled" method, this Mandheling ground coffee is unlike anything else. Its earthy, full body with a low acidity makes it a favorite for those who prefer an intense, bold cup first thing in the morning.',
    shortDescription: 'Earthy, bold, and intensely full-bodied.',
    image: 'https://images.unsplash.com/photo-1585594467309-b726b6ba2fb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdW0lMjByb2FzdCUyMGNvZmZlZSUyMGxhdHRlJTIwYXJ0fGVufDF8fHx8MTc3NjMyNjUyOXww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.4,
    reviewCount: 68,
    weight: '250g',
    flavorNotes: ['Cedar', 'Dark Chocolate', 'Dried Herbs', 'Tobacco'],
    featured: false,
  },
  {
    id: 'prod-9',
    name: 'Peru Organic Ground',
    categoryId: 'cat-2',
    categoryName: 'Ground Coffee',
    price: 17.00,
    stock: 44,
    roastLevel: 'Medium',
    origin: 'Peru',
    processingMethod: 'Washed',
    description: 'Certified organic and shade-grown by indigenous cooperatives in the Cajamarca highlands, this Peruvian ground coffee embodies sustainable sourcing done right. Gentle sweetness and clean finish make it perfect for filter coffee or French press.',
    shortDescription: 'Clean, gentle, and sustainable — ideal for filter brewing.',
    image: 'https://images.unsplash.com/photo-1775451152836-e68a116b48c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjByb2FzdGluZyUyMHByb2Nlc3MlMjBiZWFuc3xlbnwxfHx8fDE3NzYzMjY1MzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.6,
    reviewCount: 55,
    weight: '250g',
    flavorNotes: ['Milk Chocolate', 'Walnut', 'Sweet Citrus', 'Honey'],
    featured: false,
    badge: 'Organic',
  },
  {
    id: 'prod-10',
    name: 'Hario V60 Pour Over Kit',
    categoryId: 'cat-3',
    categoryName: 'Accessories',
    price: 45.00,
    stock: 18,
    description: 'The iconic Hario V60 ceramic dripper bundled with a server, 100 tabbed paper filters, and a measuring spoon. The spiral ridges and large single hole give you complete control over brew time — the preferred setup of world barista champions.',
    shortDescription: 'Complete V60 pour-over starter kit for the discerning brewer.',
    image: 'https://images.unsplash.com/photo-1764807504818-a704510e2a21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBhY2Nlc3NvcmllcyUyMGRyaXBwZXIlMjBrZXR0bGV8ZW58MXx8fHwxNzc2MzI2NTI5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.9,
    reviewCount: 89,
    featured: true,
    badge: 'Top Pick',
  },
  {
    id: 'prod-11',
    name: 'Fellow Stagg EKG Kettle',
    categoryId: 'cat-3',
    categoryName: 'Accessories',
    price: 165.00,
    stock: 9,
    description: 'The Fellow Stagg EKG is the gold standard in electric gooseneck kettles. Precision temperature control (1°F), a hold mode that maintains your target temp for 60 minutes, and a counterbalanced handle make this the perfect companion for any pour-over enthusiast.',
    shortDescription: 'Precision gooseneck kettle for professional pour-over control.',
    image: 'https://images.unsplash.com/photo-1726922853685-564851ca79d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxKYXBhbiUyMGNvZmZlZSUyMHNob3AlMjBtaW5pbWFsaXN0JTIwY2xlYW58ZW58MXx8fHwxNzc2MzI2NTM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.8,
    reviewCount: 42,
    featured: false,
    badge: 'Premium',
  },
];

export const orders: Order[] = [
  {
    id: 'ORD-2024-001',
    customerId: 'user-3',
    customerName: 'Sarah Mitchell',
    customerEmail: 'sarah.m@email.com',
    date: '2024-04-12',
    status: 'Completed',
    items: [
      { productId: 'prod-1', productName: 'Ethiopia Yirgacheffe', quantity: 2, price: 22.00, image: products[0].image },
      { productId: 'prod-10', productName: 'Hario V60 Pour Over Kit', quantity: 1, price: 45.00, image: products[9].image },
    ],
    subtotal: 89.00,
    shipping: 5.99,
    total: 94.99,
    shippingAddress: { street: '123 Oak Lane', city: 'Portland', state: 'OR', zip: '97201', country: 'USA' },
  },
  {
    id: 'ORD-2024-002',
    customerId: 'user-4',
    customerName: 'James Hartwell',
    customerEmail: 'j.hartwell@email.com',
    date: '2024-04-13',
    status: 'Shipped',
    items: [
      { productId: 'prod-2', productName: 'Colombia Huila', quantity: 1, price: 19.50, image: products[1].image },
      { productId: 'prod-7', productName: 'Brazil Santos Ground', quantity: 2, price: 15.00, image: products[6].image },
    ],
    subtotal: 49.50,
    shipping: 5.99,
    total: 55.49,
    shippingAddress: { street: '456 Maple Ave', city: 'Seattle', state: 'WA', zip: '98101', country: 'USA' },
  },
  {
    id: 'ORD-2024-003',
    customerId: 'user-5',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.s@email.com',
    date: '2024-04-14',
    status: 'Processing',
    items: [
      { productId: 'prod-6', productName: 'Panama Geisha', quantity: 1, price: 48.00, image: products[5].image },
    ],
    subtotal: 48.00,
    shipping: 0,
    total: 48.00,
    shippingAddress: { street: '789 Pine St', city: 'San Francisco', state: 'CA', zip: '94102', country: 'USA' },
  },
  {
    id: 'ORD-2024-004',
    customerId: 'user-6',
    customerName: 'Marcus Chen',
    customerEmail: 'mchen@email.com',
    date: '2024-04-15',
    status: 'Pending',
    items: [
      { productId: 'prod-11', productName: 'Fellow Stagg EKG Kettle', quantity: 1, price: 165.00, image: products[10].image },
      { productId: 'prod-4', productName: 'Kenya AA', quantity: 2, price: 26.00, image: products[3].image },
    ],
    subtotal: 217.00,
    shipping: 0,
    total: 217.00,
    shippingAddress: { street: '321 Birch Rd', city: 'Austin', state: 'TX', zip: '78701', country: 'USA' },
  },
  {
    id: 'ORD-2024-005',
    customerId: 'user-3',
    customerName: 'Sarah Mitchell',
    customerEmail: 'sarah.m@email.com',
    date: '2024-04-10',
    status: 'Completed',
    items: [
      { productId: 'prod-5', productName: 'Costa Rica Tarrazu', quantity: 1, price: 24.50, image: products[4].image },
      { productId: 'prod-9', productName: 'Peru Organic Ground', quantity: 1, price: 17.00, image: products[8].image },
    ],
    subtotal: 41.50,
    shipping: 5.99,
    total: 47.49,
    shippingAddress: { street: '123 Oak Lane', city: 'Portland', state: 'OR', zip: '97201', country: 'USA' },
  },
];

export const users: User[] = [
  {
    id: 'user-1',
    name: 'Alex Roaster',
    email: 'admin@artisanbean.com',
    role: 'Admin',
    joinDate: '2023-01-15',
    orderCount: 0,
    totalSpent: 0,
    status: 'Active',
  },
  {
    id: 'user-2',
    name: 'Maria Barista',
    email: 'maria@artisanbean.com',
    role: 'Admin',
    joinDate: '2023-03-22',
    orderCount: 0,
    totalSpent: 0,
    status: 'Active',
  },
  {
    id: 'user-3',
    name: 'Sarah Mitchell',
    email: 'sarah.m@email.com',
    role: 'Customer',
    joinDate: '2023-08-10',
    orderCount: 2,
    totalSpent: 142.48,
    status: 'Active',
  },
  {
    id: 'user-4',
    name: 'James Hartwell',
    email: 'j.hartwell@email.com',
    role: 'Customer',
    joinDate: '2023-11-05',
    orderCount: 1,
    totalSpent: 55.49,
    status: 'Active',
  },
  {
    id: 'user-5',
    name: 'Priya Sharma',
    email: 'priya.s@email.com',
    role: 'Customer',
    joinDate: '2024-01-20',
    orderCount: 1,
    totalSpent: 48.00,
    status: 'Active',
  },
  {
    id: 'user-6',
    name: 'Marcus Chen',
    email: 'mchen@email.com',
    role: 'Customer',
    joinDate: '2024-02-14',
    orderCount: 1,
    totalSpent: 217.00,
    status: 'Active',
  },
  {
    id: 'user-7',
    name: 'Elena Vasquez',
    email: 'e.vasquez@email.com',
    role: 'Customer',
    joinDate: '2024-03-01',
    orderCount: 0,
    totalSpent: 0,
    status: 'Inactive',
  },
];
