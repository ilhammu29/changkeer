'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShoppingBag, 
  Clock, 
  Flame, 
  CheckCircle2, 
  ExternalLink, 
  Plus, 
  Ticket, 
  ShieldCheck, 
  ChevronRight, 
  Copy, 
  Check, 
  UtensilsCrossed, 
  Package, 
  Bike, 
  Printer, 
  MessageCircle, 
  Coffee, 
  Gift, 
  CreditCard, 
  QrCode, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Share2, 
  LogOut, 
  Calendar, 
  Wallet, 
  Building2, 
  UserCheck, 
  MapPin, 
  TrendingDown,
  Settings,
  X,
  Edit3,
  Sparkles,
  AlertCircle,
  Camera,
  UploadCloud,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { ClientLayout } from '@/components/client/ClientLayout';
import { Order, CustomerProfile } from '@/types';
import { generateWhatsAppReceiptText, getWhatsAppUrl } from '@/lib/utils/whatsapp';
import { ThermalReceiptModal } from '@/components/order/ThermalReceiptModal';
import { compressImage, validateImageSize } from '@/lib/utils/image-compression';
import { safeParseCustomerSession } from '@/lib/auth/session-helpers';

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function isUnoptimizedImg(src?: string | null): boolean {
  if (!src) return false;
  return src.startsWith('data:') || src.startsWith('blob:') || src.startsWith('/uploads/');
}

