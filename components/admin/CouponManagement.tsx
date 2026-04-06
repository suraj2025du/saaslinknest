'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Tag, Plus, Edit2, Trash2, X, Check, Loader2, Search,
  Calendar, Percent, DollarSign, Infinity as InfinityIcon, Eye, EyeOff
} from 'lucide-react';

interface Coupon {
  id: number;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses: number | null;
  usedCount: number;
  validFrom: string | null;
  validUntil: string | null;
  active: boolean;
  createdAt: string;
}

interface CouponFormData {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: string;
  maxUses: string;
  validFrom: string;
  validUntil: string;
  active: boolean;
}

const emptyForm: CouponFormData = {
  code: '',
  discountType: 'percentage',
  discountValue: '',
  maxUses: '',
  validFrom: '',
  validUntil: '',
  active: true,
};

export default function CouponManagement() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [form, setForm] = useState<CouponFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchCoupons = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: '20',
      ...(search && { search }),
      ...(activeFilter !== 'all' && { active: activeFilter }),
    });
    const res = await fetch(`/api/admin/coupons?${params}`);
    const data = await res.json();
    setCoupons(data.coupons || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, [page, activeFilter]);

  useEffect(() => {
    const timer = setTimeout(() => fetchCoupons(), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const openCreate = () => {
    setEditingCoupon(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      maxUses: coupon.maxUses ? String(coupon.maxUses) : '',
      validFrom: coupon.validFrom ? coupon.validFrom.split('T')[0] : '',
      validUntil: coupon.validUntil ? coupon.validUntil.split('T')[0] : '',
      active: coupon.active,
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.code || !form.discountValue) return;
    setSaving(true);

    const body = {
      code: form.code,
      discountType: form.discountType,
      discountValue: parseInt(form.discountValue),
      maxUses: form.maxUses ? parseInt(form.maxUses) : null,
      validFrom: form.validFrom || null,
      validUntil: form.validUntil || null,
      active: form.active,
    };

    try {
      if (editingCoupon) {
        await fetch(`/api/admin/coupons/${editingCoupon.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        await fetch('/api/admin/coupons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }
      setShowForm(false);
      setEditingCoupon(null);
      setForm(emptyForm);
      fetchCoupons();
    } catch (error) {
      console.error('Save coupon error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    setDeletingId(id);
    await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
    setDeletingId(null);
    fetchCoupons();
  };

  const toggleActive = async (coupon: Coupon) => {
    await fetch(`/api/admin/coupons/${coupon.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !coupon.active }),
    });
    fetchCoupons();
  };

  const formatDiscount = (coupon: Coupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}% off`;
    }
    return `$${(coupon.discountValue / 100).toFixed(2)} off`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Coupon Management</h2>
          <p className="text-slate-400 text-sm font-medium">{total} total coupons</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-primary text-white font-black text-sm hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
        >
          <Plus className="w-4 h-4" />
          New Coupon
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search coupon codes..."
            className="pl-12 pr-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50 w-full"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'true', 'false'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeFilter === filter
                  ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
              }`}
            >
              {filter === 'all' ? 'All' : filter === 'true' ? 'Active' : 'Inactive'}
            </button>
          ))}
        </div>
      </div>

      {/* Coupons Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
        </div>
      ) : (
        <div className="premium-card rounded-[2.5rem] overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-white/5">
              <tr className="text-left text-[10px] font-black uppercase tracking-widest text-slate-500">
                <th className="p-6">Code</th>
                <th className="p-6">Discount</th>
                <th className="p-6">Usage</th>
                <th className="p-6">Valid Period</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="text-sm hover:bg-white/5 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-brand-primary" />
                      <code className="font-bold text-white bg-white/5 px-2 py-0.5 rounded-lg">
                        {coupon.code}
                      </code>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-white font-bold">{formatDiscount(coupon)}</span>
                  </td>
                  <td className="p-6">
                    <div className="text-slate-400">
                      <span className="text-white font-bold">{coupon.usedCount}</span>
                      {coupon.maxUses ? ` / ${coupon.maxUses}` : ' / unlimited'}
                    </div>
                    {coupon.maxUses && (
                      <div className="mt-1 w-20 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-brand-primary transition-all"
                          style={{ width: `${Math.min((coupon.usedCount / coupon.maxUses) * 100, 100)}%` }}
                        />
                      </div>
                    )}
                  </td>
                  <td className="p-6 text-slate-400 text-xs">
                    {coupon.validFrom
                      ? new Date(coupon.validFrom).toLocaleDateString()
                      : 'Any'}{' '}
                    - {coupon.validUntil
                      ? new Date(coupon.validUntil).toLocaleDateString()
                      : 'Any'}
                  </td>
                  <td className="p-6">
                    <button
                      onClick={() => toggleActive(coupon)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        coupon.active
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {coupon.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {coupon.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(coupon)}
                        className="p-2 rounded-xl hover:bg-blue-500/10 text-slate-400 hover:text-blue-400 transition-all"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        disabled={deletingId === coupon.id}
                        className="p-2 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingId === coupon.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {coupons.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              <Tag className="w-12 h-12 mx-auto mb-4 opacity-20" />
              No coupons found. Create one to get started.
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {total > 20 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Showing page {page}</p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-black text-slate-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-black text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="premium-card-gloss w-full max-w-lg rounded-[2.5rem] p-8 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-white">
                  {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-xl hover:bg-white/10 text-slate-400 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Code */}
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="SUMMER2025"
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50 font-mono"
                  />
                </div>

                {/* Discount Type + Value */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Discount Type
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setForm({ ...form, discountType: 'percentage' })}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-black transition-all ${
                          form.discountType === 'percentage'
                            ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30'
                            : 'bg-white/5 text-slate-400 border border-white/10'
                        }`}
                      >
                        <Percent className="w-4 h-4" />
                        %
                      </button>
                      <button
                        onClick={() => setForm({ ...form, discountType: 'fixed' })}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-black transition-all ${
                          form.discountType === 'fixed'
                            ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30'
                            : 'bg-white/5 text-slate-400 border border-white/10'
                        }`}
                      >
                        <DollarSign className="w-4 h-4" />
                        $
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Value {form.discountType === 'percentage' ? '(%)' : '(cents)'} *
                    </label>
                    <input
                      type="number"
                      value={form.discountValue}
                      onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                      placeholder={form.discountType === 'percentage' ? '20' : '500'}
                      min="0"
                      max={form.discountType === 'percentage' ? '100' : undefined}
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50"
                    />
                  </div>
                </div>

                {/* Max Uses */}
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                    Max Uses <span className="text-slate-600">(leave empty for unlimited)</span>
                  </label>
                  <input
                    type="number"
                    value={form.maxUses}
                    onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                    placeholder="Unlimited"
                    min="1"
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50"
                  />
                </div>

                {/* Valid Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Valid From
                    </label>
                    <input
                      type="date"
                      value={form.validFrom}
                      onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Valid Until
                    </label>
                    <input
                      type="date"
                      value={form.validUntil}
                      onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-primary/50"
                    />
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                  <div>
                    <div className="text-sm font-black text-white">Active</div>
                    <div className="text-xs text-slate-500">Coupon is visible and usable</div>
                  </div>
                  <button
                    onClick={() => setForm({ ...form, active: !form.active })}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      form.active ? 'bg-green-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${
                        form.active ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={saving || !form.code || !form.discountValue}
                className="mt-8 w-full py-5 rounded-2xl bg-brand-primary text-white font-black uppercase tracking-widest text-xs hover:bg-brand-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
