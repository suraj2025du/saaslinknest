'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquarePlus, X, Send, AlertCircle, CheckCircle2, Upload, Image as ImageIcon, FileText, Lightbulb, Bug } from 'lucide-react';

type FeedbackType = 'bug' | 'feature_request' | 'feedback';

export function BugReportModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>('bug');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message, email }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          setIsSuccess(false);
          setMessage('');
          setEmail('');
          removeScreenshot();
        }, 3000);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Feedback failed:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const feedbackTypes: { value: FeedbackType; label: string; icon: React.ReactNode }[] = [
    { value: 'bug', label: 'Bug Report', icon: <Bug className="w-4 h-4" /> },
    { value: 'feature_request', label: 'Feature Request', icon: <Lightbulb className="w-4 h-4" /> },
    { value: 'feedback', label: 'Feedback', icon: <MessageSquarePlus className="w-4 h-4" /> },
  ];

  return (
    <div id="bug-report-modal-root">
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-brand-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40 group"
        title="Report a bug or give feedback"
      >
        <MessageSquarePlus className="w-6 h-6 group-hover:rotate-12 transition-transform" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div key="bug-report-backdrop-wrapper" className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
            <motion.div
              key="bug-report-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setIsOpen(false)}
              className="absolute inset-0 bg-surface-950/60 backdrop-blur-sm pointer-events-auto"
            />

            <motion.div
              key="bug-report-dialog"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden pointer-events-auto max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-brand-primary" />
                  Feedback Loop.
                </h3>
                <button
                  disabled={isSubmitting}
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 transition-all hover:rotate-90"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isSuccess ? (
                <div className="py-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </motion.div>
                  <h4 className="text-xl font-bold text-white mb-2">Thank You!</h4>
                  <p className="text-slate-400">Your feedback has been submitted successfully.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Type Selector */}
                  <div className="grid grid-cols-3 gap-2 p-1 bg-white/5 rounded-2xl">
                    {feedbackTypes.map((feedbackType) => (
                      <button
                        key={feedbackType.value}
                        type="button"
                        onClick={() => setType(feedbackType.value)}
                        className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${type === feedbackType.value
                            ? 'bg-brand-primary text-white shadow-xl'
                            : 'text-slate-500 hover:text-slate-300'
                          }`}
                      >
                        {feedbackType.icon}
                        <span className="text-[10px]">{feedbackType.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <input
                      required
                      type="email"
                      placeholder="Your email for follow-up"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50 transition-all font-bold"
                    />
                    <textarea
                      required
                      placeholder={
                        type === 'bug'
                          ? 'Describe the bug you encountered...'
                          : type === 'feature_request'
                            ? 'Describe the feature you would like to see...'
                            : 'Share your thoughts with us...'
                      }
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50 transition-all font-bold resize-none"
                    />

                    {/* Screenshot Upload */}
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleScreenshotChange}
                        className="hidden"
                      />
                      {!screenshotPreview ? (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-4 rounded-2xl border-2 border-dashed border-white/10 hover:border-brand-primary/30 text-slate-500 hover:text-slate-400 transition-all flex items-center justify-center gap-2 font-bold text-sm"
                        >
                          <Upload className="w-4 h-4" />
                          Attach Screenshot (optional, max 5MB)
                        </button>
                      ) : (
                        <div className="relative rounded-2xl border border-white/10 overflow-hidden">
                          <div className="flex items-center gap-3 p-3 bg-white/5">
                            <ImageIcon className="w-5 h-5 text-brand-primary" />
                            <span className="text-sm font-bold text-white truncate flex-1">{screenshot?.name}</span>
                            <button
                              type="button"
                              onClick={removeScreenshot}
                              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400 transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <img
                            src={screenshotPreview}
                            alt="Screenshot preview"
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    disabled={isSubmitting}
                    className="w-full py-5 rounded-2xl bg-brand-primary text-white font-black uppercase tracking-widest text-xs hover:bg-brand-primary/91 transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Feedback
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
