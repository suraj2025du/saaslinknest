'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, X, Loader2, KeyRound, AlertCircle } from 'lucide-react';

interface PasswordPromptModalProps {
  linkTitle: string;
  linkId: number;
  isOpen: boolean;
  onClose: () => void;
  onUnlock: (linkId: number) => void;
}

export default function PasswordPromptModal({
  linkTitle,
  linkId,
  isOpen,
  onClose,
  onUnlock,
}: PasswordPromptModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/public/links/${linkId}/access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Cache unlocked state in sessionStorage
        sessionStorage.setItem(`unlocked_link_${linkId}`, 'true');
        onUnlock(linkId);
        setPassword('');
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch (err) {
      setError('Failed to verify password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface-900 border border-white/10 rounded-[2.5rem] p-8 max-w-md w-full relative shadow-2xl"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-6 mx-auto">
              <KeyRound className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-white mb-2 text-center">Password Protected Link</h3>
            <p className="text-sm text-slate-500 mb-6 font-medium text-center truncate">{linkTitle}</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Enter Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter the password to access this link"
                  className="w-full bg-surface-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-slate-700"
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-xs text-red-400 font-medium bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-2.5 flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {error}
                </p>
              )}

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !password}
                  className="flex-1 py-3.5 rounded-xl bg-violet-500 text-white font-black hover:bg-violet-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Unlock Link
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
