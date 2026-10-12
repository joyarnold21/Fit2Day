import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import {
  Sparkles,
  Shirt,
  Calendar,
  Bookmark,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  PlusCircle,
  Camera,
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenGenerator: () => void;
  onOpenUpload: () => void;
  onOpenScan?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenGenerator,
  onOpenUpload,
  onOpenScan,
}) => {
  const { user, activeTab, setActiveTab, logout, wardrobe } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  interface NavItem {
    id: typeof activeTab;
    label: string;
    badge?: number;
    icon?: any;
  }

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'wardrobe', label: 'My Wardrobe', badge: wardrobe.length, icon: Shirt },
    { id: 'planner', label: 'Outfit Planner', icon: Calendar },
    { id: 'saved', label: 'Saved Outfits', icon: Bookmark },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleNav = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo */}
          <div
            className="cursor-pointer"
            onClick={() => handleNav('dashboard')}
          >
            <Logo size="md" />
          </div>

          {/* Desktop Navigation */}
          {user ? (
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`relative px-3.5 py-2 text-sm font-medium rounded-xl transition-all flex items-center gap-2 ${
                      isActive
                        ? 'text-zinc-950 bg-zinc-100 font-semibold shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                    }`}
                  >
                    {item.label}
                    {item.badge !== undefined && (
                      <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          ) : (
            <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-600">
              <button
                onClick={() => handleNav('dashboard')}
                className="hover:text-zinc-900 font-medium"
              >
                Features
              </button>
              <button
                onClick={onOpenAuth}
                className="hover:text-zinc-900 font-medium"
              >
                How It Works
              </button>
              <button
                onClick={onOpenAuth}
                className="hover:text-zinc-900 font-medium"
              >
                Stylist Demo
              </button>
            </nav>
          )}

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <>
                {onOpenScan && (
                  <button
                    onClick={onOpenScan}
                    className="px-3 py-2 text-xs font-semibold rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 transition-all flex items-center gap-1.5"
                    title="Send a photo of multiple clothes or your closet"
                  >
                    <Camera className="w-3.5 h-3.5 text-blue-600" />
                    <span>Scan Collection</span>
                  </button>
                )}

                <button
                  onClick={onOpenUpload}
                  className="px-3 py-2 text-xs font-semibold rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all flex items-center gap-1.5"
                  title="Upload item to wardrobe"
                >
                  <PlusCircle className="w-4 h-4 text-zinc-500" />
                  <span>Add Item</span>
                </button>

                <button
                  onClick={onOpenGenerator}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30 transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-white/80" />
                  <span>Generate Outfits</span>
                </button>

                <div className="h-6 w-px bg-zinc-200 mx-1" />

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleNav('profile')}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-zinc-100 transition-all"
                    title={user.name}
                  >
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-zinc-900 text-white text-xs font-bold flex items-center justify-center">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </button>

                  <button
                    onClick={logout}
                    className="p-2 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={onOpenAuth}
                  className="px-4 py-2 text-xs font-bold text-zinc-800 hover:text-zinc-950 rounded-xl hover:bg-zinc-100 transition-all"
                >
                  Log In
                </button>
                <button
                  onClick={onOpenAuth}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white shadow-sm transition-all flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Get Started</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <button
                onClick={onOpenGenerator}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 text-white flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>AI Style</span>
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-700 hover:text-zinc-950 rounded-lg hover:bg-zinc-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 bg-white px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-150">
          {user ? (
            <>
              <div className="flex items-center gap-3 px-3 py-2 border-b border-zinc-100 mb-2">
                <div className="w-9 h-9 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center text-sm">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{user.name}</p>
                  <p className="text-xs text-zinc-500">{user.email}</p>
                </div>
              </div>

              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                    activeTab === item.id
                      ? 'bg-zinc-100 text-zinc-950 font-semibold'
                      : 'text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="text-xs bg-zinc-200 px-2 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}

              <div className="pt-3 border-t border-zinc-100 space-y-2">
                {onOpenScan && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenScan();
                    }}
                    className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 flex items-center justify-center gap-2 border border-zinc-200"
                  >
                    <Camera className="w-4 h-4 text-blue-600" />
                    Scan Clothes Collection Photo
                  </button>
                )}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenUpload();
                  }}
                  className="w-full py-2.5 px-4 text-xs font-bold rounded-xl border border-zinc-200 text-zinc-800 flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Wardrobe Item
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenGenerator();
                  }}
                  className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-blue-600 text-white flex items-center justify-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Outfits
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-2 text-xs font-medium text-red-600 flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-3 pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 text-sm font-bold text-white bg-zinc-950 rounded-xl"
              >
                Log In / Get Started
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
