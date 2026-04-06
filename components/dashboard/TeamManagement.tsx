'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Plus,
  Mail,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ChevronDown,
  Shield,
  Eye,
  Clock,
  UserPlus,
  Copy,
  Check,
} from 'lucide-react';

type TeamMember = {
  id: number;
  profileId: number;
  userId: number | null;
  email: string | null;
  role: 'owner' | 'editor' | 'viewer';
  status: 'pending' | 'active' | 'revoked';
  inviteToken: string | null;
  invitedAt: Date | string | null;
  acceptedAt: Date | string | null;
  user: {
    id: number;
    name: string | null;
    email: string | null;
    emailVerified: boolean | null;
  } | null;
};

type Invite = {
  id: number;
  email: string | null;
  role: 'owner' | 'editor' | 'viewer';
  status: 'pending' | 'active' | 'revoked';
  invitedAt: Date | string | null;
};

export const TeamManagement = ({ user }: { user: any }) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('viewer');
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [updatingRoles, setUpdatingRoles] = useState<Record<number, boolean>>({});
  const [removingMembers, setRemovingMembers] = useState<Record<number, boolean>>({});
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [openRoleDropdowns, setOpenRoleDropdowns] = useState<Record<number, boolean>>({});

  const fetchData = async () => {
    try {
      const [membersRes, invitesRes] = await Promise.all([
        fetch('/api/team/members'),
        fetch('/api/team/invites'),
      ]);

      if (membersRes.ok) {
        const membersData = await membersRes.json();
        setMembers(membersData.members || []);
      }

      if (invitesRes.ok) {
        const invitesData = await invitesRes.json();
        setInvites(invitesData.invites || []);
      }
    } catch (error) {
      console.error('Failed to fetch team data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError('');
    setInviteSuccess('');

    if (!inviteEmail) {
      setInviteError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      setInviteError('Invalid email format');
      return;
    }

    setIsSendingInvite(true);
    try {
      const res = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        setInviteError(data.error || 'Failed to send invite');
        return;
      }

      setInviteSuccess('Invite sent successfully!');
      setInviteEmail('');
      setInviteRole('viewer');
      fetchData();

      setTimeout(() => {
        setInviteSuccess('');
        setShowInviteModal(false);
      }, 2000);
    } catch (error) {
      setInviteError('Failed to send invite');
    } finally {
      setIsSendingInvite(false);
    }
  };

  const handleUpdateRole = async (memberId: number, newRole: 'editor' | 'viewer') => {
    setUpdatingRoles((prev) => ({ ...prev, [memberId]: true }));
    try {
      const res = await fetch('/api/team/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, role: newRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to update role');
        return;
      }

      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
      );
      setOpenRoleDropdowns((prev) => ({ ...prev, [memberId]: false }));
    } catch (error) {
      alert('Failed to update role');
    } finally {
      setUpdatingRoles((prev) => ({ ...prev, [memberId]: false }));
    }
  };

  const handleRemoveMember = async (memberId: number) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;

    setRemovingMembers((prev) => ({ ...prev, [memberId]: true }));
    try {
      const res = await fetch(`/api/team/members?memberId=${memberId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to remove member');
        return;
      }

      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    } catch (error) {
      alert('Failed to remove member');
    } finally {
      setRemovingMembers((prev) => ({ ...prev, [memberId]: false }));
    }
  };

  const handleRevokeInvite = async (inviteId: number) => {
    if (!confirm('Are you sure you want to revoke this invite?')) return;

    try {
      const res = await fetch(`/api/team/invites?inviteId=${inviteId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to revoke invite');
        return;
      }

      setInvites((prev) => prev.filter((i) => i.id !== inviteId));
    } catch (error) {
      alert('Failed to revoke invite');
    }
  };

  const copyInviteLink = async (token: string, inviteId: number) => {
    const url = `${window.location.origin}/team/accept?token=${token}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(inviteId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getInitials = (name: string | null, email: string | null) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return '?';
  };

  const formatDate = (dateStr: Date | string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const activeMembers = members.filter((m) => m.status === 'active');
  const owner = activeMembers.find((m) => m.role === 'owner');
  const otherMembers = activeMembers.filter((m) => m.role !== 'owner');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Team</h2>
          <p className="text-slate-400 text-sm font-medium">
            Manage your team members and collaboration settings.
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20 group active:scale-95"
        >
          <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          Invite Member
        </button>
      </div>

      {/* Owner Section */}
      <section className="premium-card-gloss p-8 rounded-[2.5rem] space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-brand-primary" />
          <h3 className="text-lg font-black text-white">Profile Owner</h3>
        </div>
        {owner && (
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-14 h-14 rounded-2xl bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center font-black text-xl text-brand-primary">
              {getInitials(owner.user?.name ?? null, owner.email ?? null)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-black text-white">
                {owner.user?.name || owner.email || 'Unknown'}
              </div>
              <div className="text-xs text-slate-500 font-medium">{owner.user?.email || owner.email}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-[10px] font-black uppercase tracking-widest text-brand-primary">
                Owner
              </span>
              <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-1.5 rounded-xl">
                <CheckCircle2 className="w-3 h-3" />
                Active
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Team Members Section */}
      <section className="premium-card-gloss p-8 rounded-[2.5rem] space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-primary" />
            <h3 className="text-lg font-black text-white">Team Members</h3>
            <span className="text-xs font-black text-slate-500 bg-white/5 px-2 py-1 rounded-lg">
              {otherMembers.length}
            </span>
          </div>
        </div>

        {otherMembers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No team members yet</p>
            <p className="text-slate-600 text-sm mt-1">Invite editors or viewers to collaborate</p>
          </div>
        ) : (
          <div className="space-y-3">
            {otherMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-surface-800 border border-white/5 flex items-center justify-center font-black text-lg text-slate-400">
                  {getInitials(member.user?.name ?? null, member.email ?? null)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-white truncate">
                    {member.user?.name || member.email || 'Unknown'}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {member.user?.email || member.email}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Role Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenRoleDropdowns((prev) => ({
                          ...prev,
                          [member.id]: !prev[member.id],
                        }))
                      }
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 transition-all"
                      disabled={updatingRoles[member.id]}
                    >
                      {updatingRoles[member.id] ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <>
                          {member.role === 'editor' ? (
                            <Shield className="w-3 h-3 text-blue-400" />
                          ) : (
                            <Eye className="w-3 h-3 text-slate-400" />
                          )}
                          {member.role}
                          <ChevronDown className="w-3 h-3" />
                        </>
                      )}
                    </button>

                    <AnimatePresence>
                      {openRoleDropdowns[member.id] && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="absolute right-0 top-full mt-2 w-40 bg-surface-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                        >
                          {(['editor', 'viewer'] as const).map((role) => (
                            <button
                              key={role}
                              onClick={() => handleUpdateRole(member.id, role)}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest transition-all ${member.role === role
                                ? 'bg-brand-primary/10 text-brand-primary'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                              {role === 'editor' ? (
                                <Shield className="w-4 h-4 text-blue-400" />
                              ) : (
                                <Eye className="w-4 h-4 text-slate-400" />
                              )}
                              {role}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Status Badge */}
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-1.5 rounded-xl">
                    <CheckCircle2 className="w-3 h-3" />
                    Active
                  </span>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={removingMembers[member.id]}
                    className="p-2.5 rounded-xl hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-all disabled:opacity-50"
                    title="Remove member"
                  >
                    {removingMembers[member.id] ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Pending Invites Section */}
      {invites.length > 0 && (
        <section className="premium-card-gloss p-8 rounded-[2.5rem] space-y-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-black text-white">Pending Invites</h3>
            <span className="text-xs font-black text-slate-500 bg-white/5 px-2 py-1 rounded-lg">
              {invites.length}
            </span>
          </div>

          <div className="space-y-3">
            {invites.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center gap-4 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-white truncate">{invite.email}</div>
                  <div className="text-xs text-slate-500 font-medium">
                    Invited {formatDate(invite.invitedAt)} &middot; Role: {invite.role}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-1.5 rounded-xl">
                    <Clock className="w-3 h-3" />
                    Pending
                  </span>

                  {/* Copy Invite Link */}
                  <button
                    onClick={() => copyInviteLink('', invite.id)}
                    className="p-2.5 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all"
                    title="Copy invite link"
                  >
                    {copiedId === invite.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  {/* Revoke Button */}
                  <button
                    onClick={() => handleRevokeInvite(invite.id)}
                    className="p-2.5 rounded-xl hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-all"
                    title="Revoke invite"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowInviteModal(false);
              setInviteError('');
              setInviteSuccess('');
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="premium-card-gloss p-8 rounded-[2.5rem] w-full max-w-md space-y-6"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-brand-primary" />
                  </div>
                  <h3 className="text-xl font-black text-white">Invite Member</h3>
                </div>
                <button
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteError('');
                    setInviteSuccess('');
                  }}
                  className="p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSendInvite} className="space-y-5">
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => {
                      setInviteEmail(e.target.value);
                      if (inviteError) setInviteError('');
                    }}
                    placeholder="colleague@example.com"
                    className="w-full bg-surface-900 border border-white/5 rounded-2xl px-5 py-3.5 text-sm font-bold text-white placeholder:text-slate-700 focus:ring-2 focus:ring-brand-primary/50 outline-none transition-all hover:border-white/10"
                    autoFocus
                  />
                </div>

                {/* Role Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Role
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setInviteRole('editor')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${inviteRole === 'editor'
                        ? 'border-blue-500/50 bg-blue-500/10'
                        : 'border-white/5 bg-white/5 hover:bg-white/10'
                        }`}
                    >
                      <Shield className={`w-6 h-6 ${inviteRole === 'editor' ? 'text-blue-400' : 'text-slate-500'}`} />
                      <span className={`text-xs font-black uppercase tracking-wider ${inviteRole === 'editor' ? 'text-blue-400' : 'text-slate-500'
                        }`}>
                        Editor
                      </span>
                      <span className="text-[10px] text-slate-600 font-medium">Can edit links & appearance</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInviteRole('viewer')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${inviteRole === 'viewer'
                        ? 'border-brand-primary/50 bg-brand-primary/10'
                        : 'border-white/5 bg-white/5 hover:bg-white/10'
                        }`}
                    >
                      <Eye className={`w-6 h-6 ${inviteRole === 'viewer' ? 'text-brand-primary' : 'text-slate-500'}`} />
                      <span className={`text-xs font-black uppercase tracking-wider ${inviteRole === 'viewer' ? 'text-brand-primary' : 'text-slate-500'
                        }`}>
                        Viewer
                      </span>
                      <span className="text-[10px] text-slate-600 font-medium">View only access</span>
                    </button>
                  </div>
                </div>

                {/* Error/Success Messages */}
                {inviteError && (
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {inviteError}
                  </p>
                )}
                {inviteSuccess && (
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {inviteSuccess}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSendingInvite || !inviteEmail}
                  className="w-full bg-brand-primary text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20 disabled:opacity-50"
                >
                  {isSendingInvite ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Send Invite
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
