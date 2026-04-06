'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Ban, Shield, Trash2, CheckCircle, XCircle, UserCheck, Eye } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchUsers(); }, [filter]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/admin/users?status=${filter}`);
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleAction = async (userId: number, action: string) => {
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, action }),
    });
    fetchUsers();
  };

  const filteredUsers = users.filter((u) =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-white">User Management</h2>
        <p className="text-sm text-slate-400 mt-1">View, search, ban, or manage all registered users.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-900 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white font-medium focus:ring-2 focus:ring-[#7C3AED] outline-none"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:ring-2 focus:ring-[#7C3AED]"
        >
          <option value="all">All Users</option>
          <option value="admin">Admins</option>
          <option value="user">Regular Users</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="premium-card-glass p-12 rounded-3xl text-center text-slate-500">No users found.</div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="premium-card-glass p-5 rounded-2xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#EC4899] flex items-center justify-center text-white font-black text-sm">
                  {(user.name || user.email || '?')[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-white">{user.name || 'No Name'}</div>
                  <div className="text-xs text-slate-400 font-mono">{user.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right mr-4">
                  <div className="text-xs font-bold text-slate-500">Joined</div>
                  <div className="text-xs text-white">{new Date(user.createdAt).toLocaleDateString()}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {user.role}
                </span>
                <div className="flex items-center gap-2">
                  {user.deletedAt ? (
                    <span className="text-red-400 text-xs font-bold flex items-center gap-1"><Ban className="w-4 h-4" /> Banned</span>
                  ) : (
                    <>
                      <button onClick={() => handleAction(user.id, user.role === 'admin' ? 'demote' : 'promote')} title="Toggle Admin" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#7C3AED]/20 flex items-center justify-center text-slate-400 hover:text-[#7C3AED] transition-all">
                        <Shield className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleAction(user.id, 'ban')} title="Ban User" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all">
                        <Ban className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
