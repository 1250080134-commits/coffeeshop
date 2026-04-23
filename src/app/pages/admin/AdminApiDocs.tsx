/**
 * AdminApiDocs.tsx
 * Interactive API reference for The Artisan Bean Hub backend.
 * Visible at /admin/api-docs
 */

import { useState } from "react";
import { ChevronDown, ChevronRight, Lock, Shield, Globe, Copy, Check } from "lucide-react";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface Endpoint {
  method:      HttpMethod;
  path:        string;
  description: string;
  auth:        "public" | "token" | "admin";
  body?:       string;
  params?:     string;
  response:    string;
}

interface EndpointGroup {
  tag:       string;
  color:     string;
  endpoints: Endpoint[];
}

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET:    "bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30",
  POST:   "bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30",
  PUT:    "bg-[#f97316]/15 text-[#f97316] border border-[#f97316]/30",
  PATCH:  "bg-[#a855f7]/15 text-[#a855f7] border border-[#a855f7]/30",
  DELETE: "bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30",
};

const AUTH_BADGE = {
  public: { label: "Public",    icon: Globe,  cls: "text-[#6b7280] bg-[#f3f4f6]" },
  token:  { label: "JWT Token", icon: Lock,   cls: "text-[#f59e0b] bg-[#fef3c7]" },
  admin:  { label: "Admin Only", icon: Shield, cls: "text-[#ef4444] bg-[#fee2e2]" },
};

