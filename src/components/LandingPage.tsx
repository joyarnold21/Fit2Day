import React from 'react';
import { Logo } from './Logo';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Camera,
  Shirt,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogIn: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onLogIn,
}) => {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-zinc-900 flex flex-col justify-between">
      {/* Top Banner */}
      <div className="bg-zinc-900 text-zinc-300 py-2 px-4 text-center text-xs font-medium tracking-wide">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>New: Fit2Day Vision AI now auto-identifies your clothing categories & colors</span>
        </span>
      </div>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Logo badge */}
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-white shadow-xs border border-zinc-200/80 mb-2">
            <Logo size="lg" />
          </div>

          <div className="inline-block px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold tracking-wide uppercase">
            Your Clothes. Your Style. Every Day.
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-950 leading-[1.1] font-serif">
            Never Wonder What <br className="hidden sm:inline" />
            to Wear Again.
          </h1>

          <p className="text-lg sm:text-xl text-zinc-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Build your perfect outfits from the wardrobe you already own. Fit2Day analyzes your shirts, pants, shoes, and timepieces to generate flawless daily looks.
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-zinc-950 hover:bg-zinc-800 text-white rounded-2xl text-base font-bold shadow-lg shadow-zinc-950/15 hover:shadow-xl hover:shadow-zinc-950/25 transition-all flex items-center justify-center gap-2.5 active:scale-98 group cursor-pointer"
            >
              <Shirt className="w-5 h-5 text-zinc-300" />
              <span>Build My Wardrobe</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onLogIn}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-2xl text-base font-semibold text-zinc-800 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Log In</span>
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 pt-6 text-xs text-zinc-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Zero Shopping Ads
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Upload Real Photos
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Powered by Gemini 3.8
            </span>
          </div>
        </div>

        {/* Visual Lookbook Showcase Card */}
        <div className="mt-14 max-w-5xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-zinc-200/80">
          <div className="flex flex-col md:flex-row items-center justify-between pb-6 mb-6 border-b border-zinc-100 gap-4">
            <div>
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
                AI Coordination Engine
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mt-0.5">
                Curated From Your Existing Pieces
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-zinc-100 rounded-full text-xs font-semibold text-zinc-700">
                Formal
              </span>
              <span className="px-3 py-1 bg-zinc-100 rounded-full text-xs font-semibold text-zinc-700">
                Casual
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                Streetwear
              </span>
            </div>
          </div>

          {/* Interactive Flat-Lay Preview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="group relative rounded-2xl bg-zinc-50 border border-zinc-200 p-3 hover:border-zinc-400 transition-all">
              <div className="aspect-square rounded-xl overflow-hidden bg-zinc-100 mb-2.5">
                <img
                  src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&q=80"
                  alt="Oxford Shirt"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Top</span>
              <p className="text-xs font-bold text-zinc-900 truncate">Crisp White Oxford</p>
              <p className="text-[11px] text-zinc-500">100% Cotton</p>
            </div>

            <div className="group relative rounded-2xl bg-zinc-50 border border-zinc-200 p-3 hover:border-zinc-400 transition-all">
              <div className="aspect-square rounded-xl overflow-hidden bg-zinc-100 mb-2.5">
                <img
                  src="https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=500&q=80"
                  alt="Dress Trousers"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Bottom</span>
              <p className="text-xs font-bold text-zinc-900 truncate">Charcoal Pleated Pants</p>
              <p className="text-[11px] text-zinc-500">Tailored Taper</p>
            </div>

            <div className="group relative rounded-2xl bg-zinc-50 border border-zinc-200 p-3 hover:border-zinc-400 transition-all">
              <div className="aspect-square rounded-xl overflow-hidden bg-zinc-100 mb-2.5">
                <img
                  src="https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=500&q=80"
                  alt="Black Derbies"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Shoes</span>
              <p className="text-xs font-bold text-zinc-900 truncate">Black Leather Derbies</p>
              <p className="text-[11px] text-zinc-500">Goodyear Welt</p>
            </div>

            <div className="group relative rounded-2xl bg-zinc-50 border border-zinc-200 p-3 hover:border-zinc-400 transition-all">
              <div className="aspect-square rounded-xl overflow-hidden bg-zinc-100 mb-2.5">
                <img
                  src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=500&q=80"
                  alt="Chronograph"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Accessory</span>
              <p className="text-xs font-bold text-zinc-900 truncate">Silver Chronograph</p>
              <p className="text-[11px] text-zinc-500">Brushed Steel</p>
            </div>
          </div>

          {/* AI Reasoning pill */}
          <div className="mt-6 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-600 text-white rounded-xl">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-zinc-900">AI Coordination Reason:</p>
                <p className="text-zinc-600">High-contrast monochrome look anchored by sharp charcoal wool and lustrous calfskin leather.</p>
              </div>
            </div>
            <button
              onClick={onGetStarted}
              className="px-3.5 py-2 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-xl font-bold text-zinc-800 shrink-0"
            >
              Try With Your Clothes →
            </button>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="bg-white border-y border-zinc-200/80 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 font-serif">
              Fashion Intelligence Built for Real Closets
            </h2>
            <p className="text-zinc-500 text-sm mt-2">
              Everything you need to look your best every morning without buying a single new item.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">
                Snap & AI Vision Tagging
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Take photos of your clothes. Gemini AI automatically classifies your tops, pants, shoes, and accessories, recognizing dominant colors, fabrics, and patterns.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mb-5">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">
                Multi-Day Outfit Planning
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Generate 1, 3, 5, 7, or custom days of coordinated looks. The algorithm guarantees rotation, avoids clashing colors, and honors your style occasion.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">
                Occasions: Formal, Casual & Streetwear
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Target high-stakes boardrooms, relaxed weekend cafes, or elevated street style. Regenerate, swap, or lock favorite pieces in 1 click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-zinc-200 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p>© {new Date().getFullYear()} Fit2Day. Your Clothes. Your Style. Every Day.</p>
          <div className="flex gap-4">
            <button onClick={onLogIn} className="hover:text-zinc-900">Sign In</button>
            <button onClick={onGetStarted} className="hover:text-zinc-900">Demo Wardrobe</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
