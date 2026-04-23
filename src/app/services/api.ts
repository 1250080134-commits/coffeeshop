/**
 * services/api.ts
 *
 * Centralised HTTP client for The Artisan Bean Hub frontend.
 * All calls are routed through this module so the base URL and auth header
 * are managed in one place.
 *
 * Usage:
 *   import { api } from './services/api';
 *   const { data } = await api.products.getAll({ roast_level: 'Light' });
 */

// ─── Configuration ────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Auth Token Storage ───────────────────────────────────────────────────────

export const tokenStore = {
  get:    ()             => localStorage.getItem('artisan_token'),
  set:    (t: string)    => localStorage.setItem('artisan_token', t),
  remove: ()             => localStorage.removeItem('artisan_token'),
};

// ─── Base Fetch Wrapper ───────────────────────────────────────────────────────

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

async function request<T = unknown>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { params, ...init } = options;

  // Build query string
  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        qs.append(k, String(v));
      }
    });
    const qsStr = qs.toString();
    if (qsStr) url += `?${qsStr}`;
  }

  // Attach JWT if present
  const token = tokenStore.get();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, { ...init, headers });

  // Parse JSON body
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    body = { success: false, message: 'Invalid response from server.' };
  }

  if (!response.ok) {
    const errorBody = body as { message?: string };
    throw new ApiError(
      errorBody?.message || `HTTP ${response.status}`,
      response.status,
      body,
    );
  }

  return body as T;
}

// ─── Custom Error Class ───────────────────────────────────────────────────────

export class ApiError extends Error {
  status: number;
  body:   unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name   = 'ApiError';
    this.status = status;
    this.body   = body;
  }
}

// ─── Type Definitions ─────────────────────────────────────────────────────────

export interface ApiUser {
  id:         number;
  username:   string;
  email:      string;
  role:       'Admin' | 'Customer';
  is_active:  boolean;
  created_at: string;
}

export interface ApiCategory {
  id:           number;
  name:         string;
  description:  string | null;
  productCount?: number;
}

export interface ApiProduct {
  id:                 number;
  name:               string;
  description:        string | null;
  short_description:  string | null;
  price:              string;        // Sequelize DECIMAL is returned as string
  original_price:     string | null;
  stock:              number;
  roast_level:        'Light' | 'Medium' | 'Dark' | null;
  origin:             string | null;
  processing_method:  'Washed' | 'Natural' | 'Anaerobic' | 'Honey' | null;
  weight:             string | null;
  flavor_notes:       string[] | null;
  image_url:          string | null;
  badge:              string | null;
  rating:             string | null;
  review_count:       number;
  featured:           boolean;
  category_id:        number;
  category?:          ApiCategory;
}

export interface ApiOrderDetail {
  id:         number;
  product_id: number;
  quantity:   number;
  unit_price: string;
  product?:   Pick<ApiProduct, 'id' | 'name' | 'image_url'>;
}

export interface ApiOrder {
  id:               number;
  user_id:          number;
  status:           'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled';
  subtotal:         string;
  shipping_cost:    string;
  total:            string;
  shipping_address: { street: string; city: string; state: string; zip: string; country: string };
  notes:            string | null;
  created_at:       string;
  orderDetails?:    ApiOrderDetail[];
  customer?:        Pick<ApiUser, 'id' | 'username' | 'email'>;
}