const ENDPOINT_GROUPS: EndpointGroup[] = [
  {
    tag: "Authentication",
    color: "border-l-[#f59e0b]",
    endpoints: [
      {
        method: "POST", path: "/api/auth/register", auth: "public",
        description: "Register a new Customer account. Validates unique email & username; password is bcrypt-hashed.",
        body: `{\n  "username": "janedoe",\n  "email": "jane@example.com",\n  "password": "Secret@123"\n}`,
        response: `{\n  "success": true,\n  "token": "<JWT>",\n  "user": { "id": 1, "username": "janedoe", "role": "Customer" }\n}`,
      },
      {
        method: "POST", path: "/api/auth/login", auth: "public",
        description: "Authenticate with email + password. Returns a signed JWT (7-day expiry by default).",
        body: `{\n  "email": "admin@artisanbean.com",\n  "password": "Admin@12345"\n}`,
        response: `{\n  "success": true,\n  "token": "<JWT>",\n  "user": { "id": 1, "role": "Admin" }\n}`,
      },
      {
        method: "GET", path: "/api/auth/me", auth: "token",
        description: "Returns the authenticated user's profile. Requires Bearer token.",
        response: `{\n  "success": true,\n  "user": { "id": 1, "username": "alexroaster", "role": "Admin" }\n}`,
      },
    ],
  },
  {
    tag: "Categories",
    color: "border-l-[#22c55e]",
    endpoints: [
      {
        method: "GET", path: "/api/categories", auth: "public",
        description: "List all categories with product count.",
        response: `{\n  "success": true,\n  "data": [{ "id": 1, "name": "Whole Bean", "productCount": 6 }]\n}`,
      },
      {
        method: "GET", path: "/api/categories/:id", auth: "public",
        description: "Single category with all associated products.",
        response: `{ "success": true, "data": { "id": 1, "name": "Whole Bean", "products": [...] } }`,
      },
      {
        method: "POST", path: "/api/categories", auth: "admin",
        description: "Create a new category. Name must be unique.",
        body: `{ "name": "Cold Brew Concentrate", "description": "Ready-to-dilute concentrates" }`,
        response: `{ "success": true, "message": "Category created.", "data": { "id": 4, "name": "..." } }`,
      },
      {
        method: "PUT", path: "/api/categories/:id", auth: "admin",
        description: "Update an existing category's name or description.",
        body: `{ "name": "Updated Name", "description": "New description" }`,
        response: `{ "success": true, "message": "Category updated.", "data": { ... } }`,
      },
      {
        method: "DELETE", path: "/api/categories/:id", auth: "admin",
        description: "Delete a category. Blocked if any products are assigned to it.",
        response: `{ "success": true, "message": "Category deleted." }`,
      },
    ],
  },
  {
    tag: "Products",
    color: "border-l-[#8b5cf6]",
    endpoints: [
      {
        method: "GET", path: "/api/products", auth: "public",
        description: "Paginated product list with advanced filtering.",
        params: "roast_level, origin, processing_method, category_id, min_price, max_price, featured, sort (price_asc | price_desc | rating_desc | newest), page, limit",
        response: `{\n  "success": true,\n  "data": [...],\n  "pagination": { "total": 11, "page": 1, "limit": 12, "totalPages": 1 }\n}`,
      },
      {
        method: "GET", path: "/api/products/search", auth: "public",
        description: "Partial name match (LIKE %q%) + exact attribute filters. Must be called before /:id route.",
        params: "q (partial name), origin, processing_method, roast_level, category_id",
        response: `{ "success": true, "count": 3, "data": [...] }`,
      },
      {
        method: "GET", path: "/api/products/:id", auth: "public",
        description: "Fetch a single product with its category.",
        response: `{ "success": true, "data": { "id": 1, "name": "Ethiopia Yirgacheffe", "category": {...} } }`,
      },
      {
        method: "POST", path: "/api/products", auth: "admin",
        description: "Create a product. price and stock must be >= 0 (enforced at model + DB level).",
        body: `{\n  "name": "New Origin",\n  "price": 22.00,\n  "stock": 50,\n  "roast_level": "Light",\n  "origin": "Ethiopia",\n  "processing_method": "Washed",\n  "category_id": 1\n}`,
        response: `{ "success": true, "message": "Product created.", "data": { "id": 12, ... } }`,
      },
      {
        method: "PUT", path: "/api/products/:id", auth: "admin",
        description: "Partial update — only provided fields are changed.",
        body: `{ "price": 24.00, "stock": 45, "badge": "Sale" }`,
        response: `{ "success": true, "message": "Product updated.", "data": { ... } }`,
      },
      {
        method: "PATCH", path: "/api/products/:id/stock", auth: "admin",
        description: "Set absolute stock level or apply a relative delta. Prevents negative stock.",
        body: `{ "stock": 100 }  // absolute\n// OR\n{ "adjustment": -5 }  // relative delta`,
        response: `{ "success": true, "data": { "id": 1, "stock": 100 } }`,
      },
      {
        method: "DELETE", path: "/api/products/:id", auth: "admin",
        description: "Delete a product. Blocked by FK constraint if the product exists in any order.",
        response: `{ "success": true, "message": "Product deleted." }`,
      },
    ],
  },
  {
    tag: "Orders",
    color: "border-l-[#ef4444]",
    endpoints: [
      {
        method: "POST", path: "/api/orders", auth: "token",
        description: "Place an order. Runs inside a Sequelize transaction: locks product rows → validates stock → decrements stock → creates order + details. Rolls back on any failure.",
        body: `{\n  "items": [\n    { "product_id": 1, "quantity": 2 },\n    { "product_id": 5, "quantity": 1 }\n  ],\n  "shipping_address": {\n    "street": "123 Bean St",\n    "city": "Portland",\n    "state": "OR",\n    "zip": "97201",\n    "country": "USA"\n  },\n  "notes": "Leave at door"\n}`,
        response: `{ "success": true, "message": "Order placed successfully.", "data": { "id": 1, "status": "Pending", "total": "55.49", "orderDetails": [...] } }`,
      },
      {
        method: "GET", path: "/api/orders/me", auth: "token",
        description: "Returns the authenticated customer's full order history.",
        response: `{ "success": true, "data": [{ "id": 1, "status": "Completed", "total": "94.99" }] }`,
      },
      {
        method: "GET", path: "/api/orders/:id", auth: "token",
        description: "Fetch a specific order. Customers can only view their own; Admins see all.",
        response: `{ "success": true, "data": { "id": 1, "customer": {...}, "orderDetails": [...] } }`,
      },
      {
        method: "GET", path: "/api/orders", auth: "admin",
        description: "Paginated order list. Filter by status or user_id.",
        params: "status, user_id, page, limit",
        response: `{ "success": true, "data": [...], "pagination": { ... } }`,
      },
      {
        method: "PATCH", path: "/api/orders/:id/status", auth: "admin",
        description: "Advance an order's status. Cannot modify Completed or Cancelled orders.",
        body: `{ "status": "Shipped" }`,
        response: `{ "success": true, "message": "Order status updated.", "data": { "status": "Shipped" } }`,
      },
    ],
  },
  {
    tag: "Users",
    color: "border-l-[#f97316]",
    endpoints: [
      {
        method: "GET", path: "/api/users", auth: "admin",
        description: "Paginated user list with search and role/status filters.",
        params: "role (Admin|Customer), active (true|false), search (username or email), page, limit",
        response: `{ "success": true, "data": [...], "pagination": { ... } }`,
      },
      {
        method: "GET", path: "/api/users/:id", auth: "admin",
        description: "Single user detail including order history.",
        response: `{ "success": true, "data": { "id": 1, "username": "...", "orders": [...] } }`,
      },
      {
        method: "PUT", path: "/api/users/:id", auth: "admin",
        description: "Update username, email, or role. Checks for uniqueness before saving.",
        body: `{ "role": "Admin" }`,
        response: `{ "success": true, "data": { ... } }`,
      },
      {
        method: "PATCH", path: "/api/users/:id/status", auth: "admin",
        description: "Activate or deactivate a user account. Admins cannot deactivate themselves.",
        body: `{ "is_active": false }`,
        response: `{ "success": true, "message": "User deactivated.", "data": { ... } }`,
      },
      {
        method: "DELETE", path: "/api/users/:id", auth: "admin",
        description: "Hard delete a user. Admins cannot delete their own account.",
        response: `{ "success": true, "message": "User deleted." }`,
      },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded hover:bg-white/10 transition-colors text-[#9ca3af]"
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-[#22c55e]" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#1a1a2e] rounded-t-md border-b border-[#2d2d44]">
        <span className="text-[10px] text-[#9ca3af] uppercase tracking-widest">{label}</span>
        <CopyButton text={code} />
      </div>
      <pre className="text-[11px] leading-relaxed text-[#e2e8f0] bg-[#0f0f1a] p-3 rounded-b-md overflow-x-auto whitespace-pre-wrap font-mono">
        {code}
      </pre>
    </div>
  );
}

function EndpointRow({ ep }: { ep: Endpoint }) {
  const [open, setOpen] = useState(false);
  const authInfo = AUTH_BADGE[ep.auth];
  const AuthIcon = authInfo.icon;

  return (
    <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-3 hover:bg-[#f9fafb] transition-colors text-left"
      >
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded font-mono min-w-[56px] text-center ${METHOD_COLORS[ep.method]}`}>
          {ep.method}
        </span>
        <span className="font-mono text-sm text-[#1f2937] flex-1">{ep.path}</span>
        <span className={`hidden sm:flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full ${authInfo.cls}`}>
          <AuthIcon className="w-3 h-3" />
          {authInfo.label}
        </span>
        {open ? <ChevronDown className="w-4 h-4 text-[#6b7280] shrink-0" /> : <ChevronRight className="w-4 h-4 text-[#6b7280] shrink-0" />}
      </button>

      {open && (
        <div className="border-t border-[#e5e7eb] px-4 py-3 bg-[#f9fafb] space-y-2">
          <p className="text-sm text-[#374151]">{ep.description}</p>

          {ep.params && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6b7280] mb-1">Query Parameters</p>
              <p className="text-xs text-[#4b5563] font-mono bg-white border border-[#e5e7eb] rounded px-3 py-2">
                {ep.params}
              </p>
            </div>
          )}

          {ep.body     && <CodeBlock code={ep.body}     label="Request Body (JSON)" />}
          {ep.response && <CodeBlock code={ep.response} label="Response Example" />}
        </div>
      )}
    </div>
  );
}

function EndpointGroupCard({ group }: { group: EndpointGroup }) {
  const [open, setOpen] = useState(true);

  return (
    <div className={`border-l-4 ${group.color} bg-white rounded-lg shadow-sm overflow-hidden`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#f9fafb] transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-base text-[#1f2937]">{group.tag}</h3>
          <span className="text-xs text-[#9ca3af] bg-[#f3f4f6] px-2 py-0.5 rounded-full">
            {group.endpoints.length} endpoints
          </span>
        </div>
        {open ? <ChevronDown className="w-4 h-4 text-[#6b7280]" /> : <ChevronRight className="w-4 h-4 text-[#6b7280]" />}
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-2">
          {group.endpoints.map((ep) => (
            <EndpointRow key={`${ep.method}-${ep.path}`} ep={ep} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminApiDocs() {
  return (
    <div className="min-h-screen bg-[#f5f5f0] p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl text-[#1a1a1a] mb-1">API Reference</h1>
            <p className="text-sm text-[#6b7280]">
              The Artisan Bean Hub — Node.js / Express / Sequelize Backend
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#6b7280] bg-white border border-[#e5e7eb] px-3 py-1.5 rounded-full font-mono">
              BASE URL: http://localhost:5000/api
            </span>
          </div>
        </div>

        {/* Auth Legend */}
        <div className="mt-4 flex flex-wrap gap-3">
          {Object.entries(AUTH_BADGE).map(([key, val]) => {
            const Icon = val.icon;
            return (
              <span key={key} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full ${val.cls}`}>
                <Icon className="w-3 h-3" />
                {val.label}
                {key === "token"  && " — Bearer JWT required"}
                {key === "admin"  && " — Admin role required"}
                {key === "public" && " — No auth needed"}
              </span>
            );
          })}
        </div>

        {/* Transaction callout */}
        <div className="mt-4 bg-[#fef3c7] border border-[#fbbf24]/40 rounded-lg px-4 py-3 flex gap-3">
          <Shield className="w-5 h-5 text-[#d97706] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-[#92400e]">
              <strong>Inventory Guardrail:</strong>{" "}
              <code className="text-xs bg-[#fde68a] px-1 rounded">POST /api/orders</code>{" "}
              runs inside a Sequelize transaction. Product rows are locked with{" "}
              <code className="text-xs bg-[#fde68a] px-1 rounded">SELECT … FOR UPDATE</code>,
              stock is validated for every item, then decremented atomically. Any failure causes a full rollback.
            </p>
          </div>
        </div>
      </div>

      {/* Endpoint Groups */}
      <div className="max-w-4xl mx-auto space-y-4">
        {ENDPOINT_GROUPS.map((group) => (
          <EndpointGroupCard key={group.tag} group={group} />
        ))}
      </div>

      {/* Footer note */}
      <div className="max-w-4xl mx-auto mt-8 text-center text-xs text-[#9ca3af]">
        Server directory: <code className="font-mono">/server</code> — Run{" "}
        <code className="font-mono bg-[#f3f4f6] px-1.5 py-0.5 rounded">npm install && npm run db:migrate && npm run db:seed && npm run dev</code>{" "}
        to start the API server.
      </div>
    </div>
  );
}
