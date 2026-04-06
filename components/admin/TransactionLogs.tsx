'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { DollarSign, CheckCircle, XCircle, Clock, Search } from 'lucide-react';

export default function TransactionLogs() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`/api/admin/transactions?status=${filter}`);
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#06B6D4] to-[#10B981] flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Transaction Logs</h2>
            <p className="text-sm text-slate-400">Monitor all payments and user billing activity.</p>
          </div>
        </div>
        
        <select
          value={filter}
          onChange={(e) => { setFilter(e.target.value); fetchTransactions(); }}
          className="bg-surface-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white font-bold outline-none focus:ring-2 focus:ring-[#06B6D4]"
        >
          <option value="all">All Status</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="premium-card-glass p-12 rounded-3xl text-center">
          <DollarSign className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 font-bold">No transactions found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {transactions.map((tx) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="premium-card-glass p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  {getStatusIcon(tx.status)}
                </div>
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    {tx.userEmail || 'Unknown User'}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    {tx.gateway} • {tx.paymentId?.slice(0, 15)}...
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                  <div className="text-xl font-black text-white">
                    ${(tx.amount / 100).toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500 font-bold uppercase">
                    {tx.plan || 'N/A'}
                  </div>
                </div>
                <div className="text-[10px] font-bold text-slate-500">
                  {new Date(tx.createdAt).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