export interface Pagination {
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
  hasNext?:   boolean;
  hasPrev?:   boolean;
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export interface AuthResponse {
  success: boolean;
  message: string;
  token:   string;
  user:    ApiUser;
}

const auth = {
  register: (body: { username: string; email: string; password: string }) =>
    request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  getMe: () =>
    request<{ success: boolean; user: ApiUser }>('/auth/me'),
};

// ─── Categories API ───────────────────────────────────────────────────────────

const categories = {
  getAll: () =>
    request<{ success: boolean; data: ApiCategory[] }>('/categories'),

  getById: (id: number) =>
    request<{ success: boolean; data: ApiCategory }>(`/categories/${id}`),

  create: (body: { name: string; description?: string }) =>
    request<{ success: boolean; data: ApiCategory }>('/categories', {
      method: 'POST',
      body:   JSON.stringify(body),
    }),

  update: (id: number, body: { name?: string; description?: string }) =>
    request<{ success: boolean; data: ApiCategory }>(`/categories/${id}`, {
      method: 'PUT',
      body:   JSON.stringify(body),
    }),

  delete: (id: number) =>
    request<{ success: boolean; message: string }>(`/categories/${id}`, { method: 'DELETE' }),
};

// ─── Products API ─────────────────────────────────────────────────────────────

export interface ProductFilters {
  roast_level?:       string;
  origin?:            string;
  processing_method?: string;
  category_id?:       number;
  min_price?:         number;
  max_price?:         number;
  featured?:          boolean;
  sort?:              'price_asc' | 'price_desc' | 'rating_desc' | 'newest';
  page?:              number;
  limit?:             number;
}

export interface ProductSearchParams {
  q?:                 string;
  origin?:            string;
  processing_method?: string;
  roast_level?:       string;
  category_id?:       number;
}

const products = {
  getAll: (filters?: ProductFilters) =>
    request<{ success: boolean; data: ApiProduct[]; pagination: Pagination }>('/products', {
      params: filters as Record<string, string | number | boolean | undefined>,
    }),

  search: (params: ProductSearchParams) =>
    request<{ success: boolean; count: number; data: ApiProduct[] }>('/products/search', {
      params: params as Record<string, string | number | boolean | undefined>,
    }),

  getById: (id: number) =>
    request<{ success: boolean; data: ApiProduct }>(`/products/${id}`),

  create: (body: Partial<ApiProduct>) =>
    request<{ success: boolean; data: ApiProduct }>('/products', {
      method: 'POST',
      body:   JSON.stringify(body),
    }),

  update: (id: number, body: Partial<ApiProduct>) =>
    request<{ success: boolean; data: ApiProduct }>(`/products/${id}`, {
      method: 'PUT',
      body:   JSON.stringify(body),
    }),

  adjustStock: (id: number, payload: { stock?: number; adjustment?: number }) =>
    request<{ success: boolean; data: { id: number; stock: number } }>(`/products/${id}/stock`, {
      method: 'PATCH',
      body:   JSON.stringify(payload),
    }),

  delete: (id: number) =>
    request<{ success: boolean; message: string }>(`/products/${id}`, { method: 'DELETE' }),
};

// ─── Orders API ───────────────────────────────────────────────────────────────

export interface CreateOrderPayload {
  items: { product_id: number; quantity: number }[];
  shipping_address: { street: string; city: string; state: string; zip: string; country: string };
  notes?: string;
}

export interface OrderFilters {
  status?:  string;
  user_id?: number;
  page?:    number;
  limit?:   number;
}

const orders = {
  create: (body: CreateOrderPayload) =>
    request<{ success: boolean; message: string; data: ApiOrder }>('/orders', {
      method: 'POST',
      body:   JSON.stringify(body),
    }),

  getMyOrders: () =>
    request<{ success: boolean; data: ApiOrder[] }>('/orders/me'),

  getById: (id: number) =>
    request<{ success: boolean; data: ApiOrder }>(`/orders/${id}`),

  // Admin
  getAll: (filters?: OrderFilters) =>
    request<{ success: boolean; data: ApiOrder[]; pagination: Pagination }>('/orders', {
      params: filters as Record<string, string | number | boolean | undefined>,
    }),

  updateStatus: (id: number, status: ApiOrder['status']) =>
    request<{ success: boolean; data: ApiOrder }>(`/orders/${id}/status`, {
      method: 'PATCH',
      body:   JSON.stringify({ status }),
    }),
};

// ─── Users API (Admin) ────────────────────────────────────────────────────────

export interface UserFilters {
  role?:   string;
  active?: boolean;
  search?: string;
  page?:   number;
  limit?:  number;
}

const users = {
  getAll: (filters?: UserFilters) =>
    request<{ success: boolean; data: ApiUser[]; pagination: Pagination }>('/users', {
      params: filters as Record<string, string | number | boolean | undefined>,
    }),

  getById: (id: number) =>
    request<{ success: boolean; data: ApiUser }>(`/users/${id}`),

  update: (id: number, body: { username?: string; email?: string; role?: string }) =>
    request<{ success: boolean; data: ApiUser }>(`/users/${id}`, {
      method: 'PUT',
      body:   JSON.stringify(body),
    }),

  setStatus: (id: number, is_active: boolean) =>
    request<{ success: boolean; data: ApiUser }>(`/users/${id}/status`, {
      method: 'PATCH',
      body:   JSON.stringify({ is_active }),
    }),

  delete: (id: number) =>
    request<{ success: boolean; message: string }>(`/users/${id}`, { method: 'DELETE' }),
};

// ─── Exported API Object ──────────────────────────────────────────────────────

export const api = { auth, categories, products, orders, users };
