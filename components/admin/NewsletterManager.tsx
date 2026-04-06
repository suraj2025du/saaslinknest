'use client';
import { useState, useEffect } from 'react';
import { Mail, CheckCircle, XCircle, Search } from 'lucide-react';

export default function NewsletterManager() {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/newsletter') // Using existing endpoint or fallback
      .then(r => r.json())
      .then(d => { if (d.success) setSubs(d.subscribers || []); })
      .catch(() => setSubs([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = subs.filter(s => s.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Newsletter Subscribers</h2>
          <p className="text-sm text-slate-400 mt-1">Manage your email list and export contacts.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search email..." className="bg-surface-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-medium outline-none focus:ring-2 focus:ring-[#06B6D4]" />
        </div>
      </div>

      {loading ? <div className="text-slate-400">Loading...</div> : filtered.length === 0 ? (
        <div className="premium-card-glass p-12 rounded-3xl text-center text-slate-500 flex flex-col items-center gap-4">
          <Mail className="w-12 h-12 text-slate-600" />
          <p className="font-bold">No subscribers found yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((sub) => (
            <div key={sub.id} className="premium-card-glass p-5 rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#06B6D4] to-[#10B981] flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-white">{sub.email}</div>
                  <div className="text-xs text-slate-400">{new Date(sub.subscribedAt).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {sub.subscribed ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                <span className="text-xs font-bold text-slate-400">{sub.subscribed ? 'Subscribed' : 'Unsubscribed'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
