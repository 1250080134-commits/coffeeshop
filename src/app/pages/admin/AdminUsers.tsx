import { useState } from 'react';
import { Search, ChevronDown, Shield, User } from 'lucide-react';
import { User as UserType, users as initialUsers } from '../../data/mockData';
import { toast } from 'sonner';

type Role = UserType['role'];
type Status = UserType['status'];

export function AdminUsers() {
  const [userList, setUserList] = useState<UserType[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<Role | 'All'>('All');

  const updateRole = (id: string, role: Role) => {
    setUserList(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    toast.success('User role updated');
  };

  const toggleStatus = (id: string) => {
    setUserList(prev => prev.map(u =>
      u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
    ));
    const user = userList.find(u => u.id === id);
    toast.success(`${user?.name} is now ${user?.status === 'Active' ? 'Inactive' : 'Active'}`);
  };

  const filtered = userList.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'All' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const admins = userList.filter(u => u.role === 'Admin').length;
  const customers = userList.filter(u => u.role === 'Customer').length;
  const activeUsers = userList.filter(u => u.status === 'Active').length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl text-[#2C1810]">User Management</h1>
        <p className="text-sm text-[#8B5E3C]">{userList.length} total users</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Users', value: userList.length, icon: <User size={16} /> },
          { label: 'Admins', value: admins, icon: <Shield size={16} /> },
          { label: 'Active', value: activeUsers, icon: <User size={16} /> },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-[rgba(44,24,16,0.06)] text-center">
            <div className="w-8 h-8 rounded-full bg-[#F0E4D4] flex items-center justify-center mx-auto mb-2 text-[#8B5E3C]">
              {card.icon}
            </div>
            <p className="text-xl font-medium text-[#2C1810]">{card.value}</p>
            <p className="text-xs text-[#8B5E3C]">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B5E3C]" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[rgba(44,24,16,0.12)] rounded-full text-sm text-[#2C1810] placeholder-[#8B5E3C]/60 focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30"
          />
        </div>
        <div className="flex gap-2">
          {(['All', 'Admin', 'Customer'] as const).map(role => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-4 py-2 rounded-full text-xs transition-colors ${
                filterRole === role
                  ? 'bg-[#2C1810] text-[#FAF3EB]'
                  : 'bg-white border border-[rgba(44,24,16,0.12)] text-[#8B5E3C] hover:bg-[#F0E4D4]'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[rgba(44,24,16,0.06)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F5EBE0]">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-[#8B5E3C] font-medium">User</th>
                <th className="text-left px-4 py-3 text-xs text-[#8B5E3C] font-medium">Joined</th>
                <th className="text-center px-4 py-3 text-xs text-[#8B5E3C] font-medium">Orders</th>
                <th className="text-right px-4 py-3 text-xs text-[#8B5E3C] font-medium">Spent</th>
                <th className="text-center px-4 py-3 text-xs text-[#8B5E3C] font-medium">Role</th>
                <th className="text-center px-4 py-3 text-xs text-[#8B5E3C] font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id} className="border-t border-[rgba(44,24,16,0.05)] hover:bg-[#FAF3EB] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#E8D0B5] flex items-center justify-center text-[#8B5E3C] text-xs font-medium">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[#2C1810]">{user.name}</p>
                        <p className="text-xs text-[#8B5E3C]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#8B5E3C]">{user.joinDate}</td>
                  <td className="px-4 py-3 text-center text-[#2C1810]">{user.orderCount}</td>
                  <td className="px-4 py-3 text-right text-[#2C1810] font-medium">
                    ${user.totalSpent.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <div className="relative">
                        <select
                          value={user.role}
                          onChange={e => updateRole(user.id, e.target.value as Role)}
                          className={`appearance-none pl-3 pr-7 py-1 rounded-full text-xs cursor-pointer focus:outline-none ${
                            user.role === 'Admin'
                              ? 'bg-[#2C1810] text-white'
                              : 'bg-[#F0E4D4] text-[#8B5E3C]'
                          }`}
                        >
                          <option value="Admin">Admin</option>
                          <option value="Customer">Customer</option>
                        </select>
                        <ChevronDown size={10} className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${user.role === 'Admin' ? 'text-white' : 'text-[#8B5E3C]'}`} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <button
                        onClick={() => toggleStatus(user.id)}
                        className={`px-3 py-1 rounded-full text-xs transition-colors ${
                          user.status === 'Active'
                            ? 'bg-[#4A6741]/10 text-[#4A6741] hover:bg-[#4A6741]/20'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {user.status}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-10 text-[#8B5E3C] text-sm">No users found.</div>
        )}
      </div>
    </div>
  );
}