export default function AccountPage() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active-orders' | 'history' | 'vouchers' | 'card'>('active-orders');
  const [copiedVoucher, setCopiedVoucher] = useState<string | null>(null);
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<Order | null>(null);
  const [copiedCardNumber, setCopiedCardNumber] = useState(false);
  const [copiedProfileLink, setCopiedProfileLink] = useState(false);

  // Edit Profile States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editTemp, setEditTemp] = useState<'hot' | 'iced'>('hot');
  const [editSweetness, setEditSweetness] = useState<'0%' | '25%' | '50%' | '100%'>('0%');
  const [editAvatarUrl, setEditAvatarUrl] = useState<string | null>(null);
  const [editBannerUrl, setEditBannerUrl] = useState<string | null>(null);
  
  // Image Upload & Compression States
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState('');
  const [profileSaveError, setProfileSaveError] = useState('');

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 1. Try reading customer session from cookie
    try {
      const match = document.cookie.match(/changkeer_customer_session=([^;]+)/);
      if (match) {
        const parsed = safeParseCustomerSession(match[1]);
        if (parsed && parsed.email) {
          setProfile(parsed);
          try {
            localStorage.setItem('changkeer_customer_session', JSON.stringify(parsed));
          } catch {}
          fetchCustomerOrders(parsed.email);
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to parse customer cookie:', e);
    }

    // 2. Try reading customer session from localStorage fallback
    try {
      const stored = localStorage.getItem('changkeer_customer_session');
      if (stored) {
        const parsed = safeParseCustomerSession(stored);
        if (parsed && parsed.email) {
          setProfile(parsed);
          try {
            document.cookie = `changkeer_customer_session=${encodeURIComponent(JSON.stringify(parsed))}; path=/; max-age=2592000; SameSite=Lax;`;
          } catch {}
          fetchCustomerOrders(parsed.email);
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to parse customer localStorage:', e);
    }

    // If not logged in, redirect to login page
    window.location.href = '/login?redirect=/account';
  }, []);

  const fetchCustomerOrders = async (email: string) => {
    try {
      const res = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error('Error fetching customer orders:', e);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedVoucher(code);
    setTimeout(() => setCopiedVoucher(null), 2000);
  };

  const copyCard = () => {
    navigator.clipboard.writeText('8892 4521 9920 2026');
    setCopiedCardNumber(true);
    setTimeout(() => setCopiedCardNumber(false), 2000);
  };

  const copyProfileShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://changkeer.vercel.app/account';
    navigator.clipboard.writeText(url);
    setCopiedProfileLink(true);
    setTimeout(() => setCopiedProfileLink(false), 2000);
  };

  const handleLogout = () => {
    document.cookie = 'changkeer_customer_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    try {
      localStorage.removeItem('changkeer_customer_session');
    } catch {}
    window.location.href = '/login';
  };

  // Open Edit Profile Modal & populate current fields
  const handleOpenEditProfile = () => {
    if (!profile) return;
    setEditFullName(profile.full_name || '');
    setEditPhone(profile.phone_number || '');
    setEditAddress(profile.default_address || '');
    setEditBio((profile as any).bio || 'Aficionado of seasonal botanical infusions & artisan cold brews. Embracing circadian balance with low-sugar botanical creations at Changkeer Atelier.');
    setEditTemp((profile as any).preferred_temperature || 'hot');
    setEditSweetness((profile as any).preferred_sweetness || '0%');
    setEditAvatarUrl(profile.avatar_url || null);
    setEditBannerUrl((profile as any).banner_url || null);
    setProfileSaveSuccess('');
    setProfileSaveError('');
    setIsEditModalOpen(true);
  };

  // Upload and Compress Image Handler (Max 5MB)
  const handleImageUpload = async (file: File, type: 'avatar' | 'banner') => {
    setProfileSaveError('');
    setUploadFeedback(null);

    // 1. Strict 5MB limit check
    const validation = validateImageSize(file);
    if (!validation.valid) {
      setProfileSaveError(validation.error || 'File size exceeds 5MB limit.');
      return;
    }

    const isAvatar = type === 'avatar';
    if (isAvatar) setUploadingAvatar(true);
    else setUploadingBanner(true);

    const originalKB = Math.round(file.size / 1024);
    setUploadFeedback(`Compressing image (${originalKB}KB)...`);

    try {
      // 2. Client-side Image Compression via HTML5 Canvas (with safe fallback)
      const compressed = await compressImage(file, {
        maxWidth: isAvatar ? 500 : 1600,
        maxHeight: isAvatar ? 500 : 800,
        quality: 0.82,
        format: 'image/jpeg',
      });

      const compressedKB = Math.round(compressed.compressedSize / 1024);
      setUploadFeedback(`Uploading image (${originalKB}KB → ${compressedKB}KB)...`);

      // 3. Immediate visual preview in UI
      if (compressed.dataUrl) {
        if (isAvatar) setEditAvatarUrl(compressed.dataUrl);
        else setEditBannerUrl(compressed.dataUrl);
      }

      // 4. Upload to Server API with automatic client fallback for online environments
      let uploadedUrl: string = compressed.dataUrl;

      try {
        const formData = new FormData();
        formData.append('file', compressed.file);
        formData.append('type', type);
        if (profile) {
          formData.append('customer_session', JSON.stringify(profile));
        }

        const headers: Record<string, string> = {};
        if (profile) {
          headers['x-customer-session'] = encodeURIComponent(JSON.stringify(profile));
        }

        const res = await fetch('/api/auth/customer/upload', {
          method: 'POST',
          headers,
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.success && data.publicUrl) {
          uploadedUrl = data.publicUrl;
        } else {
          console.warn('Server upload fallback to client compressed image:', data?.error);
        }
      } catch (uploadErr) {
        console.warn('Network upload fallback to client compressed image:', uploadErr);
      }

      // 5. Update session profile via API
      let updatedProfile = {
        ...profile,
        [isAvatar ? 'avatar_url' : 'banner_url']: uploadedUrl,
      };

      try {
        const patchRes = await fetch('/api/auth/customer/profile', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(profile ? { 'x-customer-session': encodeURIComponent(JSON.stringify(profile)) } : {}),
          },
          body: JSON.stringify({
            [isAvatar ? 'avatar_url' : 'banner_url']: uploadedUrl,
            ...(profile ? { customer_session: profile } : {}),
          }),
        });

        const patchData = await patchRes.json();
        if (patchRes.ok && patchData.profile) {
          updatedProfile = patchData.profile;
        }
      } catch (patchErr) {
        console.warn('Profile PATCH error, updating local session:', patchErr);
      }

      setProfile(updatedProfile as CustomerProfile);
      try {
        localStorage.setItem('changkeer_customer_session', JSON.stringify(updatedProfile));
        document.cookie = `changkeer_customer_session=${encodeURIComponent(JSON.stringify(updatedProfile))}; path=/; max-age=2592000; SameSite=Lax;`;
      } catch {}

      if (isAvatar) setEditAvatarUrl(uploadedUrl);
      else setEditBannerUrl(uploadedUrl);

      setUploadFeedback(`Success! ${isAvatar ? 'Profile photo' : 'Cover banner'} updated.`);
      setTimeout(() => setUploadFeedback(null), 3000);

    } catch (err: any) {
      console.error('Upload error:', err);
      setUploadFeedback(null); // CRITICAL: NEVER LEAVE IT STUCK ON SCREEN!
      setProfileSaveError(err.message || 'Failed to process image');
    } finally {
      if (isAvatar) setUploadingAvatar(false);
      else setUploadingBanner(false);
    }
  };

  // Save Profile Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaveError('');
    setProfileSaveSuccess('');

    if (!editFullName.trim()) {
      setProfileSaveError('Full name is required');
      return;
    }

    setIsSavingProfile(true);

    try {
      const payload = {
        full_name: editFullName.trim(),
        phone_number: editPhone.trim() || null,
        default_address: editAddress.trim() || null,
        bio: editBio.trim() || null,
        preferred_temperature: editTemp,
        preferred_sweetness: editSweetness,
        avatar_url: editAvatarUrl,
        banner_url: editBannerUrl,
        ...(profile ? { customer_session: profile } : {}),
      };

      const res = await fetch('/api/auth/customer/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(profile ? { 'x-customer-session': encodeURIComponent(JSON.stringify(profile)) } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.profile) {
        throw new Error(data.error || 'Failed to save profile');
      }

      // Update state & localStorage
      const updatedProfile: CustomerProfile = data.profile;
      setProfile(updatedProfile);

      try {
        localStorage.setItem('changkeer_customer_session', JSON.stringify(updatedProfile));
        document.cookie = `changkeer_customer_session=${encodeURIComponent(JSON.stringify(updatedProfile))}; path=/; max-age=2592000; SameSite=Lax;`;
      } catch {}

      setProfileSaveSuccess('Your profile has been updated!');
      setTimeout(() => {
        setIsEditModalOpen(false);
        setProfileSaveSuccess('');
      }, 1200);

    } catch (err: any) {
      console.error('Error saving profile:', err);
      setProfileSaveError(err.message || 'An error occurred while saving profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const activeOrders = orders.filter(o => ['received', 'brewing', 'ready'].includes(o.order_status));
  const pastOrders = orders.filter(o => ['completed', 'cancelled'].includes(o.order_status));
  const completedOrders = orders.filter(o => o.order_status === 'completed');

  // Digital Stamp Card Logic (5-Stamp Cycle)
  const completedCount = completedOrders.length;
  const currentStamps = completedCount % 5;
  const isRewardReady = completedCount > 0 && (currentStamps === 0 || completedCount >= 5);
  const activeStampsDisplay = isRewardReady && currentStamps === 0 ? 5 : currentStamps;
  const stampsRemaining = 5 - activeStampsDisplay;

  // Total Lifetime Spend & Tea Points
  const totalSpend = completedOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const teaPoints = Math.floor(totalSpend / 100);

  // Username generator
  const usernameHandle = profile?.full_name 
    ? profile.full_name.toLowerCase().trim().replace(/[^a-z0-9]/g, '_').slice(0, 15)
    : 'tea_connoisseur';

  const userBio = (profile as any)?.bio || 'Aficionado of seasonal botanical infusions & artisan cold brews. Embracing circadian balance with low-sugar botanical creations at Changkeer Atelier.';
  const userBanner = (profile as any)?.banner_url || null;
  const userAvatar = profile?.avatar_url || null;

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-white text-neutral-900 flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">Loading Changkeer Atelier Account...</p>
        </div>
      </div>
    );
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <ClientLayout 
      pageTitle="Profile &amp; Atelier Settings" 
      subtitle="Social Profile, Digital Tea Banking &amp; Settings"
      bgClassName="bg-white"
    >
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-14 bg-white font-sans">
        
        {/* Hidden File Inputs for Direct Photo Uploads */}
        <input 
          ref={avatarInputRef}
          type="file" 
          accept="image/jpeg,image/png,image/webp" 
          className="hidden" 
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleImageUpload(f, 'avatar');
            e.target.value = '';
          }}
        />
        <input 
          ref={bannerInputRef}
          type="file" 
          accept="image/jpeg,image/png,image/webp" 
          className="hidden" 
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleImageUpload(f, 'banner');
            e.target.value = '';
          }}
        />

        {/* Global Upload Notification Banner */}
        {uploadFeedback && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 shadow-2xs font-sans animate-in fade-in">
            {uploadingAvatar || uploadingBanner ? (
              <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin shrink-0" />
            ) : (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span className="font-medium">{uploadFeedback}</span>
          </div>
        )}

        {/* Global Error Notification Banner (Visible when not in modal) */}
        {profileSaveError && !isEditModalOpen && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between gap-2.5 shadow-2xs font-sans animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span className="font-medium">{profileSaveError}</span>
            </div>
            <button
              type="button"
              onClick={() => setProfileSaveError('')}
              className="text-red-600 hover:text-red-800 font-bold underline cursor-pointer text-[11px]"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* =========================================================================
            HEADER: FULL-WIDTH PROFILE LAYOUT WITH CUSTOM BANNER & AVATAR UPLOAD
            ========================================================================= */}
        <div className="w-full space-y-6 sm:space-y-8 pb-8 sm:pb-12 border-b border-neutral-100">
          
          {/* Cover Banner (Supports Uploaded Custom Photo with auto-compression) */}
          <div className="w-full h-44 sm:h-60 rounded-3xl relative overflow-hidden shadow-sm flex items-start justify-between p-6 sm:p-8 bg-neutral-900 group">
            
            {/* Background: Custom Banner Photo or Minimalist Gradient Fallback */}
            {userBanner ? (
              <>
                <Image
                  src={userBanner}
                  alt="Profile Cover"
                  fill
                  priority
                  unoptimized={isUnoptimizedImg(userBanner)}
                  className="object-cover object-center group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40 backdrop-blur-[0.5px]" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-800" />
            )}

            {/* Left: Quick Banner Upload Trigger */}
            <div className="relative z-15">
              <button
                type="button"
                disabled={uploadingBanner}
                onClick={() => bannerInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-black/40 hover:bg-black/70 backdrop-blur-md text-white border border-white/20 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                title="Change Cover Banner (Max 5MB, Auto-compress)"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{uploadingBanner ? 'Compressing...' : 'Change Cover'}</span>
              </button>
            </div>

            {/* Right: Profile Actions */}
            <div className="relative z-15 flex items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={handleOpenEditProfile}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-black/40 hover:bg-black/70 backdrop-blur-md text-white border border-white/20 text-xs font-semibold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer"
                title="Edit Customer Profile"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>

              <button
                type="button"
                onClick={copyProfileShare}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-black/40 hover:bg-black/70 backdrop-blur-md text-white border border-white/20 text-xs font-semibold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer"
                title="Share Profile Link"
              >
                {copiedProfileLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Share</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-black/40 hover:bg-red-500/30 backdrop-blur-md text-white hover:text-red-300 border border-white/20 text-xs font-semibold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer"
                title="Sign out of account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Sign Out</span>
              </button>
            </div>
          </div>

          {/* Profile Identity (Natural Full Flow, Overlapping Large Avatar with Upload Button) */}
          <div className="px-2 sm:px-4 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-22">
              
              <div className="flex flex-col sm:flex-row sm:items-end gap-5 sm:gap-6">
                
                {/* Circular Avatar with Camera Upload Icon */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-4xl sm:text-5xl shadow-lg ring-4 ring-white shrink-0 group/avatar">
                  {userAvatar ? (
                    <Image
                      src={userAvatar}
                      alt={profile?.full_name || 'Profile Photo'}
                      fill
                      unoptimized={isUnoptimizedImg(userAvatar)}
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <span>{profile?.full_name ? profile.full_name[0].toUpperCase() : 'C'}</span>
                  )}

                  {/* Direct Avatar Upload Trigger Button */}
                  <button
                    type="button"
                    disabled={uploadingAvatar}
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white flex items-center justify-center cursor-pointer shadow-md ring-2 ring-white transition-all hover:scale-105"
                    title="Change Profile Photo (Max 5MB, Auto-compress)"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* Name & Handle (Clean, No badge pill) */}
                <div className="space-y-1.5 pt-2 sm:pt-0">
                  <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-neutral-900 font-sans">
                    {profile?.full_name || 'Changkeer Patron'}
                  </h1>

                  <p className="text-xs sm:text-sm font-mono text-neutral-500 flex flex-wrap items-center gap-x-2">
                    <span>@{usernameHandle}</span>
                    <span className="text-neutral-300">&bull;</span>
                    <span className="font-sans text-neutral-500">{profile?.email}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenEditProfile}
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 hover:border-neutral-500 bg-white text-neutral-800 text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Settings</span>
                </button>

                <Link
                  href="/order"
                  className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Order Now</span>
                </Link>
              </div>

            </div>

            {/* Social Bio & Details */}
            <div className="space-y-4 pt-3">
              <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl leading-relaxed">
                {userBio}
              </p>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-neutral-500 font-sans">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-neutral-400" />
                  <span>{profile?.default_address ? profile.default_address : 'Atelier Jakarta • Table Lounge 03'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  <span>Member Since October 2024</span>
                </span>
                {profile?.phone_number && (
                  <span className="flex items-center gap-1.5 font-mono">
                    <UserCheck className="w-4 h-4 text-neutral-400" />
                    <span>{profile.phone_number}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Metrics & Statistics Strip (Spacious, Clean Typography) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 mt-6 border-t border-neutral-100">
              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50/80 border border-neutral-100 space-y-1">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-400 block">
                  Total Brews
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold font-sans text-neutral-900 block">
                  {orders.length}
                </span>
                <span className="text-xs text-neutral-500 block">Cups savored</span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50/80 border border-neutral-100 space-y-1">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-400 block">
                  Tea Reward Points
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold font-sans text-emerald-800 block">
                  {teaPoints.toLocaleString('id-ID')}
                </span>
                <span className="text-xs text-neutral-500 block">Equivalent to {formatRupiah(teaPoints * 10)}</span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50/80 border border-neutral-100 space-y-1">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-400 block">
                  Loyalty Stamps
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold font-sans text-amber-800 block">
                  {activeStampsDisplay} <span className="text-sm text-neutral-400 font-normal">/ 5</span>
                </span>
                <span className="text-xs text-neutral-500 block">
                  {isRewardReady ? '1 Free cup unlocked' : `${stampsRemaining} more for free cup`}
                </span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50/80 border border-neutral-100 space-y-1">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-400 block">
                  Total Spending
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-900 block">
                  {formatRupiah(totalSpend)}
                </span>
                <span className="text-xs text-neutral-500 block">Atelier transaction history</span>
              </div>
            </div>

          </div>

        </div>

        {/* =========================================================================
            FINTECH SECTION: VIRTUAL MEMBER CARD + BANKING QUICK ACTIONS
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch pb-8 sm:pb-12 border-b border-neutral-100">
          
          {/* Virtual Titanium Debit Card (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 text-white p-7 sm:p-8 shadow-md relative overflow-hidden border border-neutral-800 flex flex-col justify-between min-h-[230px] sm:min-h-[260px]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Row: Brand & Chip */}
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase block">
                  CHANGKEER BOTANICAL ATELIER
                </span>
                <h3 className="font-sans font-extrabold text-base sm:text-lg tracking-wider uppercase text-white mt-1">
                  ATELIER PRIVILEGE PASS
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center text-neutral-400" title="Contactless Payment Ready">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M8.5 16.5a5 5 0 0 1 0-7" strokeLinecap="round" />
                    <path d="M12 19a8.5 8.5 0 0 0 0-14" strokeLinecap="round" />
                    <path d="M15.5 21.5a12 12 0 0 0 0-19" strokeLinecap="round" />
                  </svg>
                </div>

                <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300 shadow-inner flex items-center justify-center relative">
                  <div className="w-7 h-4 border border-amber-800/40 rounded-sm" />
                </div>
              </div>
            </div>

            {/* Middle Row: Card Number & Copy */}
            <div className="relative z-10 py-5 sm:py-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-base sm:text-xl font-bold tracking-[0.25em] text-neutral-200">
                  8892 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 2026
                </span>
                <button
                  type="button"
                  onClick={copyCard}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  title="Copy Virtual Card Number"
                >
                  {copiedCardNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 block mt-1">
                Virtual ID: CKR-{profile?.email ? profile.email.slice(0, 4).toUpperCase() : 'PASS'}-8892
              </span>
            </div>

            {/* Bottom Row: Cardholder Name, Expiry, Loyalty Balance */}
            <div className="relative z-10 flex items-end justify-between pt-3 border-t border-white/10 text-xs">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 block">
                  CARDHOLDER NAME
                </span>
                <span className="font-mono font-bold tracking-wider uppercase text-neutral-200 text-xs sm:text-sm">
                  {profile?.full_name || 'VALUED MEMBER'}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 block">
                  TEAPASS BALANCE
                </span>
                <span className="font-mono font-bold text-amber-300 text-xs sm:text-sm">
                  {formatRupiah(teaPoints * 10)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Bank Action Tiles (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between gap-5">
            <div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Quick Actions
              </span>
              <h3 className="font-sans font-extrabold text-base sm:text-lg uppercase tracking-tight text-neutral-900">
                Digital Atelier Actions
              </h3>
            </div>

            {/* 4 Banking-style quick actions */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <Link
                href="/order"
                className="p-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 transition-all flex flex-col items-start justify-between gap-2.5 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <span className="font-bold text-xs text-neutral-900 block font-sans">Order Tea</span>
                  <span className="text-[11px] text-neutral-500 font-sans">Botanical Catalog</span>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setActiveTab('active-orders')}
                className="p-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 transition-all flex flex-col items-start justify-between gap-2.5 cursor-pointer text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-neutral-900 block font-sans">Active Brews</span>
                  <span className="text-[11px] text-neutral-500 font-sans">{activeOrders.length} in bar queue</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('vouchers')}
                className="p-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 transition-all flex flex-col items-start justify-between gap-2.5 cursor-pointer text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-800 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-neutral-900 block font-sans">Claim Vouchers</span>
                  <span className="text-[11px] text-neutral-500 font-sans">{isRewardReady ? '1 Free Cup Ready' : 'Discount Coupons'}</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className="p-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 transition-all flex flex-col items-start justify-between gap-2.5 cursor-pointer text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-neutral-800 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-neutral-900 block font-sans">Orders &amp; Receipts</span>
                  <span className="text-[11px] text-neutral-500 font-sans">Thermal &amp; WhatsApp</span>
                </div>
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAFAF8] border border-neutral-200/80 text-xs text-neutral-600 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Connected to Atelier Barista Kitchen</span>
              </span>
            </div>
          </div>

        </div>

        {/* =========================================================================
            LOYALTY STAMP CARD (5 SLOTS PROGRESS)
            ========================================================================= */}
        <div className="w-full space-y-6 pb-8 sm:pb-12 border-b border-neutral-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold font-sans uppercase tracking-wider text-amber-900">
                <Coffee className="w-4 h-4 text-amber-800" />
                <span>Atelier Loyalty Stamp Card</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-sans font-extrabold uppercase tracking-tight text-neutral-900">
                Collect 5 Stamps &mdash; Enjoy 1 Free Cup
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 font-sans max-w-xl leading-relaxed">
                Every completed tea order earns 1 digital stamp. Enjoy a complimentary artisanal blend when your 5-stamp card is filled.
              </p>
            </div>

            {isRewardReady && (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider shadow-xs font-sans shrink-0">
                <Gift className="w-4 h-4" />
                <span>1 Free Cup Ready to Claim!</span>
              </div>
            )}
          </div>

          {/* 5 Circular Stamp Slots */}
          <div className="grid grid-cols-5 gap-3 sm:gap-6 pt-3">
            {[1, 2, 3, 4, 5].map((slotNumber) => {
              const isFilled = slotNumber <= activeStampsDisplay;
              const isRewardSlot = slotNumber === 5;

              return (
                <div
                  key={slotNumber}
                  className={`relative aspect-square max-w-[100px] mx-auto w-full rounded-full border-2 flex flex-col items-center justify-center p-2 text-center transition-all ${
                    isFilled
                      ? isRewardSlot
                        ? 'border-amber-600 bg-amber-50 shadow-xs ring-4 ring-amber-100/50'
                        : 'border-neutral-900 bg-neutral-900 text-white shadow-xs ring-4 ring-neutral-100'
                      : isRewardSlot
                        ? 'border-dashed border-amber-400 bg-amber-50/30 text-amber-800'
                        : 'border-dashed border-neutral-200 bg-neutral-50 text-neutral-400'
                  }`}
                >
                  {isRewardSlot ? (
                    <div className="flex flex-col items-center">
                      <Gift className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 ${isFilled ? 'text-amber-800' : 'text-amber-600'}`} />
                      <span className={`text-[9px] sm:text-[10px] font-sans font-bold uppercase ${isFilled ? 'text-amber-900' : 'text-amber-700'}`}>
                        {isFilled ? 'Claim' : 'Free'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Coffee className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 ${isFilled ? 'text-white' : 'text-neutral-300'}`} />
                      <span className="text-[9px] sm:text-[10px] font-sans font-bold">
                        #{slotNumber}
                      </span>
                    </div>
                  )}

                  {isFilled && (
                    <div className="absolute top-0 right-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[9px] shadow-xs">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Stamp Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 text-xs font-sans border-t border-neutral-100">
            <div>
              <span className="font-bold text-neutral-900 block text-xs sm:text-sm">
                {isRewardReady 
                  ? 'Congratulations! Stamp Card Completed (5/5).' 
                  : `Card Progress: ${activeStampsDisplay} of 5 Stamps.`}
              </span>
              <span className="text-neutral-500 text-xs font-normal">
                {isRewardReady 
                  ? 'Apply promo code GRATIS1CUP at checkout or show to the barista.' 
                  : `Order ${stampsRemaining} more tea brews to unlock your complimentary cup.`}
              </span>
            </div>

            {isRewardReady ? (
              <button
                type="button"
                onClick={() => copyCode('GRATIS1CUP')}
                className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shrink-0 shadow-xs font-sans"
              >
                {copiedVoucher === 'GRATIS1CUP' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Code Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code: GRATIS1CUP</span>
                  </>
                )}
              </button>
            ) : (
              <Link
                href="/order"
                className="px-5 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-900 font-bold text-xs uppercase tracking-wider transition-colors shrink-0 text-center font-sans"
              >
                Collect Stamps
              </Link>
            )}
          </div>
        </div>

        {/* =========================================================================
            TABS: SEDUHAN AKTIF | MUTASI & RIWAYAT | VOUCHER SAYA | PENGATURAN AKUN
            ========================================================================= */}
        <div className="space-y-6">
          
          {/* Tab Navigation Pill Bar */}
          <div className="flex p-1.5 rounded-2xl bg-neutral-100 border border-neutral-200/80 gap-1.5 overflow-x-auto text-xs font-bold font-sans scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('active-orders')}
              className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'active-orders'
                  ? 'bg-white text-neutral-900 shadow-xs font-extrabold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Active Brews ({activeOrders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-white text-neutral-900 shadow-xs font-extrabold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              <span>History &amp; Receipts ({pastOrders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('vouchers')}
              className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'vouchers'
                  ? 'bg-white text-neutral-900 shadow-xs font-extrabold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>Vouchers &amp; Rewards ({isRewardReady ? '3 Coupons' : '2 Coupons'})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('card')}
              className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'card'
                  ? 'bg-white text-neutral-900 shadow-xs font-extrabold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Account Settings</span>
            </button>
          </div>

          {/* TAB 1: ACTIVE ORDERS LIVE TRACKER */}
          {activeTab === 'active-orders' && (
            <div className="space-y-6">
              {activeOrders.length === 0 ? (
                <div className="py-16 sm:py-20 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-neutral-100 mx-auto flex items-center justify-center text-neutral-400">
                    <Flame className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-neutral-900 font-sans">No Active Brews in the Bar</h3>
                    <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto font-sans leading-relaxed">
                      You have no active orders today. Explore our herbal infusions or artisan cold brews for our baristas to prepare.
                    </p>
                  </div>
                  <Link
                    href="/order"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs font-sans"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Browse Atelier Menu</span>
                  </Link>
                </div>
              ) : (
                activeOrders.map((order) => {
                  const step = order.order_status === 'received' ? 1 : order.order_status === 'brewing' ? 2 : 3;
                  const waText = generateWhatsAppReceiptText(order, origin);
                  const waUrl = getWhatsAppUrl('081234567890', waText);

                  return (
                    <div key={order.id} className="p-6 rounded-3xl border border-neutral-200/90 bg-white shadow-xs space-y-5">
                      
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-mono text-base font-bold text-neutral-900">
                              #{order.order_number}
                            </span>
                            <span className="text-xs font-bold font-sans uppercase text-emerald-800">
                              {order.order_status === 'received' ? 'Received' : order.order_status === 'brewing' ? 'Brewing' : 'Ready to Serve'}
                            </span>
                          </div>
                          <span className="text-xs text-neutral-400 font-mono mt-1 block">
                            Ordered at: {new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} &bull; {order.order_type === 'dine_in' ? `Table: ${order.table_number || 'Dine-In'}` : order.order_type === 'takeaway' ? 'Takeaway' : 'Delivery'}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-neutral-400 uppercase font-mono block">Total</span>
                          <span className="text-lg font-bold text-neutral-900 font-mono">{formatRupiah(order.total_amount)}</span>
                        </div>
                      </div>

                      {/* Stepper Progress Tracker */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
                        <div className={`p-4 rounded-xl border transition-all flex sm:flex-col items-center sm:justify-center gap-2 ${
                          step >= 1 ? 'border-neutral-900 bg-neutral-900 text-white font-bold' : 'border-neutral-200 bg-neutral-50 text-neutral-400'
                        }`}>
                          <span className="font-mono text-[10px] block opacity-80 shrink-0">STEP 1</span>
                          <span>Received by Bar</span>
                        </div>
                        <div className={`p-4 rounded-xl border transition-all flex sm:flex-col items-center sm:justify-center gap-2 ${
                          step >= 2 ? 'border-neutral-900 bg-neutral-900 text-white font-bold' : 'border-neutral-200 bg-neutral-50 text-neutral-400'
                        }`}>
                          <span className="font-mono text-[10px] block opacity-80 shrink-0">STEP 2</span>
                          <span>Steeping &amp; Brewing</span>
                        </div>
                        <div className={`p-4 rounded-xl border transition-all flex sm:flex-col items-center sm:justify-center gap-2 ${
                          step >= 3 ? 'border-neutral-900 bg-neutral-900 text-white font-bold' : 'border-neutral-200 bg-neutral-50 text-neutral-400'
                        }`}>
                          <span className="font-mono text-[10px] block opacity-80 shrink-0">STEP 3</span>
                          <span>Ready to Serve</span>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="space-y-2.5 pt-1">
                        <span className="text-[10px] font-sans uppercase tracking-wider text-neutral-400 block font-bold">
                          Brew Details:
                        </span>
                        {(order.items || []).map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-50/80 border border-neutral-100 text-xs font-sans">
                            <div>
                              <span className="font-bold text-neutral-900 block">{item.product_name} x {item.quantity}</span>
                              <span className="text-[11px] text-neutral-500">
                                {item.temperature === 'hot' ? 'Hot' : 'Iced'}, Sweetness: {item.sweetness_level}
                                {item.selected_addons?.length ? `, +${item.selected_addons.map(a => a.name).join(', ')}` : ''}
                              </span>
                            </div>
                            <span className="font-mono font-bold text-neutral-900">{formatRupiah(item.subtotal)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action buttons */}
                      <div className="pt-3 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-100">
                        <div className="flex items-center gap-2.5">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors font-sans"
                            title="Send Receipt to WhatsApp Barista"
                          >
                            <MessageCircle className="w-4 h-4 text-neutral-700" />
                            <span>WhatsApp Receipt</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => setSelectedOrderForPrint(order)}
                            className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer font-sans"
                            title="Print Thermal Receipt / Cup Sticker"
                          >
                            <Printer className="w-4 h-4 text-neutral-700" />
                            <span>Print Receipt</span>
                          </button>
                        </div>

                        <Link
                          href={`/order/success/${order.id}`}
                          className="text-xs font-bold text-neutral-900 hover:underline flex items-center gap-1.5 font-sans"
                        >
                          <span>View Table QR &amp; Order Slip</span>
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: BANK-STATEMENT MUTASI & RIWAYAT PESANAN */}
          {activeTab === 'history' && (
            <div className="p-6 sm:p-8 rounded-3xl border border-neutral-200/90 bg-white shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-neutral-900 font-sans uppercase">
                    Atelier Account History
                  </h3>
                  <p className="text-xs text-neutral-500 font-sans mt-0.5">
                    Record of tea orders, receipts, and loyalty reward points.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-neutral-400">
                  {pastOrders.length} Transactions
                </span>
              </div>

              {pastOrders.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <CheckCircle2 className="w-14 h-14 text-neutral-300 mx-auto" />
                  <h4 className="font-bold text-base text-neutral-900 font-sans">No Transaction History Yet</h4>
                  <p className="text-xs text-neutral-500 font-sans">Completed orders and receipts will appear here.</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {pastOrders.map((order) => {
                    const waText = generateWhatsAppReceiptText(order, origin);
                    const waUrl = getWhatsAppUrl('081234567890', waText);
                    const isCancelled = order.order_status === 'cancelled';

                    return (
                      <div key={order.id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                        <div className="flex items-start gap-4">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                            isCancelled 
                              ? 'bg-neutral-100 text-neutral-400' 
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          }`}>
                            <ArrowDownLeft className="w-5 h-5 stroke-[2.5]" />
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="font-mono text-xs font-bold text-neutral-900">
                                #{order.order_number}
                              </span>
                              <span className="text-xs font-semibold text-neutral-600 font-sans">
                                {isCancelled ? 'Cancelled' : 'Completed'}
                              </span>
                              <span className="text-xs font-mono text-neutral-400">
                                {order.payment_method?.toUpperCase() || 'QRIS'}
                              </span>
                            </div>

                            <p className="text-xs sm:text-sm text-neutral-700 font-medium">
                              {(order.items || []).map(i => `${i.product_name} (${i.quantity}x)`).join(', ')}
                            </p>

                            <span className="text-[11px] text-neutral-400 block font-mono">
                              {new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} &bull; {new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 pl-15 sm:pl-0">
                          <div className="text-right">
                            <span className="text-base font-bold font-mono text-neutral-900 block">
                              -{formatRupiah(order.total_amount)}
                            </span>
                            <span className="text-xs text-emerald-700 font-mono">
                              +{Math.floor(order.total_amount / 100)} PTS
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-700 transition-colors"
                              title="Send WhatsApp Receipt"
                            >
                              <MessageCircle className="w-4 h-4 text-neutral-700" />
                            </a>

                            <button
                              type="button"
                              onClick={() => setSelectedOrderForPrint(order)}
                              className="p-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer"
                              title="Print Thermal Receipt"
                            >
                              <Printer className="w-4 h-4" />
                            </button>

                            <Link
                              href="/order"
                              className="px-4 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-900 text-xs font-bold uppercase tracking-wider transition-colors font-sans"
                            >
                              Order Again
                            </Link>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VOUCHERS CATALOG & PERKS */}
          {activeTab === 'vouchers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Loyalty Reward Voucher */}
              {isRewardReady && (
                <div className="bg-gradient-to-br from-amber-50/60 to-white border border-amber-300 rounded-3xl p-6 shadow-xs relative overflow-hidden">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 font-sans block">
                        5-Stamp Reward &bull; 1 Free Cup
                      </span>
                      <h4 className="text-base font-bold text-neutral-900 mt-1 font-sans">
                        Complimentary Botanical Tea Cup
                      </h4>
                      <p className="text-xs text-neutral-500 mt-1 font-sans">
                        Claim your free artisanal blend after completing 5 stamps.
                      </p>
                    </div>
                    <Gift className="w-8 h-8 text-amber-700 shrink-0" />
                  </div>

                  <div className="mt-5 pt-4 border-t border-amber-200/80 flex items-center justify-between">
                    <div className="font-mono text-xs font-bold tracking-wider text-neutral-900 bg-white border border-neutral-200 px-3.5 py-2 rounded-xl">
                      GRATIS1CUP
                    </div>
                    <button
                      type="button"
                      onClick={() => copyCode('GRATIS1CUP')}
                      className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer font-sans"
                    >
                      {copiedVoucher === 'GRATIS1CUP' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Voucher 1: First Order */}
              <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 shadow-xs relative overflow-hidden">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 font-sans block">
                      20% Off &bull; Welcome Gift
                    </span>
                    <h4 className="text-base font-bold text-neutral-900 mt-1 font-sans">
                      20% Off First Atelier Order
                    </h4>
                    <p className="text-xs text-neutral-500 mt-1 font-sans">
                      Apply this code during your first online checkout or table order.
                    </p>
                  </div>
                  <Ticket className="w-8 h-8 text-neutral-400 shrink-0" />
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div className="font-mono text-xs font-bold tracking-wider text-neutral-900 bg-neutral-100 px-3.5 py-2 rounded-xl">
                    CHANGKEERFIRST
                  </div>
                  <button
                    type="button"
                    onClick={() => copyCode('CHANGKEERFIRST')}
                    className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer font-sans"
                  >
                    {copiedVoucher === 'CHANGKEERFIRST' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Voucher 2: Dine-In */}
              <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 shadow-xs relative overflow-hidden">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 font-sans block">
                      15% Off &bull; Dine-In Table
                    </span>
                    <h4 className="text-base font-bold text-neutral-900 mt-1 font-sans">
                      Dine-In Table Experience
                    </h4>
                    <p className="text-xs text-neutral-500 mt-1 font-sans">
                      Enjoy 15% off on all tea brews savored directly at our atelier tables.
                    </p>
                  </div>
                  <UtensilsCrossed className="w-8 h-8 text-neutral-400 shrink-0" />
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div className="font-mono text-xs font-bold tracking-wider text-neutral-900 bg-neutral-100 px-3.5 py-2 rounded-xl">
                    CAFEDINEIN
                  </div>
                  <button
                    type="button"
                    onClick={() => copyCode('CAFEDINEIN')}
                    className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer font-sans"
                  >
                    {copiedVoucher === 'CAFEDINEIN' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: SETTING & EDIT PROFIL PELANGGAN DENGAN FITUR GANTI FOTO & BANNER */}
          {activeTab === 'card' && (
            <div className="p-6 sm:p-8 rounded-3xl border border-neutral-200/90 bg-white shadow-xs space-y-8">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                <div>
                  <h3 className="font-sans font-extrabold text-base sm:text-lg uppercase tracking-tight text-neutral-900">
                    Profile &amp; Account Settings
                  </h3>
                  <p className="text-xs text-neutral-500 font-sans mt-0.5">
                    Manage your profile photo, cover banner, identity, brewing preferences, and address.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenEditProfile}
                  className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-2xs self-start sm:self-auto"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile Details</span>
                </button>
              </div>

              {/* Photo & Banner Management Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                
                {/* Avatar Box */}
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-14 h-14 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xl overflow-hidden shrink-0 border border-neutral-200">
                      {userAvatar ? (
                        <Image src={userAvatar} alt="Avatar" fill unoptimized={isUnoptimizedImg(userAvatar)} className="object-cover" />
                      ) : (
                        <span>{profile?.full_name ? profile.full_name[0].toUpperCase() : 'C'}</span>
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-neutral-900 block text-xs">Customer Profile Photo</span>
                      <span className="text-[11px] text-neutral-500 block">Maximum 5MB (WebP/JPEG/PNG)</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={uploadingAvatar}
                    onClick={() => avatarInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl border border-neutral-300 hover:bg-white text-neutral-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <Camera className="w-3.5 h-3.5 text-neutral-600" />
                    <span>{uploadingAvatar ? '...' : 'Change'}</span>
                  </button>
                </div>

                {/* Banner Box */}
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-18 h-12 rounded-xl bg-neutral-900 text-white flex items-center justify-center text-xs overflow-hidden shrink-0 border border-neutral-200">
                      {userBanner ? (
                        <Image src={userBanner} alt="Banner" fill unoptimized={isUnoptimizedImg(userBanner)} className="object-cover" />
                      ) : (
                        <span className="text-[10px] text-neutral-400 font-mono">DEFAULT</span>
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-neutral-900 block text-xs">Account Cover Banner</span>
                      <span className="text-[11px] text-neutral-500 block">Maximum 5MB (Auto-compressed)</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={uploadingBanner}
                    onClick={() => bannerInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl border border-neutral-300 hover:bg-white text-neutral-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-neutral-600" />
                    <span>{uploadingBanner ? '...' : 'Upload'}</span>
                  </button>
                </div>

              </div>

              {/* Profile Details Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Account Identity</span>
                  <div className="font-bold text-neutral-900 text-sm">
                    {profile?.full_name}
                  </div>
                  <div className="text-neutral-600 space-y-1 text-xs">
                    <p>Email: {profile?.email}</p>
                    <p>WhatsApp: {profile?.phone_number || 'Not provided yet'}</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Default Delivery Address</span>
                  <div className="font-bold text-neutral-900 text-sm">
                    {profile?.default_address ? 'Saved Address' : 'No Address Saved'}
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {profile?.default_address || 'Add your delivery address for faster checkout.'}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Brewing Preferences</span>
                  <div className="flex items-center gap-3 pt-1">
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-xs font-semibold text-neutral-800">
                      Temp: {(profile as any)?.preferred_temperature === 'iced' ? 'Iced' : 'Hot'}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-xs font-semibold text-neutral-800">
                      Sweetness: {(profile as any)?.preferred_sweetness || '0%'}
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Tea Palate Bio</span>
                  <p className="text-xs text-neutral-600 italic leading-relaxed">
                    &ldquo;{userBio}&rdquo;
                  </p>
                </div>

              </div>

              {/* Logout & Session */}
              <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-xs text-neutral-500">
                  Want to switch accounts or sign out from this device?
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </main>

      {/* =========================================================================
          MODAL: EDIT PROFILE SYSTEM DENGAN FITUR UPLOAD FOTO & BANNER (MAKS. 5MB)
          ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-sans font-extrabold text-base uppercase tracking-tight text-neutral-900">
                    Edit Profile &amp; Photos
                  </h3>
                  <span className="text-[11px] text-neutral-500 font-sans">
                    Identity details, profile photo, and cover banner
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProfile} className="space-y-4 pt-4 text-xs font-sans">
              
              {profileSaveError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{profileSaveError}</span>
                </div>
              )}

              {profileSaveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{profileSaveSuccess}</span>
                </div>
              )}

              {uploadFeedback && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
                  {uploadingAvatar || uploadingBanner ? (
                    <RefreshCw className="w-4 h-4 shrink-0 text-emerald-600 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                  )}
                  <span>{uploadFeedback}</span>
                </div>
              )}

              {/* Upload Foto Profil & Banner Preview Row */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    Profile Photo &amp; Cover Banner (Max 5MB)
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">Auto-compression Active</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Avatar Picker */}
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-neutral-200 text-center space-y-2">
                    <div className="relative w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-base overflow-hidden border border-neutral-200">
                      {editAvatarUrl ? (
                        <Image src={editAvatarUrl} alt="Avatar" fill unoptimized={isUnoptimizedImg(editAvatarUrl)} className="object-cover" />
                      ) : (
                        <span>{editFullName ? editFullName[0].toUpperCase() : 'C'}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      disabled={uploadingAvatar}
                      onClick={() => avatarInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50"
                    >
                      <Camera className="w-3 h-3" />
                      <span>{uploadingAvatar ? 'Uploading...' : 'Change Photo'}</span>
                    </button>
                  </div>

                  {/* Banner Picker */}
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-neutral-200 text-center space-y-2">
                    <div className="relative w-full h-12 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-[10px] font-mono overflow-hidden border border-neutral-200">
                      {editBannerUrl ? (
                        <Image src={editBannerUrl} alt="Banner" fill unoptimized={isUnoptimizedImg(editBannerUrl)} className="object-cover" />
                      ) : (
                        <span className="text-neutral-400">Default Gradient</span>
                      )}
                    </div>
                    <button
                      type="button"
                      disabled={uploadingBanner}
                      onClick={() => bannerInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50"
                    >
                      <UploadCloud className="w-3 h-3" />
                      <span>{uploadingBanner ? 'Uploading...' : 'Change Cover'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 1. Nama Lengkap */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full bg-[#FAFAF8] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 font-sans"
                />
              </div>

              {/* 2. Nomor WhatsApp */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  WhatsApp / Phone Number
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="e.g. +62 812 3456 7890"
                  className="w-full bg-[#FAFAF8] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 font-sans"
                />
              </div>

              {/* 3. Alamat Default */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Default Delivery Address
                </label>
                <textarea
                  rows={2}
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  placeholder="Residential or office address for delivery..."
                  className="w-full bg-[#FAFAF8] border border-neutral-200 rounded-xl p-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 font-sans"
                />
              </div>

              {/* 4. Bio / Catatan Selera */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Tea Palate Bio / Notes
                </label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Describe your favorite flavor notes or brewing rituals..."
                  className="w-full bg-[#FAFAF8] border border-neutral-200 rounded-xl p-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 font-sans"
                />
              </div>

              {/* 5. Preferensi Seduhan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Preferred Brew Temperature
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditTemp('hot')}
                      className={`py-2 px-3 rounded-xl border text-center font-bold text-xs transition-colors cursor-pointer ${
                        editTemp === 'hot' 
                          ? 'border-neutral-900 bg-neutral-900 text-white' 
                          : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      Hot
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditTemp('iced')}
                      className={`py-2 px-3 rounded-xl border text-center font-bold text-xs transition-colors cursor-pointer ${
                        editTemp === 'iced' 
                          ? 'border-neutral-900 bg-neutral-900 text-white' 
                          : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      Iced
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Default Sweetness Level
                  </label>
                  <select
                    value={editSweetness}
                    onChange={(e) => setEditSweetness(e.target.value as any)}
                    className="w-full bg-[#FAFAF8] border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-800 focus:outline-none focus:border-neutral-900 cursor-pointer"
                  >
                    <option value="0%">0% (Unsweetened)</option>
                    <option value="25%">25% (Light Sweetness)</option>
                    <option value="50%">50% (Balanced Sweetness)</option>
                    <option value="100%">100% (Full Sweetness)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSavingProfile || uploadingAvatar || uploadingBanner}
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:scale-98 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center gap-2"
                >
                  {isSavingProfile ? <span>Saving...</span> : <span>Save Changes</span>}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Minimalist Footnote */}
      <footer className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center border-t border-neutral-200/60 mt-auto">
        <p className="text-[11px] font-sans text-neutral-400 tracking-wider uppercase font-medium">
          CHANGKEER BOTANICAL ATELIER &bull; UNSWEETENED BY DEFAULT &bull; PLASTIC-FREE
        </p>
      </footer>

      {/* Thermal Receipt Print Modal */}
      <ThermalReceiptModal
        order={selectedOrderForPrint}
        isOpen={Boolean(selectedOrderForPrint)}
        onClose={() => setSelectedOrderForPrint(null)}
      />

    </ClientLayout>
  );
}
