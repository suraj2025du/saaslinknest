'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/cropImage';
import Image from 'next/image';
import {
  User,
  Globe,
  Mail,
  Lock,
  Shield,
  Bell,
  Camera,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Zap,
  X,
  Upload,
  Smartphone,
  QrCode,
  Copy,
  RefreshCw,
  Sparkles,
  Loader2
} from 'lucide-react';

export const SettingsModule = ({ user }: { user: any }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(user?.profile?.avatar || null);
  const [displayName, setDisplayName] = useState(user?.name || user?.email?.split('@')[0]);
  const [username, setUsername] = useState(user?.profile?.username || 'creator');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [customDomain, setCustomDomain] = useState(user?.profile?.customDomain || '');
  const [domainVerified, setDomainVerified] = useState(user?.profile?.customDomainVerified || false);
  const [verificationToken, setVerificationToken] = useState(user?.profile?.domainVerificationToken || '');
  const [isVerifyingDomain, setIsVerifyingDomain] = useState(false);
  const [domainVerifyStatus, setDomainVerifyStatus] = useState<'idle' | 'verifying' | 'verified' | 'failed'>('idle');
  const [domainVerifyMessage, setDomainVerifyMessage] = useState('');
  const [showDnsInstructions, setShowDnsInstructions] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [displayNameError, setDisplayNameError] = useState('');
  const [bioError, setBioError] = useState('');
  const [domainError, setDomainError] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [showCropper, setShowCropper] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState('');
  const [twoFactorQRCode, setTwoFactorQRCode] = useState('');
  const [twoFactorBackupCodes, setTwoFactorBackupCodes] = useState<string[]>([]);
  const [twoFactorToken, setTwoFactorToken] = useState('');
  const [twoFactorError, setTwoFactorError] = useState('');
  const [twoFactorSuccess, setTwoFactorSuccess] = useState('');
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
  const [showDisable2FAModal, setShowDisable2FAModal] = useState(false);
  const [disable2FAToken, setDisable2FAToken] = useState('');

  // Account deletion state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // AI State
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [aiBioError, setAiBioError] = useState('');

  const handleSetup2FA = async () => {
    try {
      setIsSettingUp2FA(true);
      setTwoFactorError('');
      setTwoFactorSuccess('');

      const response = await fetch('/api/auth/two-factor/setup');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to setup 2FA');
      }

      setTwoFactorSecret(data.secret);
      setTwoFactorQRCode(data.qrCode);
      setTwoFactorBackupCodes(data.backupCodes);
      setShowTwoFactorSetup(true);
      setTwoFactorSuccess('QR code generated. Scan it with your authenticator app.');
    } catch (error: any) {
      setTwoFactorError(error.message);
    } finally {
      setIsSettingUp2FA(false);
    }
  };

  const handleEnable2FA = async () => {
    try {
      setIsSettingUp2FA(true);
      setTwoFactorError('');

      if (!twoFactorToken || twoFactorToken.length !== 6) {
        setTwoFactorError('Please enter a valid 6-digit code');
        return;
      }

      const response = await fetch('/api/auth/two-factor/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: twoFactorToken,
          secret: twoFactorSecret,
          backupCodes: twoFactorBackupCodes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to enable 2FA');
      }

      setTwoFactorEnabled(true);
      setShowTwoFactorSetup(false);
      setTwoFactorSuccess('2FA enabled successfully! Keep your backup codes safe.');

      // Reset form
      setTwoFactorToken('');
      setTwoFactorSecret('');
      setTwoFactorQRCode('');
      setTwoFactorBackupCodes([]);
    } catch (error: any) {
      setTwoFactorError(error.message);
    } finally {
      setIsSettingUp2FA(false);
    }
  };

  const handleDisable2FA = async () => {
    try {
      setIsSettingUp2FA(true);
      setTwoFactorError('');

      const response = await fetch('/api/auth/two-factor/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: disable2FAToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to disable 2FA');
      }

      setTwoFactorEnabled(false);
      setShowDisable2FAModal(false);
      setDisable2FAToken('');
      setTwoFactorSuccess('2FA disabled successfully');
    } catch (error: any) {
      setTwoFactorError(error.message);
    } finally {
      setIsSettingUp2FA(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImage(reader.result as string);
        setShowCropper(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const showCroppedImage = async () => {
    try {
      if (image && croppedAreaPixels) {
        const croppedImage = await getCroppedImg(image, croppedAreaPixels);
        setAvatar(croppedImage);
        setShowCropper(false);
        setImage(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    let hasError = false;

    // Validate Display Name
    if (!displayName || displayName.length < 2) {
      setDisplayNameError('Display name must be at least 2 characters');
      hasError = true;
    } else if (displayName.length > 50) {
      setDisplayNameError('Display name must be less than 50 characters');
      hasError = true;
    } else {
      setDisplayNameError('');
    }

    // Validate Username
    const usernameRegex = /^[a-zA-Z0-9._]+$/;
    if (!username || username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      hasError = true;
    } else if (username.length > 30) {
      setUsernameError('Username must be less than 30 characters');
      hasError = true;
    } else if (!usernameRegex.test(username)) {
      setUsernameError('Username can only contain letters, numbers, dots, and underscores');
      hasError = true;
    } else {
      setUsernameError('');
    }

    // Validate Bio
    if (bio.length > 160) {
      setBioError('Bio must be less than 160 characters');
      hasError = true;
    } else {
      setBioError('');
    }

    // Validate Domain
    if (customDomain && !validateDomain(customDomain)) {
      setDomainError('Please enter a valid domain name (e.g. yourname.com)');
      hasError = true;
    } else {
      setDomainError('');
    }

    if (hasError) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: displayName,
          username,
          bio,
          avatar,
          customDomain
        }),
      });

      if (!response.ok) throw new Error('Failed to save profile');

      // Optional: Show success toast or notification
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const validateDomain = (domain: string) => {
    if (!domain) return true;
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
    return domainRegex.test(domain);
  };

  const handleDomainChange = (val: string) => {
    // Strip http://, https:// and trailing slashes
    let cleaned = val.toLowerCase().trim();
    cleaned = cleaned.replace(/^https?:\/\//, '');
    cleaned = cleaned.replace(/\/$/, '');

    setCustomDomain(cleaned);
    if (cleaned && !validateDomain(cleaned)) {
      setDomainError('Invalid domain format');
    } else {
      setDomainError('');
    }
  };

  const handleInitiateVerification = async () => {
    if (!customDomain) {
      setDomainError('Please enter a domain first');
      return;
    }

    if (!validateDomain(customDomain)) {
      setDomainError('Please enter a valid domain');
      return;
    }

    try {
      setDomainVerifyStatus('verifying');
      setDomainVerifyMessage('');

      const response = await fetch('/api/profile/domain/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: customDomain }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate verification');
      }

      setVerificationToken(data.verificationToken);
      setShowDnsInstructions(true);
      setDomainVerifyStatus('idle');
      setDomainVerifyMessage('DNS record generated. Add it to your domain provider.');
    } catch (error: any) {
      setDomainVerifyStatus('failed');
      setDomainVerifyMessage(error.message);
    }
  };

  const handleCheckVerification = async () => {
    try {
      setIsVerifyingDomain(true);
      setDomainVerifyStatus('verifying');
      setDomainVerifyMessage('Checking DNS records...');

      const response = await fetch('/api/profile/domain/check');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check verification');
      }

      if (data.verified) {
        setDomainVerified(true);
        setDomainVerifyStatus('verified');
        setDomainVerifyMessage(data.message);
        setShowDnsInstructions(false);
      } else {
        setDomainVerifyStatus('failed');
        setDomainVerifyMessage(data.message);
      }
    } catch (error: any) {
      setDomainVerifyStatus('failed');
      setDomainVerifyMessage(error.message);
    } finally {
      setIsVerifyingDomain(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(data.error || 'Failed to change password');
        return;
      }

      setPasswordSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
    } catch (error) {
      setPasswordError('An unexpected error occurred');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      setDeleteError('Please type DELETE to confirm');
      return;
    }

    setDeleteError('');
    setIsDeleting(true);
    try {
      const response = await fetch('/api/account/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        setDeleteError(data.error || 'Failed to delete account');
        return;
      }

      // Redirect to home after successful deletion
      window.location.href = '/';
    } catch (error) {
      setDeleteError('An unexpected error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAiGenerateBio = async () => {
    if (!displayName) {
      setBioError('Please enter a display name first');
      return;
    }

    setIsGeneratingBio(true);
    setAiBioError('');
    try {
      const response = await fetch('/api/ai/bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: displayName,
          currentBio: bio,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to generate bio');

      setBio(data.bio);
      setBioError('');
    } catch (error: any) {
      setAiBioError(error.message);
    } finally {
      setIsGeneratingBio(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Settings</h2>
          <p className="text-slate-400 text-sm font-medium">Manage your account, profile, and security preferences.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-white text-black px-8 py-3 rounded-2xl font-black hover:bg-slate-200 transition-all shadow-xl shadow-white/10 disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
            />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Profile Section */}
          <section className="premium-card-gloss p-8 rounded-[2.5rem] space-y-8">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-brand-primary" />
              <h3 className="text-lg font-black text-white">Profile Information</h3>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-8 pb-8 border-b border-white/5">
              <div className="relative group">
                <div className="w-24 h-24 rounded-[2rem] bg-surface-800 border border-white/5 flex items-center justify-center font-black text-3xl text-brand-primary overflow-hidden shadow-inner relative">
                  {avatar ? (
                    <Image src={avatar} alt="Avatar" fill className="object-cover" />
                  ) : (
                    user?.email?.[0].toUpperCase() || 'U'
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center rounded-[2rem] text-[10px] font-black uppercase tracking-widest gap-1 border border-white/10"
                >
                  <Camera className="w-5 h-5" />
                  Edit
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div className="text-center sm:text-left">
                <h4 className="font-black text-white text-lg">Profile Photo</h4>
                <p className="text-xs text-slate-500 font-medium mb-4">JPG, PNG or GIF. Max size of 2MB.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-black text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    <Upload className="w-3 h-3" />
                    Upload New
                  </button>
                  <button
                    onClick={() => setAvatar(null)}
                    className="px-4 py-2 rounded-xl bg-red-500/5 border border-red-500/10 text-xs font-black text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-2"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                    if (e.target.value.length >= 2 && e.target.value.length <= 50) setDisplayNameError('');
                  }}
                  className={`w-full bg-surface-900 border ${displayNameError ? 'border-red-500/50' : 'border-white/5'} rounded-2xl px-5 py-3.5 text-sm font-bold text-white focus:ring-2 ${displayNameError ? 'focus:ring-red-500/30' : 'focus:ring-brand-primary/50'} outline-none transition-all hover:border-white/10`}
                />
                {displayNameError && (
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {displayNameError}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-black">linkne.st/</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      const val = e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, '');
                      setUsername(val);
                      if (val.length >= 3 && val.length <= 30) setUsernameError('');
                    }}
                    className={`w-full bg-surface-900 border ${usernameError ? 'border-red-500/50' : 'border-white/5'} rounded-2xl pl-24 pr-5 py-3.5 text-sm font-bold text-white focus:ring-2 ${usernameError ? 'focus:ring-red-500/30' : 'focus:ring-brand-primary/50'} outline-none transition-all hover:border-white/10`}
                  />
                </div>
                {usernameError && (
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {usernameError}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Bio</label>
                  <button
                    onClick={handleAiGenerateBio}
                    disabled={isGeneratingBio}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-brand-primary hover:text-brand-primary/80 transition-all disabled:opacity-50"
                  >
                    {isGeneratingBio ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    {isGeneratingBio ? 'Generating...' : 'AI Generate'}
                  </button>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${bio.length > 160 ? 'text-red-500' : 'text-slate-500'}`}>
                  {bio.length}/160
                </span>
              </div>
              <textarea
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                  if (e.target.value.length <= 160) setBioError('');
                }}
                className={`w-full bg-surface-900 border ${bioError ? 'border-red-500/50' : 'border-white/5'} rounded-2xl px-5 py-3.5 text-sm font-bold text-white focus:ring-2 ${bioError ? 'focus:ring-red-500/30' : 'focus:ring-brand-primary/50'} outline-none transition-all hover:border-white/10 min-h-[120px] resize-none`}
                placeholder="Tell your audience about yourself..."
              />
              {bioError && (
                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {bioError}
                </p>
              )}
            </div>
          </section>

          {/* Account Section */}
          <section className="premium-card-gloss p-8 rounded-[2.5rem] space-y-8">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-brand-primary" />
              <h3 className="text-lg font-black text-white">Account Security</h3>
            </div>

            <div className="space-y-4">
              {/* Email with verification status */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface-800 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white">Email Address</span>
                      {user?.emailVerified ? (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                          <AlertCircle className="w-3 h-3" />
                          Unverified
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">{user?.email}</div>
                  </div>
                </div>
                {!user?.emailVerified && (
                  <a
                    href="/api/auth/verify-email"
                    className="text-xs font-black text-brand-primary hover:underline uppercase tracking-widest"
                  >
                    Verify
                  </a>
                )}
              </div>

              {/* Two-Factor Authentication Section */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-800 flex items-center justify-center">
                      <Shield className={`w-5 h-5 ${twoFactorEnabled ? 'text-emerald-500' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <div className="text-sm font-black text-white">Two-Factor Authentication</div>
                      <div className="text-xs text-slate-500 font-medium">
                        {twoFactorEnabled ? 'Enabled' : 'Not enabled'}
                      </div>
                    </div>
                  </div>
                  {!twoFactorEnabled ? (
                    <button
                      onClick={handleSetup2FA}
                      disabled={isSettingUp2FA}
                      className="text-xs font-black text-brand-primary hover:underline uppercase tracking-widest disabled:opacity-50"
                    >
                      {isSettingUp2FA ? 'Loading...' : 'Enable'}
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowDisable2FAModal(true)}
                      className="text-xs font-black text-red-500 hover:underline uppercase tracking-widest"
                    >
                      Disable
                    </button>
                  )}
                </div>

                {twoFactorSuccess && (
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {twoFactorSuccess}
                  </p>
                )}

                {twoFactorError && (
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {twoFactorError}
                  </p>
                )}
              </div>

              {/* Password Section */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-800 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-white">Password</div>
                      <div className="text-xs text-slate-500 font-medium">
                        {user?.passwordLastChanged
                          ? `Last changed ${new Date(user.passwordLastChanged).toLocaleDateString()}`
                          : 'Never changed'}
                      </div>
                    </div>
                  </div>
                  {!showPasswordForm && (
                    <button
                      onClick={() => setShowPasswordForm(true)}
                      className="text-xs font-black text-brand-primary hover:underline uppercase tracking-widest"
                    >
                      Update
                    </button>
                  )}
                </div>

                {showPasswordForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pt-4 border-t border-white/5"
                  >
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => {
                          setCurrentPassword(e.target.value);
                          setPasswordError('');
                        }}
                        placeholder="Enter current password"
                        className="w-full bg-surface-900 border border-white/5 rounded-2xl px-5 py-3.5 text-sm font-bold text-white focus:ring-2 focus:ring-brand-primary/50 outline-none transition-all hover:border-white/10"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            setPasswordError('');
                          }}
                          placeholder="At least 8 characters"
                          className="w-full bg-surface-900 border border-white/5 rounded-2xl px-5 py-3.5 text-sm font-bold text-white focus:ring-2 focus:ring-brand-primary/50 outline-none transition-all hover:border-white/10"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setPasswordError('');
                          }}
                          placeholder="Re-enter new password"
                          className="w-full bg-surface-900 border border-white/5 rounded-2xl px-5 py-3.5 text-sm font-bold text-white focus:ring-2 focus:ring-brand-primary/50 outline-none transition-all hover:border-white/10"
                        />
                      </div>
                    </div>

                    {passwordError && (
                      <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {passwordError}
                      </p>
                    )}

                    {passwordSuccess && (
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {passwordSuccess}
                      </p>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowPasswordForm(false);
                          setCurrentPassword('');
                          setNewPassword('');
                          setConfirmPassword('');
                          setPasswordError('');
                          setPasswordSuccess('');
                        }}
                        className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handlePasswordChange}
                        disabled={isChangingPassword}
                        className="flex-1 py-3 rounded-xl bg-brand-primary text-white text-xs font-black hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20 uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isChangingPassword ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-3 h-3 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          <Lock className="w-3 h-3" />
                        )}
                        {isChangingPassword ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          {/* Custom Domain */}
          <section className="premium-card-gloss p-8 rounded-[2.5rem] space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Globe className="w-12 h-12 text-brand-primary" />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-brand-primary" />
              <h3 className="text-lg font-black text-white tracking-tight">Custom Domain</h3>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Connect your own domain (e.g. yourname.com) to your profile for a truly professional look.
              </p>

              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => handleDomainChange(e.target.value)}
                    placeholder="yourname.com"
                    className={`w-full bg-surface-900 border ${domainError ? 'border-red-500/50' : 'border-white/5'} rounded-2xl px-5 py-3.5 text-sm font-bold text-white focus:ring-2 ${domainError ? 'focus:ring-red-500/30' : 'focus:ring-brand-primary/50'} outline-none transition-all hover:border-white/10`}
                  />
                  {domainVerified && (
                    <CheckCircle2 className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                  )}
                </div>
                {domainError && (
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {domainError}
                  </p>
                )}
              </div>

              {/* Verification Status */}
              {customDomain && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">Verification Status</span>
                    {domainVerified ? (
                      <span className="flex items-center gap-1 text-emerald-500">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    ) : domainVerifyStatus === 'verified' ? (
                      <span className="flex items-center gap-1 text-emerald-500">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    ) : domainVerifyStatus === 'verifying' ? (
                      <span className="flex items-center gap-1 text-amber-500">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Checking
                      </span>
                    ) : (
                      <span className="text-amber-500">Pending</span>
                    )}
                  </div>

                  {domainVerifyMessage && (
                    <p className={`text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-1 ${domainVerifyStatus === 'verified' ? 'text-emerald-500' :
                        domainVerifyStatus === 'failed' ? 'text-red-500' : 'text-slate-400'
                      }`}>
                      {domainVerifyStatus === 'verified' ? <CheckCircle2 className="w-3 h-3" /> :
                        domainVerifyStatus === 'failed' ? <AlertCircle className="w-3 h-3" /> : null}
                      {domainVerifyMessage}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {!domainVerified && (
                      <button
                        onClick={handleInitiateVerification}
                        disabled={isVerifyingDomain || !!domainError}
                        className="flex-1 py-2.5 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-xs font-black text-brand-primary hover:bg-brand-primary/20 transition-all uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Shield className="w-3 h-3" />
                        Generate Record
                      </button>
                    )}
                    {showDnsInstructions && !domainVerified && (
                      <button
                        onClick={handleCheckVerification}
                        disabled={isVerifyingDomain}
                        className="flex-1 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-black hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20 uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isVerifyingDomain ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        {isVerifyingDomain ? 'Checking...' : 'Verify'}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* DNS Instructions */}
              {showDnsInstructions && verificationToken && !domainVerified && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-surface-950 border border-brand-primary/20 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-brand-primary" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">DNS Configuration</span>
                  </div>

                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                    Add the following TXT record to your domain&apos;s DNS settings. This proves you own the domain.
                  </p>

                  <div className="space-y-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</label>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10">
                        <code className="text-xs font-mono text-brand-primary font-bold">TXT</code>
                        <button
                          onClick={() => copyToClipboard('TXT')}
                          className="text-slate-500 hover:text-white transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Name / Host</label>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10">
                        <code className="text-xs font-mono text-white font-bold">_linknest</code>
                        <button
                          onClick={() => copyToClipboard('_linknest')}
                          className="text-slate-500 hover:text-white transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Value</label>
                      <div className="flex items-start justify-between p-2.5 rounded-lg bg-white/5 border border-white/10 gap-2">
                        <code className="text-xs font-mono text-white font-bold break-all">{verificationToken}</code>
                        <button
                          onClick={() => copyToClipboard(verificationToken)}
                          className="text-slate-500 hover:text-white transition-colors shrink-0 mt-0.5"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/10">
                    <p className="text-[10px] text-amber-500 font-medium flex items-start gap-2">
                      <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                      DNS changes may take a few minutes to propagate. After adding the record, click &quot;Verify&quot; to check.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Already verified badge */}
              {domainVerified && (
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Domain Verified</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Your domain <span className="text-white font-bold">{customDomain}</span> is connected and verified.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Danger Zone */}
          <section className="premium-card-gloss p-8 rounded-[2.5rem] border-red-500/10 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-black text-white tracking-tight">Danger Zone</h3>
            </div>

            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Once you delete your account, there is no going back. Please be certain.
            </p>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full py-3 rounded-xl bg-red-500/5 border border-red-500/10 text-xs font-black text-red-500 uppercase tracking-widest hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </section>
        </div>
      </div>

      {/* Image Cropper Modal */}
      <AnimatePresence>
        {showCropper && image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="premium-card-gloss w-full max-w-2xl rounded-[3rem] overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">Crop Profile Photo</h3>
                  <p className="text-slate-400 text-sm font-medium">Adjust your photo for the perfect look.</p>
                </div>
                <button
                  onClick={() => setShowCropper(false)}
                  className="p-3 rounded-2xl bg-white/5 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="relative flex-1 min-h-[400px] bg-surface-950">
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  cropShape="round"
                  showGrid={false}
                />
              </div>

              <div className="p-8 border-t border-white/5 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-black text-slate-500 uppercase tracking-widest">
                    <span>Zoom</span>
                    <span>{Math.round(zoom * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-1.5 bg-surface-800 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowCropper(false)}
                    className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-sm font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={showCroppedImage}
                    className="flex-1 py-4 rounded-2xl bg-brand-primary text-white text-sm font-black hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20 uppercase tracking-widest"
                  >
                    Apply Crop
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2FA Setup Modal */}
      <AnimatePresence>
        {showTwoFactorSetup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="premium-card-gloss w-full max-w-lg rounded-[3rem] overflow-hidden border border-brand-primary/20"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-brand-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white tracking-tight">Setup 2FA</h3>
                      <p className="text-xs text-slate-400 font-medium">Scan QR code with authenticator app</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowTwoFactorSetup(false);
                      setTwoFactorToken('');
                      setTwoFactorError('');
                    }}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-white p-4 rounded-2xl">
                    <img src={twoFactorQRCode} alt="2FA QR Code" className="w-48 h-48" />
                  </div>
                  <p className="text-xs text-slate-400 text-center font-medium">
                    Scan this QR code with Google Authenticator, Authy, or similar
                  </p>
                </div>

                {/* Manual Secret Key */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Manual Secret Key (if you can't scan QR)
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-surface-900 border border-white/5 rounded-xl px-4 py-3 text-xs font-mono text-brand-primary">
                      {twoFactorSecret}
                    </code>
                    <button
                      onClick={() => copyToClipboard(twoFactorSecret)}
                      className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
                    >
                      <Copy className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Verification Code Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Enter 6-digit verification code
                  </label>
                  <input
                    type="text"
                    value={twoFactorToken}
                    onChange={(e) => {
                      setTwoFactorToken(e.target.value.replace(/\D/g, '').slice(0, 6));
                      setTwoFactorError('');
                    }}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full bg-surface-900 border border-white/5 rounded-2xl px-5 py-3.5 text-2xl font-bold text-white focus:ring-2 focus:ring-brand-primary/50 outline-none transition-all hover:border-white/10 text-center tracking-[0.5em]"
                  />
                  {twoFactorError && (
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {twoFactorError}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleEnable2FA}
                  disabled={isSettingUp2FA || twoFactorToken.length !== 6}
                  className="w-full py-4 rounded-2xl bg-brand-primary text-white text-sm font-black hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSettingUp2FA ? 'Enabling...' : 'Enable 2FA'}
                </button>

                {/* Backup Codes */}
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <p className="text-xs font-black text-amber-500 uppercase tracking-widest">
                      Save these backup codes
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Keep these codes safe! Each code can only be used once.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {twoFactorBackupCodes.map((code, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-surface-900 rounded-lg px-3 py-2"
                      >
                        <code className="text-xs font-mono text-slate-300">{code}</code>
                        <button
                          onClick={() => copyToClipboard(code)}
                          className="text-slate-500 hover:text-white transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disable 2FA Modal */}
      <AnimatePresence>
        {showDisable2FAModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="premium-card-gloss w-full max-w-md rounded-[3rem] overflow-hidden border border-red-500/20"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-[2rem] bg-red-500/10 mx-auto">
                  <Shield className="w-8 h-8 text-red-500" />
                </div>

                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black text-white tracking-tight">Disable 2FA?</h3>
                  <p className="text-sm text-slate-400 font-medium">
                    This will make your account less secure.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Enter current 2FA code
                  </label>
                  <input
                    type="text"
                    value={disable2FAToken}
                    onChange={(e) => {
                      setDisable2FAToken(e.target.value.replace(/\D/g, '').slice(0, 6));
                      setTwoFactorError('');
                    }}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full bg-surface-900 border border-red-500/20 rounded-2xl px-5 py-3.5 text-2xl font-bold text-white focus:ring-2 focus:ring-red-500/30 outline-none transition-all hover:border-red-500/30 text-center tracking-[0.5em]"
                  />
                  {twoFactorError && (
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {twoFactorError}
                    </p>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowDisable2FAModal(false);
                      setDisable2FAToken('');
                      setTwoFactorError('');
                    }}
                    disabled={isSettingUp2FA}
                    className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-sm font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDisable2FA}
                    disabled={isSettingUp2FA || disable2FAToken.length !== 6}
                    className="flex-1 py-4 rounded-2xl bg-red-500 text-white text-sm font-black hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 uppercase tracking-widest disabled:opacity-50"
                  >
                    {isSettingUp2FA ? 'Disabling...' : 'Disable 2FA'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Account Deletion Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="premium-card-gloss w-full max-w-md rounded-[3rem] overflow-hidden border border-red-500/20"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-[2rem] bg-red-500/10 mx-auto">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>

                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black text-white tracking-tight">Delete Account?</h3>
                  <p className="text-sm text-slate-400 font-medium">
                    This action is permanent and irreversible. All your data, links, and analytics will be lost.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Type <span className="text-red-500">DELETE</span> to confirm
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => {
                      setDeleteConfirmText(e.target.value);
                      setDeleteError('');
                    }}
                    placeholder="DELETE"
                    className="w-full bg-surface-900 border border-red-500/20 rounded-2xl px-5 py-3.5 text-sm font-bold text-white focus:ring-2 focus:ring-red-500/30 outline-none transition-all hover:border-red-500/30 text-center uppercase tracking-widest"
                  />
                  {deleteError && (
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1 flex items-center gap-1 justify-center">
                      <AlertCircle className="w-3 h-3" />
                      {deleteError}
                    </p>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteConfirmText('');
                      setDeleteError('');
                    }}
                    disabled={isDeleting}
                    className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-sm font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting || deleteConfirmText !== 'DELETE'}
                    className="flex-1 py-4 rounded-2xl bg-red-500 text-white text-sm font-black hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    {isDeleting ? 'Deleting...' : 'Delete Account'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
