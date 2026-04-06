'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Eye, EyeOff, Save, Trash2, CheckCircle, AlertCircle, Key } from 'lucide-react';

export default function PaymentManager() {
  const [gateways, setGateways] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    provider: 'stripe',
    isActive: false,
    publicKey: '',
    secretKey: '',
    webhookSecret: '',
  });
  const [showSecrets, setShowSecrets] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchGateways();
  }, []);

  const fetchGateways = async () => {
    try {
      const res = await fetch('/api/admin/gateways');
      const data = await res.json();
      if (data.success) {
        setGateways(data.gateways);
      }
    } catch (error) {
      console.error('Failed to fetch gateways:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/gateways', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setMessage('✅ Gateway saved successfully!');
        setFormData({ provider: 'stripe', isActive: false, publicKey: '', secretKey: '', webhookSecret: '' });
        fetchGateways();
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('❌ Failed to save gateway');
    } finally {
      setSaving(false);
    }
  };

  const handleSelect = (gateway: any) => {
    setFormData({
      provider: gateway.provider,
      isActive: gateway.isActive,
      publicKey: gateway.publicKey || '',
      secretKey: gateway.secretKey || '',
      webhookSecret: gateway.webhookSecret || '',
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#EC4899] flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Payment Gateways</h2>
          <p className="text-sm text-slate-400">Manage Stripe, Razorpay, and other payment API keys securely.</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border ${message.includes('✅') ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
          {message}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="premium-card-glass p-8 rounded-3xl space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Provider</label>
                <select
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:ring-2 focus:ring-[#7C3AED] outline-none"
                >
                  <option value="stripe">Stripe</option>
                  <option value="razorpay">Razorpay</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>
              <div className="space-y-2 flex items-end">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 rounded bg-surface-900 border-white/20 text-[#7C3AED] focus:ring-[#7C3AED]"
                  />
                  <span className="text-sm font-bold text-white">Active / Enabled</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Public Key / Key ID</label>
              <input
                type="text"
                value={formData.publicKey}
                onChange={(e) => setFormData({ ...formData, publicKey: e.target.value })}
                placeholder="pk_test_..."
                className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:ring-2 focus:ring-[#7C3AED] outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Secret Key / Key Secret</label>
              <div className="relative">
                <input
                  type={showSecrets ? 'text' : 'password'}
                  value={formData.secretKey}
                  onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                  placeholder="sk_test_..."
                  className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white font-mono text-sm focus:ring-2 focus:ring-[#7C3AED] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowSecrets(!showSecrets)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showSecrets ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Webhook Secret</label>
              <input
                type="text"
                value={formData.webhookSecret}
                onChange={(e) => setFormData({ ...formData, webhookSecret: e.target.value })}
                placeholder="whsec_..."
                className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:ring-2 focus:ring-[#7C3AED] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white font-black rounded-xl hover:shadow-xl hover:shadow-[#7C3AED]/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Gateway'}
            </button>
          </form>
        </div>

        {/* Saved List */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Key className="w-5 h-5" /> Saved Gateways
          </h3>
          
          {loading ? (
            <div className="text-slate-400">Loading...</div>
          ) : gateways.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center text-slate-500">
              No gateways configured yet.
            </div>
          ) : (
            <div className="space-y-3">
              {gateways.map((gw) => (
                <div
                  key={gw.provider}
                  onClick={() => handleSelect(gw)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${gw.isActive ? 'bg-green-500/5 border-green-500/20' : 'bg-white/5 border-white/5'}`}
                >
                  <div>
                    <div className="font-bold text-white capitalize">{gw.provider}</div>
                    <div className="text-xs text-slate-400 font-mono">{gw.publicKey?.slice(0, 10)}...</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {gw.isActive ? <CheckCircle className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
