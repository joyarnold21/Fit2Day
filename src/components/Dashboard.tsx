import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, CATEGORY_LIMIT } from '../types';
import {
  Sparkles,
  Shirt,
  Calendar,
  Bookmark,
  Plus,
  ArrowRight,
  CheckCircle,
  Eye,
  RefreshCw,
  SlidersHorizontal,
  Camera,
} from 'lucide-react';

interface DashboardProps {
  onOpenGenerator: () => void;
  onOpenUpload: (defaultCategory?: string) => void;
  onOpenScan?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenGenerator,
  onOpenUpload,
  onOpenScan,
}) => {
  const {
    user,
    wardrobe,
    plannedOutfits,
    savedOutfits,
    setActiveTab,
    getCategoryCount,
    loadSampleWardrobe,
  } = useApp();

  const totalItems = wardrobe.length;
  const totalSaved = savedOutfits.length;
  const plannedCount = plannedOutfits.length;
  const wornThisWeek = plannedOutfits.filter((o) => o.isWorn).length;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      {/* Top Greeting & Hero Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-100/50 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Fit2Day Personal Stylist</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight font-serif">
              Welcome to Fit2Day. Let's plan your style.
            </h1>
            
            <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
              Hello, <span className="font-semibold text-zinc-900">{user?.name || 'Stylist'}</span>! You have <strong className="text-zinc-900">{totalItems}</strong> clothing pieces in your digital wardrobe ready for AI outfit curation.
            </p>
          </div>

          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {onOpenScan && (
              <button
                onClick={onOpenScan}
                className="px-5 py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-2xl text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                title="Send a photo of multiple clothes in your collection"
              >
                <Camera className="w-4 h-4 text-blue-400" />
                <span>Scan Dress Collection</span>
              </button>
            )}

            <button
              onClick={onOpenGenerator}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-white/80" />
              <span>Generate My Outfits</span>
            </button>

            <button
              onClick={() => onOpenUpload()}
              className="px-4 py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Single Piece</span>
            </button>
          </div>
        </div>

        {/* Feature Spotlight Banner: Collection Photo to Outfits */}
        {onOpenScan && (
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-950 flex items-center gap-2">
                  <span>AI Collection Photo Scanner</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-extrabold uppercase">
                    New Feature
                  </span>
                </p>
                <p className="text-xs text-zinc-600 mt-0.5">
                  Have a photo of your closet, hanging rack, or multiple clothes laid out? Send the photo and the backend AI identifies every garment and generates coordinated outfits.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenScan}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 shrink-0"
            >
              <span>Scan Collection Photo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Primary Navigation Buttons Requested in Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-zinc-100">
          <button
            onClick={onOpenGenerator}
            className="p-3.5 rounded-2xl bg-zinc-50 hover:bg-blue-50/80 border border-zinc-200/80 hover:border-blue-200 text-left transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 bg-blue-100 text-blue-700 rounded-xl group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-900">Generate My Outfits</p>
              <p className="text-[11px] text-zinc-500">1 to 14 days styling</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('wardrobe')}
            className="p-3.5 rounded-2xl bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/80 hover:border-zinc-300 text-left transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 bg-zinc-200 text-zinc-800 rounded-xl group-hover:scale-105 transition-transform">
                <Shirt className="w-4 h-4" />
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-900">My Wardrobe</p>
              <p className="text-[11px] text-zinc-500">{totalItems} items uploaded</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('planner')}
            className="p-3.5 rounded-2xl bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/80 hover:border-zinc-300 text-left transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 bg-zinc-200 text-zinc-800 rounded-xl group-hover:scale-105 transition-transform">
                <Calendar className="w-4 h-4" />
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-900">Weekly Outfit Planner</p>
              <p className="text-[11px] text-zinc-500">{plannedCount > 0 ? `${plannedCount} days planned` : 'Ready to plan'}</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className="p-3.5 rounded-2xl bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/80 hover:border-zinc-300 text-left transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 bg-zinc-200 text-zinc-800 rounded-xl group-hover:scale-105 transition-transform">
                <Bookmark className="w-4 h-4" />
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-900">Saved Outfits</p>
              <p className="text-[11px] text-zinc-500">{totalSaved} favorite looks</p>
            </div>
          </button>
        </div>
      </div>

      {/* Wardrobe Capacity & Category Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-950 font-serif">
              Your Wardrobe Breakdown
            </h2>
            <p className="text-xs text-zinc-500">
              {totalItems === 0
                ? 'Your wardrobe is currently blank. Start uploading your clothes below!'
                : `Up to 30 items allowed per category. Total: ${totalItems} items.`}
            </p>
          </div>
        </div>

        {totalItems === 0 && (
          <div className="p-6 bg-white rounded-3xl border border-dashed border-zinc-300 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Shirt className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-zinc-950 font-serif">
              Your Wardrobe is Blank
            </h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
              Upload photos of the clothes you own, or take a picture of your closet collection. The AI will categorize them and start building your outfits.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onOpenUpload()}
                className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Single Item</span>
              </button>

              {onOpenScan && (
                <button
                  onClick={onOpenScan}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Scan Dress Collection Photo</span>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => {
            const count = getCategoryCount(cat.key);
            const percentage = Math.min(Math.round((count / CATEGORY_LIMIT) * 100), 100);
            const isFull = count >= CATEGORY_LIMIT;

            return (
              <div
                key={cat.key}
                className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:border-zinc-300 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-zinc-900">{cat.label}</span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        isFull
                          ? 'bg-amber-100 text-amber-800'
                          : count > 0
                          ? 'bg-zinc-100 text-zinc-800'
                          : 'bg-zinc-50 text-zinc-400'
                      }`}
                    >
                      {count} / {CATEGORY_LIMIT}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-500 line-clamp-1 mb-3">
                    {cat.examples}
                  </p>

                  {/* Progress bar */}
                  <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden mb-4">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFull ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
                  <button
                    onClick={() => {
                      setActiveTab('wardrobe');
                    }}
                    className="flex-1 py-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 rounded-lg transition text-center"
                  >
                    View Items
                  </button>
                  <button
                    onClick={() => onOpenUpload(cat.key)}
                    disabled={isFull}
                    className="p-1.5 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-30 disabled:hover:bg-transparent"
                    title={isFull ? 'Category Limit Reached (30 max)' : `Add ${cat.singular}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Outfit Planner Quick View */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                <Calendar className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold text-zinc-950 font-serif">
                Your Style, Planned.
              </h2>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              {plannedCount > 0
                ? `${plannedCount} outfits ready. ${wornThisWeek} worn so far.`
                : 'No active plan yet. Generate your personalized outfit schedule in seconds.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {plannedCount > 0 ? (
              <>
                <button
                  onClick={() => setActiveTab('planner')}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Full Planner</span>
                </button>
                <button
                  onClick={onOpenGenerator}
                  className="px-3.5 py-2 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Regenerate Plan</span>
                </button>
              </>
            ) : (
              <button
                onClick={onOpenGenerator}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create 7-Day Style Plan</span>
              </button>
            )}
          </div>
        </div>

        {/* Outfit Snippet Cards */}
        {plannedCount > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {plannedOutfits.slice(0, 4).map((outfit) => {
              const top = wardrobe.find((w) => w.id === outfit.topId);
              const bottom = wardrobe.find((w) => w.id === outfit.bottomId);
              const shoes = wardrobe.find((w) => w.id === outfit.shoesId);
              const acc = wardrobe.find((w) => w.id === outfit.accessoryId);

              return (
                <div
                  key={outfit.dayIndex}
                  className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200/80 hover:border-zinc-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-zinc-900">
                        {outfit.dayName}
                      </span>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-white border border-zinc-200 text-zinc-700">
                        {outfit.styleCategory}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-zinc-800 line-clamp-1 mb-3">
                      {outfit.outfitName}
                    </p>

                    {/* Visual collage thumbnail grid */}
                    <div className="grid grid-cols-4 gap-1.5 mb-3 bg-white p-2 rounded-xl border border-zinc-200">
                      <div className="aspect-square rounded-lg overflow-hidden bg-zinc-100" title={top?.name || 'Top'}>
                        {top?.imageUrl ? (
                          <img src={top.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400">Top</div>
                        )}
                      </div>
                      <div className="aspect-square rounded-lg overflow-hidden bg-zinc-100" title={bottom?.name || 'Bottom'}>
                        {bottom?.imageUrl ? (
                          <img src={bottom.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400">Pants</div>
                        )}
                      </div>
                      <div className="aspect-square rounded-lg overflow-hidden bg-zinc-100" title={shoes?.name || 'Shoes'}>
                        {shoes?.imageUrl ? (
                          <img src={shoes.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400">Shoes</div>
                        )}
                      </div>
                      <div className="aspect-square rounded-lg overflow-hidden bg-zinc-100" title={acc?.name || 'Accessory'}>
                        {acc?.imageUrl ? (
                          <img src={acc.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400">Watch</div>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-500 line-clamp-2 italic">
                      "{outfit.stylingReason}"
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-200 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-zinc-500">
                      {outfit.isWorn ? '✓ Worn today' : 'Scheduled'}
                    </span>
                    <button
                      onClick={() => setActiveTab('planner')}
                      className="font-bold text-blue-600 hover:text-blue-800 text-[11px]"
                    >
                      View Day →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 px-4 rounded-2xl bg-zinc-50/60 border border-dashed border-zinc-300">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 mb-1">
              Ready to generate your first outfit schedule?
            </h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto mb-5 leading-relaxed">
              Select 1, 3, 5, 7, or custom days and pick your vibe (Formal, Casual, Streetwear, or Mixed). Our AI will coordinate pieces without repeating items unnecessarily.
            </p>
            <button
              onClick={onOpenGenerator}
              className="px-6 py-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-98"
            >
              Generate My Outfits Now
            </button>
          </div>
        )}
      </div>

      {/* Style Advisory & Wardrobe Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Color Coordination Rule
            </h3>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Keep 60% of your look in neutral tones (Navy, Charcoal, Khaki, White), 30% in secondary harmonizing tones, and 10% in an accent or watch detail.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Rotation & Longevity
            </h3>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Mark outfits as worn to automatically track item rotation. Fit2Day ensures you get maximum wear out of every piece you own.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-purple-600"></span>
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Gemini Vision AI
            </h3>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Upload new clothing items anytime from your phone or desktop. Our AI vision instantly tags colors, patterns, and style occasions.
          </p>
        </div>
      </div>
    </div>
  );
};
