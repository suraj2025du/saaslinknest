'use client';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Mail, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function FeedbackManager() {
  const [activeTab, setActiveTab] = useState<'feedback' | 'contact'>('feedback');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const endpoint = activeTab === 'feedback' ? '/api/admin/feedback' : '/api/admin/config?type=contacts';
        const res = await fetch(endpoint);
        const data = await res.json();
        if (data.success) setItems(activeTab === 'feedback' ? data.feedbacks : data.contacts || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchItems();
  }, [activeTab]);

  const updateStatus = async (id: number, status: string) => {
    await fetch('/api/admin/feedback', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    setItems(items.map(i => i.id === id ? { ...i, status } : i));
  };

  const getStatusIcon = (s: string) => {
    if (s === 'resolved') return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    if (s === 'reviewed') return <Clock className="w-4 h-4 text-yellow-500" />;
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-black text-white">Feedback & Contact</h2>
      
      <div className="flex gap-4 border-b border-white/5 pb-4">
        <button onClick={() => { setActiveTab('feedback'); setLoading(true); }} className={`px-5 py-2 rounded-xl font-black text-sm transition-all ${activeTab === 'feedback' ? 'bg-[#7C3AED]/20 text-[#7C3AED]' : 'text-slate-400 hover:text-white'}`}>💬 Feedback</button>
        <button onClick={() => { setActiveTab('contact'); setLoading(true); }} className={`px-5 py-2 rounded-xl font-black text-sm transition-all ${activeTab === 'contact' ? 'bg-[#06B6D4]/20 text-[#06B6D4]' : 'text-slate-400 hover:text-white'}`}>📧 Contact Submissions</button>
      </div>

      {loading ? <div className="text-slate-400">Loading...</div> : items.length === 0 ? (
        <div className="premium-card-glass p-12 rounded-3xl text-center text-slate-500">No {activeTab} submissions found.</div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="premium-card-glass p-6 rounded-2xl border border-white/5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {activeTab === 'contact' ? <Mail className="w-4 h-4 text-[#06B6D4]" /> : <MessageSquare className="w-4 h-4 text-[#7C3AED]" />}
                    <span className="font-bold text-white">{activeTab === 'contact' ? item.name : item.type}</span>
                    <span className="text-xs text-slate-400">• {item.email}</span>
                  </div>
                  <p className="text-sm text-slate-300">{item.message}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {getStatusIcon(item.status)}
                  <select value={item.status} onChange={(e) => updateStatus(item.id, e.target.value)} className="bg-surface-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-white outline-none">
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
