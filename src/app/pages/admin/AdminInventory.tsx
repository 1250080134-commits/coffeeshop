import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { api, ApiProduct, ApiCategory } from '../../services/api';
import { toast } from 'sonner';

const roastOptions = ['Light', 'Medium', 'Dark'];
const processOptions = ['Washed', 'Natural', 'Anaerobic', 'Honey'];

export function AdminInventory() {
  const [products, setProducts]   = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm]   = useState<Partial<ApiProduct>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm]     = useState<Partial<ApiProduct>>({ stock: 0, featured: false });

  useEffect(() => {
    Promise.all([
      api.products.getAll({ limit: 200 }),
      api.categories.getAll(),
    ]).then(([prodRes, catRes]) => {
      setProducts(prodRes.data);
      setCategories(catRes.data);
    }).catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const startEdit = (p: ApiProduct) => {
    setEditingId(p.id);
    setEditForm({ name: p.name, price: p.price, stock: p.stock, roast_level: p.roast_level ?? undefined, badge: p.badge ?? undefined });
  };

  const cancelEdit = () => { setEditingId(null); setEditForm({}); };

  const saveEdit = async (id: number) => {
    try {
      const updated = await api.products.update(id, editForm);
      setProducts(prev => prev.map(p => p.id === id ? updated.data : p));
      cancelEdit();
      toast.success('Product updated.');
    } catch {
      toast.error('Failed to update product.');
    }
  };

  const handleStockAdjust = async (id: number, delta: number) => {
    try {
      const res = await api.products.adjustStock(id, { adjustment: delta });
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: res.data.stock } : p));
    } catch {
      toast.error('Stock update failed.');
    }
  };

  const handleDelete = async (p: ApiProduct) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    try {
      await api.products.delete(p.id);
      setProducts(prev => prev.filter(x => x.id !== p.id));
      toast.success('Product deleted.');
    } catch {
      toast.error('Failed to delete product.');
    }
  };

  const handleAddSubmit = async () => {
    if (!addForm.name || !addForm.price || !addForm.category_id) {
      toast.error('Name, price, and category are required.');
      return;
    }
    try {
      const res = await api.products.create(addForm);
      setProducts(prev => [...prev, res.data]);
      setShowAddForm(false);
      setAddForm({ stock: 0, featured: false });
      toast.success('Product created.');
    } catch {
      toast.error('Failed to create product.');
    }
  };

  const filtered = products.filter(p =>
    !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.origin?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-[#2C1810]">Inventory</h1>
          <p className="text-sm text-[#8B5E3C]">Manage products, prices, and stock levels.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[#2C1810] text-[#FAF3EB] rounded-xl text-sm hover:bg-[#3D2318] transition-colors"
        >
          <Plus size={14} /> Add Product
        </button>
      </div>

      {/* Add product form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl p-5 border border-[rgba(44,24,16,0.12)] shadow-sm">
          <h3 className="text-sm font-medium text-[#2C1810] mb-4">New Product</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { key: 'name', label: 'Name *', type: 'text', placeholder: 'Ethiopia Yirgacheffe' },
              { key: 'price', label: 'Price *', type: 'number', placeholder: '22.00' },
              { key: 'stock', label: 'Stock', type: 'number', placeholder: '50' },
              { key: 'origin', label: 'Origin', type: 'text', placeholder: 'Ethiopia' },
              { key: 'weight', label: 'Weight', type: 'text', placeholder: '250g' },
              { key: 'image_url', label: 'Image URL', type: 'text', placeholder: 'https://…' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs text-[#8B5E3C] mb-1">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={(addForm as Record<string, unknown>)[key] as string ?? ''}
                  onChange={e => setAddForm(p => ({ ...p, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                  className="w-full px-3 py-2 bg-[#FAF3EB] border border-[rgba(44,24,16,0.12)] rounded-lg text-sm text-[#2C1810] focus:outline-none"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs text-[#8B5E3C] mb-1">Category *</label>
              <select
                value={addForm.category_id ?? ''}
                onChange={e => setAddForm(p => ({ ...p, category_id: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-[#FAF3EB] border border-[rgba(44,24,16,0.12)] rounded-lg text-sm text-[#2C1810] focus:outline-none"
              >
                <option value="">Select…</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#8B5E3C] mb-1">Roast Level</label>
              <select
                value={addForm.roast_level ?? ''}
                onChange={e => setAddForm(p => ({ ...p, roast_level: e.target.value as ApiProduct['roast_level'] }))}
                className="w-full px-3 py-2 bg-[#FAF3EB] border border-[rgba(44,24,16,0.12)] rounded-lg text-sm text-[#2C1810] focus:outline-none"
              >
                <option value="">None</option>
                {roastOptions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#8B5E3C] mb-1">Processing</label>
              <select
                value={addForm.processing_method ?? ''}
                onChange={e => setAddForm(p => ({ ...p, processing_method: e.target.value as ApiProduct['processing_method'] }))}
                className="w-full px-3 py-2 bg-[#FAF3EB] border border-[rgba(44,24,16,0.12)] rounded-lg text-sm text-[#2C1810] focus:outline-none"
              >
                <option value="">None</option>
                {processOptions.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-xs text-[#8B5E3C] mb-1">Short Description</label>
            <textarea
              rows={2}
              value={addForm.short_description ?? ''}
              onChange={e => setAddForm(p => ({ ...p, short_description: e.target.value }))}
              className="w-full px-3 py-2 bg-[#FAF3EB] border border-[rgba(44,24,16,0.12)] rounded-lg text-sm text-[#2C1810] focus:outline-none resize-none"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleAddSubmit} className="px-4 py-2 bg-[#4A6741] text-white rounded-xl text-sm hover:bg-[#3d5836] transition-colors">Create Product</button>
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 border border-[rgba(44,24,16,0.12)] text-[#8B5E3C] rounded-xl text-sm hover:bg-[#F0E4D4] transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E3C]" />
        <input
          type="text"
          placeholder="Search products…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-[rgba(44,24,16,0.12)] rounded-xl text-sm text-[#2C1810] placeholder-[#8B5E3C]/50 focus:outline-none"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-[#8B5E3C]">Loading inventory…</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-[rgba(44,24,16,0.06)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAF3EB] border-b border-[#F0E4D4]">
                  {['Product', 'Price', 'Stock', 'Roast', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-[#8B5E3C] font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E4D4]">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-[#FAF3EB]/30 transition-colors">
                    {editingId === p.id ? (
                      <>
                        <td className="px-4 py-2">
                          <input value={editForm.name ?? ''} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                            className="w-full px-2 py-1 text-xs border border-[#C4A882] rounded-lg focus:outline-none" />
                        </td>
                        <td className="px-4 py-2">
                          <input type="number" value={editForm.price ?? ''} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))}
                            className="w-20 px-2 py-1 text-xs border border-[#C4A882] rounded-lg focus:outline-none" />
                        </td>
                        <td className="px-4 py-2">
                          <input type="number" value={editForm.stock ?? 0} onChange={e => setEditForm(f => ({ ...f, stock: Number(e.target.value) }))}
                            className="w-16 px-2 py-1 text-xs border border-[#C4A882] rounded-lg focus:outline-none" />
                        </td>
                        <td className="px-4 py-2">
                          <select value={editForm.roast_level ?? ''} onChange={e => setEditForm(f => ({ ...f, roast_level: e.target.value as ApiProduct['roast_level'] }))}
                            className="px-2 py-1 text-xs border border-[#C4A882] rounded-lg focus:outline-none">
                            <option value="">—</option>
                            {roastOptions.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-2" />
                        <td className="px-4 py-2">
                          <div className="flex gap-2">
                            <button onClick={() => saveEdit(p.id)} className="w-6 h-6 rounded-lg bg-[#4A6741] text-white flex items-center justify-center"><Check size={11} /></button>
                            <button onClick={cancelEdit} className="w-6 h-6 rounded-lg bg-[#F0E4D4] text-[#8B5E3C] flex items-center justify-center"><X size={11} /></button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3">
                          <p className="font-medium text-[#2C1810] leading-tight">{p.name}</p>
                          {p.origin && <p className="text-xs text-[#8B5E3C]">{p.origin}</p>}
                        </td>
                        <td className="px-4 py-3 text-[#2C1810]">${parseFloat(p.price).toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => handleStockAdjust(p.id, -1)} className="w-5 h-5 rounded bg-[#F0E4D4] text-[#8B5E3C] flex items-center justify-center text-xs hover:bg-[#E8D0B5]">−</button>
                            <span className={`text-xs font-medium w-6 text-center ${p.stock === 0 ? 'text-red-600' : p.stock <= 10 ? 'text-amber-600' : 'text-[#4A6741]'}`}>{p.stock}</span>
                            <button onClick={() => handleStockAdjust(p.id, +1)} className="w-5 h-5 rounded bg-[#F0E4D4] text-[#8B5E3C] flex items-center justify-center text-xs hover:bg-[#E8D0B5]">+</button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#8B5E3C]">{p.roast_level ?? '—'}</td>
                        <td className="px-4 py-3">
                          {p.stock === 0
                            ? <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">Out of Stock</span>
                            : p.stock <= 10
                            ? <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">Low Stock</span>
                            : <span className="text-xs bg-[#4A6741]/10 text-[#4A6741] px-2 py-0.5 rounded-full">In Stock</span>
                          }
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => startEdit(p)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8B5E3C] hover:bg-[#F0E4D4]"><Pencil size={12} /></button>
                            <button onClick={() => handleDelete(p)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8B5E3C] hover:bg-red-50 hover:text-red-600"><Trash2 size={12} /></button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
