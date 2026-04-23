import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';
import { Product, products as initialProducts, categories } from '../../data/mockData';
import { toast } from 'sonner';

const emptyProduct: Omit<Product, 'id' | 'rating' | 'reviewCount'> = {
  name: '',
  categoryId: 'cat-1',
  categoryName: 'Whole Bean',
  price: 0,
  stock: 0,
  description: '',
  shortDescription: '',
  image: initialProducts[0].image,
  roastLevel: 'Medium',
  origin: '',
  processingMethod: 'Washed',
  weight: '250g',
  flavorNotes: [],
};

export function AdminInventory() {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState(emptyProduct);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = productList.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.categoryName.toLowerCase().includes(search.toLowerCase()) ||
    (p.origin || '').toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditProduct(null);
    setFormData(emptyProduct);
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setFormData({ ...p });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) { toast.error('Product name is required'); return; }
    if (formData.price < 0) { toast.error('Price must be ≥ 0'); return; }
    if (formData.stock < 0) { toast.error('Stock must be ≥ 0'); return; }

    const cat = categories.find(c => c.id === formData.categoryId);
    const updatedData = { ...formData, categoryName: cat?.name || formData.categoryName };

    if (editProduct) {
      setProductList(prev => prev.map(p => p.id === editProduct.id ? { ...p, ...updatedData } : p));
      toast.success('Product updated!');
    } else {
      const newProduct: Product = {
        ...updatedData,
        id: `prod-${Date.now()}`,
        rating: 0,
        reviewCount: 0,
      };
      setProductList(prev => [...prev, newProduct]);
      toast.success('Product added!');
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setProductList(prev => prev.filter(p => p.id !== id));
    setDeleteConfirm(null);
    toast.success('Product deleted');
  };

  const stockStatus = (stock: number) => {
    if (stock === 0) return 'bg-red-100 text-red-700';
    if (stock <= 15) return 'bg-amber-100 text-amber-700';
    return 'bg-[#4A6741]/10 text-[#4A6741]';
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-[#2C1810]">Inventory</h1>
          <p className="text-sm text-[#8B5E3C]">{productList.length} products</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#2C1810] text-[#FAF3EB] rounded-full text-sm hover:bg-[#3D2318] transition-colors"
        >
          <Plus size={15} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B5E3C]" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[rgba(44,24,16,0.12)] rounded-full text-sm text-[#2C1810] placeholder-[#8B5E3C]/60 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[rgba(44,24,16,0.06)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F5EBE0]">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-[#8B5E3C] font-medium">Product</th>
                <th className="text-left px-4 py-3 text-xs text-[#8B5E3C] font-medium">Category</th>
                <th className="text-left px-4 py-3 text-xs text-[#8B5E3C] font-medium">Roast</th>
                <th className="text-right px-4 py-3 text-xs text-[#8B5E3C] font-medium">Price</th>
                <th className="text-center px-4 py-3 text-xs text-[#8B5E3C] font-medium">Stock</th>
                <th className="text-center px-4 py-3 text-xs text-[#8B5E3C] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-t border-[rgba(44,24,16,0.05)] hover:bg-[#FAF3EB] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="text-[#2C1810] font-medium">{p.name}</p>
                        {p.origin && <p className="text-xs text-[#8B5E3C]">{p.origin}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#8B5E3C] text-xs">{p.categoryName}</td>
                  <td className="px-4 py-3 text-[#8B5E3C] text-xs">{p.roastLevel || '—'}</td>
                  <td className="px-4 py-3 text-right text-[#2C1810] font-medium">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full ${stockStatus(p.stock)}`}>
                      {p.stock === 0 ? 'Out of Stock' : `${p.stock} units`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-[#8B5E3C] hover:text-[#2C1810] rounded-lg hover:bg-[#F0E4D4] transition-colors">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => setDeleteConfirm(p.id)} className="p-1.5 text-[#8B5E3C] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[rgba(44,24,16,0.08)]">
              <h2 className="font-medium text-[#2C1810]">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)}>
                <X size={18} className="text-[#8B5E3C]" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs text-[#8B5E3C] mb-1">Product Name *</label>
                <input
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#F5EBE0] border border-transparent rounded-lg text-sm text-[#2C1810] focus:outline-none focus:ring-1 focus:ring-[#8B5E3C]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#8B5E3C] mb-1">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={e => {
                      const cat = categories.find(c => c.id === e.target.value);
                      setFormData(p => ({ ...p, categoryId: e.target.value, categoryName: cat?.name || '' }));
                    }}
                    className="w-full px-3 py-2 bg-[#F5EBE0] border border-transparent rounded-lg text-sm text-[#2C1810] focus:outline-none"
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#8B5E3C] mb-1">Roast Level</label>
                  <select
                    value={formData.roastLevel || ''}
                    onChange={e => setFormData(p => ({ ...p, roastLevel: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-[#F5EBE0] border border-transparent rounded-lg text-sm text-[#2C1810] focus:outline-none"
                  >
                    <option value="">None</option>
                    <option>Light</option>
                    <option>Medium</option>
                    <option>Dark</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#8B5E3C] mb-1">Price ($) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={e => setFormData(p => ({ ...p, price: Math.max(0, parseFloat(e.target.value) || 0) }))}
                    className="w-full px-3 py-2 bg-[#F5EBE0] border border-transparent rounded-lg text-sm text-[#2C1810] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#8B5E3C] mb-1">Stock (units) *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={e => setFormData(p => ({ ...p, stock: Math.max(0, parseInt(e.target.value) || 0) }))}
                    className="w-full px-3 py-2 bg-[#F5EBE0] border border-transparent rounded-lg text-sm text-[#2C1810] focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#8B5E3C] mb-1">Origin</label>
                  <input
                    value={formData.origin || ''}
                    onChange={e => setFormData(p => ({ ...p, origin: e.target.value }))}
                    className="w-full px-3 py-2 bg-[#F5EBE0] border border-transparent rounded-lg text-sm text-[#2C1810] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#8B5E3C] mb-1">Process</label>
                  <select
                    value={formData.processingMethod || ''}
                    onChange={e => setFormData(p => ({ ...p, processingMethod: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-[#F5EBE0] border border-transparent rounded-lg text-sm text-[#2C1810] focus:outline-none"
                  >
                    <option value="">None</option>
                    <option>Washed</option>
                    <option>Natural</option>
                    <option>Anaerobic</option>
                    <option>Honey</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#8B5E3C] mb-1">Short Description</label>
                <input
                  value={formData.shortDescription}
                  onChange={e => setFormData(p => ({ ...p, shortDescription: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#F5EBE0] border border-transparent rounded-lg text-sm text-[#2C1810] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-[#8B5E3C] mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#F5EBE0] border border-transparent rounded-lg text-sm text-[#2C1810] focus:outline-none resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-[rgba(44,24,16,0.12)] text-[#8B5E3C] rounded-full text-sm hover:bg-[#F0E4D4] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-2.5 bg-[#2C1810] text-[#FAF3EB] rounded-full text-sm hover:bg-[#3D2318] transition-colors"
                >
                  {editProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={18} className="text-red-600" />
              </div>
              <h3 className="font-medium text-[#2C1810]">Delete Product?</h3>
            </div>
            <p className="text-sm text-[#8B5E3C] mb-5">
              This will permanently remove <strong>{productList.find(p => p.id === deleteConfirm)?.name}</strong>. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-[rgba(44,24,16,0.12)] text-[#8B5E3C] rounded-full text-sm">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-600 text-white rounded-full text-sm hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
