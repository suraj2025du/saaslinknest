'use client';
import { useState } from 'react';
import { Save, Settings2, ToggleLeft, ToggleRight } from 'lucide-react';

export default function SettingsManager() {
  const [settings, setSettings] = useState({
    siteName: 'LinkNest',
    supportEmail: 'support@linknest.com',
    maintenanceMode: false,
    allowSignup: true,
    emailVerification: true,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setSaving(true);
    try {
      // Transform settings into the format expected by the API
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value: typeof value === 'boolean' ? value.toString() : value,
        type: typeof value === 'boolean' ? 'boolean' : 'string',
      }));

      const res = await fetch('/api/admin/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });

      if (res.ok) {
        setMessage('✅ Settings saved successfully!');
      } else {
        setMessage('❌ Failed to save settings');
      }
    } catch (error) {
      setMessage('❌ Error saving settings');
    }
    setSaving(false);
  };

  const Toggle = ({ label, value, onChange }: any) => (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
      <span className="text-sm font-bold text-white">{label}</span>
      <button onClick={() => onChange(!value)} className="transition-all">
        {value ? <ToggleRight className="w-8 h-8 text-[#7C3AED]" /> : <ToggleLeft className="w-8 h-8 text-slate-600" />}
      </button>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-3"><Settings2 className="w-7 h-7" /> Platform Settings</h2>
        <p className="text-sm text-slate-400 mt-2">Configure site name, emails, and feature toggles.</p>
      </div>

      {message && <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 font-bold">{message}</div>}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="premium-card-glass p-6 rounded-3xl border border-white/5 space-y-4">
          <h3 className="text-lg font-black text-white">General</h3>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Site Name</label>
            <input value={settings.siteName} onChange={e => setSettings({ ...settings, siteName: e.target.value })} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:ring-2 focus:ring-[#7C3AED]" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Support Email</label>
            <input value={settings.supportEmail} onChange={e => setSettings({ ...settings, supportEmail: e.target.value })} className="w-full bg-surface-900 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:ring-2 focus:ring-[#7C3AED]" />
          </div>
        </div>

        <div className="premium-card-glass p-6 rounded-3xl border border-white/5 space-y-4">
          <h3 className="text-lg font-black text-white">Feature Toggles</h3>
          <Toggle label="Maintenance Mode" value={settings.maintenanceMode} onChange={(v: boolean) => setSettings({ ...settings, maintenanceMode: v })} />
          <Toggle label="Allow Signups" value={settings.allowSignup} onChange={(v: boolean) => setSettings({ ...settings, allowSignup: v })} />
          <Toggle label="Email Verification" value={settings.emailVerification} onChange={(v: boolean) => setSettings({ ...settings, emailVerification: v })} />
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="px-8 py-4 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white font-black rounded-xl hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2">
        <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
}
