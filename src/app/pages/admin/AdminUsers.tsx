import { useState, useEffect } from 'react';
import { Search, UserX, UserCheck, Trash2 } from 'lucide-react';
import { api, ApiUser } from '../../services/api';
import { toast } from 'sonner';

export function AdminUsers() {
  const [users, setUsers]         = useState<ApiUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'All' | 'Admin' | 'Customer'>('All');

  useEffect(() => {
    api.users.getAll({ limit: 200 })
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]))
      .finally(() => setIsLoading(false));
  }, []);

  const handleToggleActive = async (user: ApiUser) => {
    try {
      const updated = await api.users.setStatus(user.id, !user.is_active);
      setUsers(prev => prev.map(u => u.id === user.id ? updated.data : u));
      toast.success(`${user.username} ${!user.is_active ? 'activated' : 'deactivated'}.`);
    } catch {
      toast.error('Failed to update user status.');
    }
  };

  const handleDelete = async (user: ApiUser) => {
    if (!window.confirm(`Delete user "${user.username}"? This cannot be undone.`)) return;
    try {
      await api.users.delete(user.id);
      setUsers(prev => prev.filter(u => u.id !== user.id));
      toast.success(`${user.username} deleted.`);
    } catch {
      toast.error('Failed to delete user.');
    }
  };

  const filtered = users.filter(u => {
    const matchRole   = filterRole === 'All' || u.role === filterRole;
    const matchSearch = !searchQuery || u.username.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-[#2C1810]">Users</h1>
        <p className="text-sm text-[#8B5E3C]">Manage customer and admin accounts.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5E3C]" />
          <input
            type="text"
            placeholder="Search by username or email…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[rgba(44,24,16,0.12)] rounded-xl text-sm text-[#2C1810] placeholder-[#8B5E3C]/50 focus:outline-none"
          />
        </div>
        <select
          value={filterRole}
          onChange={e => setFilterRole(e.target.value as 'All' | 'Admin' | 'Customer')}
          className="px-4 py-2.5 bg-white border border-[rgba(44,24,16,0.12)] rounded-xl text-sm text-[#2C1810] focus:outline-none"
        >
          <option value="All">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Customer">Customer</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-[#8B5E3C]">Loading users…</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-[rgba(44,24,16,0.06)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAF3EB] border-b border-[#F0E4D4]">
                <th className="text-left px-5 py-3 text-xs text-[#8B5E3C] font-medium">Username</th>
                <th className="text-left px-5 py-3 text-xs text-[#8B5E3C] font-medium hidden sm:table-cell">Email</th>
                <th className="text-left px-5 py-3 text-xs text-[#8B5E3C] font-medium">Role</th>
                <th className="text-left px-5 py-3 text-xs text-[#8B5E3C] font-medium hidden md:table-cell">Status</th>
                <th className="text-left px-5 py-3 text-xs text-[#8B5E3C] font-medium hidden md:table-cell">Joined</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E4D4]">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-[#8B5E3C]">No users found.</td></tr>
              ) : filtered.map(u => (
                <tr key={u.id} className="hover:bg-[#FAF3EB]/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-[#2C1810]">{u.username}</td>
                  <td className="px-5 py-3 text-[#8B5E3C] hidden sm:table-cell">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${u.role === 'Admin' ? 'bg-[#2C1810] text-[#FAF3EB]' : 'bg-[#F0E4D4] text-[#8B5E3C]'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${u.is_active ? 'bg-[#4A6741]/10 text-[#4A6741]' : 'bg-red-50 text-red-600'}`}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[#8B5E3C] text-xs hidden md:table-cell">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => handleToggleActive(u)}
                        title={u.is_active ? 'Deactivate' : 'Activate'}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8B5E3C] hover:bg-[#F0E4D4] transition-colors"
                      >
                        {u.is_active ? <UserX size={13} /> : <UserCheck size={13} />}
                      </button>
                      <button
                        onClick={() => handleDelete(u)}
                        title="Delete user"
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8B5E3C] hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
