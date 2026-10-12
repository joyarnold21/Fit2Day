import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StylePreference } from '../types';
import {
  User,
  ShieldCheck,
  Settings,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  LogOut,
  Mail,
  Phone,
  Sparkles,
  AlertTriangle,
  Check,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    user,
    wardrobe,
    savedOutfits,
    updateProfile,
    deleteAccount,
    logout,
    loadSampleWardrobe,
    clearWardrobe,
    showToast,
  } = useApp();

  const [name, setName] = useState(user?.name || '');
  const [preferredStyle, setPreferredStyle] = useState<StylePreference>(
    user?.preferredStyle || 'Mixed styles'
  );
  const [favoriteColorsInput, setFavoriteColorsInput] = useState(
    user?.favoriteColors?.join(', ') || 'Navy Blue, White, Charcoal Grey, Olive Green'
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const colors = favoriteColorsInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    updateProfile({
      name: name.trim() || user?.name,
      preferredStyle,
      favoriteColors: colors,
    });
  };

  const handleExportData = () => {
    const data = {
      user,
      wardrobe,
      savedOutfits,
      exportedAt: new Date().toISOString(),
      app: 'Fit2Day',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fit2day-wardrobe-backup-${user?.id || 'user'}.json`;
    a.click();
    showToast('Wardrobe data exported to JSON!', 'success');
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        'Warning: This will permanently delete your account, uploaded wardrobe items, and saved outfits. This action cannot be undone. Proceed?'
      )
    ) {
      deleteAccount();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-in fade-in duration-200">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <div className="relative">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-zinc-100"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-zinc-950 text-white text-3xl font-bold flex items-center justify-center">
              {user?.name.charAt(0) || 'U'}
            </div>
          )}
          <span className="absolute bottom-1 right-1 p-1 bg-emerald-500 rounded-full border-2 border-white" />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-bold text-zinc-950 font-serif">
              {user?.name}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-700 capitalize">
              {user?.authProvider} Account
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-zinc-500 pt-1">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              {user?.email}
            </span>
            {user?.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                {user.phone}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Account Preferences Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-zinc-100">
          <Settings className="w-5 h-5 text-zinc-800" />
          <h2 className="text-lg font-bold text-zinc-950 font-serif">
            Style & Account Preferences
          </h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                Default Style Preference
              </label>
              <select
                value={preferredStyle}
                onChange={(e) => setPreferredStyle(e.target.value as StylePreference)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
              >
                <option value="Mixed styles">Mixed Styles (Smart & Versatile)</option>
                <option value="Formal">Formal (Sharp & Tailored)</option>
                <option value="Casual">Casual (Clean & Relaxed)</option>
                <option value="Streetwear">Streetwear (Modern & Statement)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-800 mb-1.5">
              Favorite Wardrobe Colors (Comma-separated)
            </label>
            <input
              type="text"
              value={favoriteColorsInput}
              onChange={(e) => setFavoriteColorsInput(e.target.value)}
              placeholder="e.g. Navy Blue, White, Charcoal Grey, Olive Green"
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
            />
            <p className="text-[11px] text-zinc-400 mt-1">
              Gemini AI prioritizes these tones when designing your weekly color harmonies.
            </p>
          </div>

          <div className="pt-2 text-right">
            <button
              type="submit"
              className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 ml-auto"
            >
              <Check className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>

      {/* Wardrobe Storage & Isolation */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-zinc-950 font-serif">
              Data Storage & Privacy Isolation
            </h2>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            Private & Encrypted
          </span>
        </div>

        <p className="text-xs text-zinc-600 leading-relaxed">
          Your uploaded wardrobe images, tags, and saved outfits are strictly tied to your account (<code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">{user?.id}</code>). Other users cannot view or access your clothing.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200">
            <p className="text-lg font-bold text-zinc-950">{wardrobe.length}</p>
            <p className="text-[11px] text-zinc-500">Clothing Items</p>
          </div>
          <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200">
            <p className="text-lg font-bold text-zinc-950">{savedOutfits.length}</p>
            <p className="text-[11px] text-zinc-500">Saved Looks</p>
          </div>
          <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200">
            <p className="text-lg font-bold text-zinc-950">120 Max</p>
            <p className="text-[11px] text-zinc-500">Total Capacity</p>
          </div>
          <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200">
            <p className="text-lg font-bold text-zinc-950">100%</p>
            <p className="text-[11px] text-zinc-500">Isolated Storage</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportData}
            className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Wardrobe Backup (JSON)</span>
          </button>

          <button
            onClick={loadSampleWardrobe}
            className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset to Starter Wardrobe</span>
          </button>

          <button
            onClick={clearWardrobe}
            className="px-4 py-2.5 border border-zinc-200 hover:bg-red-50 hover:text-red-700 text-zinc-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Items</span>
          </button>
        </div>
      </div>

      {/* Danger Zone: Delete Account */}
      <div className="bg-red-50/50 rounded-3xl p-6 sm:p-8 border border-red-200 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-bold text-red-950 font-serif">
            Danger Zone
          </h2>
        </div>

        <p className="text-xs text-red-900 leading-relaxed">
          Permanently delete your user account, uploaded wardrobe photos, and saved outfits. This action is irreversible.
        </p>

        <button
          onClick={handleDeleteAccount}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Permanently Delete Account</span>
        </button>
      </div>
    </div>
  );
};
