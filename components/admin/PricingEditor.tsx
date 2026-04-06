'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Save, Plus, Trash2, DollarSign, Check } from 'lucide-react';

const initialPlans = [
  { id: 'free', name: 'Starter', price: 0, features: ['50 links', '3 themes', 'Basic analytics'] },
  { id: 'premium', name: 'Pro', price: 12, features: ['Unlimited links', 'All themes', 'Advanced analytics', 'Custom domain'] },
  { id: 'lifetime', name: 'Lifetime', price: 49, features: ['All Pro features', 'Lifetime access', 'Priority support', 'VIP status'] },
];

export default function PricingEditor() {
  const [plans, setPlans] = useState(initialPlans);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    // In a real app, POST to /api/admin/pricing
    await new Promise(r => setTimeout(r, 1000));
    setMessage('✅ Pricing updated successfully!');
    setSaving(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-white">Pricing Editor</h2>
        <p className="text-sm text-slate-400 mt-1">Edit plan names, prices, and feature lists.</p>
      </div>

      {message && <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 font-bold">{message}</div>}

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="premium-card-glass p-6 rounded-3xl border border-white/5 space-y-4">
            <input
              value={plan.name}
              onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? { ...p, name: e.target.value } : p))}
              className="w-full bg-transparent text-xl font-black text-white border-b border-white/10 pb-2 focus:border-[#7C3AED] outline-none"
            />
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-slate-400" />
              <input
                type="number"
                value={plan.price}
                onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? { ...p, price: parseFloat(e.target.value) } : p))}
                className="w-20 bg-transparent text-3xl font-black text-white focus:outline-none"
              />
              <span className="text-slate-400 text-sm font-bold">/month</span>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/5">
              {plan.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleSave} disabled={saving} className="px-8 py-4 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white font-black rounded-xl hover:shadow-xl hover:shadow-[#7C3AED]/30 transition-all disabled:opacity-50 flex items-center gap-2">
        <Save className="w-5 h-5" />
        {saving ? 'Saving...' : 'Save Pricing Changes'}
      </button>
    </div>
  );
}
