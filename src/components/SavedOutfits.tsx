import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Occasion } from '../types';
import {
  Bookmark,
  Sparkles,
  Trash2,
  Calendar,
  CheckCircle,
  Tag,
  ArrowRight,
} from 'lucide-react';

interface SavedOutfitsProps {
  onOpenGenerator: () => void;
}

export const SavedOutfits: React.FC<SavedOutfitsProps> = ({ onOpenGenerator }) => {
  const { savedOutfits, wardrobe, deleteSavedOutfit, setActiveTab } = useApp();
  const [filterStyle, setFilterStyle] = useState<'All' | Occasion>('All');

  const filtered = savedOutfits.filter((outfit) => {
    if (filterStyle !== 'All' && outfit.styleCategory !== filterStyle) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Bookmark className="w-3.5 h-3.5 text-blue-600" />
            <span>Curated Style Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight font-serif">
            Saved Outfits
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Your personal lookbook of favorite combinations saved from the weekly planner.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['All', 'Formal', 'Casual', 'Streetwear'] as const).map((style) => (
            <button
              key={style}
              onClick={() => setFilterStyle(style)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all ${
                filterStyle === style
                  ? 'bg-zinc-950 border-zinc-950 text-white shadow-xs'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Saved Outfits */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((outfit) => {
            const top = wardrobe.find((w) => w.id === outfit.topId);
            const bottom = wardrobe.find((w) => w.id === outfit.bottomId);
            const shoes = wardrobe.find((w) => w.id === outfit.shoesId);
            const acc = wardrobe.find((w) => w.id === outfit.accessoryId);

            return (
              <div
                key={outfit.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-zinc-200/80 hover:border-zinc-300 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800">
                      {outfit.styleCategory}
                    </span>
                    <button
                      onClick={() => deleteSavedOutfit(outfit.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg transition"
                      title="Delete from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-zinc-950 mb-3">
                    {outfit.name}
                  </h3>

                  {/* Collage */}
                  <div className="grid grid-cols-2 gap-2 bg-zinc-50 p-2.5 rounded-2xl border border-zinc-200/80 mb-3">
                    <div className="rounded-xl overflow-hidden bg-white p-2 border border-zinc-200/80">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase block mb-1">Top</span>
                      <div className="aspect-square rounded-lg overflow-hidden bg-zinc-100 mb-1">
                        {top ? (
                          <img src={top.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400">Empty</div>
                        )}
                      </div>
                      <p className="text-[10px] font-bold text-zinc-900 truncate">{top?.name || 'Top'}</p>
                    </div>

                    <div className="rounded-xl overflow-hidden bg-white p-2 border border-zinc-200/80">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase block mb-1">Pants</span>
                      <div className="aspect-square rounded-lg overflow-hidden bg-zinc-100 mb-1">
                        {bottom ? (
                          <img src={bottom.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400">Empty</div>
                        )}
                      </div>
                      <p className="text-[10px] font-bold text-zinc-900 truncate">{bottom?.name || 'Pants'}</p>
                    </div>

                    <div className="rounded-xl overflow-hidden bg-white p-2 border border-zinc-200/80">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase block mb-1">Shoes</span>
                      <div className="aspect-square rounded-lg overflow-hidden bg-zinc-100 mb-1">
                        {shoes ? (
                          <img src={shoes.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400">Empty</div>
                        )}
                      </div>
                      <p className="text-[10px] font-bold text-zinc-900 truncate">{shoes?.name || 'Shoes'}</p>
                    </div>

                    <div className="rounded-xl overflow-hidden bg-white p-2 border border-zinc-200/80">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase block mb-1">Accessory</span>
                      <div className="aspect-square rounded-lg overflow-hidden bg-zinc-100 mb-1">
                        {acc ? (
                          <img src={acc.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400">None</div>
                        )}
                      </div>
                      <p className="text-[10px] font-bold text-zinc-900 truncate">{acc?.name || 'Watch'}</p>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 italic">
                    "{outfit.stylingReason || outfit.coordinationExplanation}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
                  <span>Saved on {new Date(outfit.createdAt).toLocaleDateString()}</span>
                  <button
                    onClick={() => setActiveTab('planner')}
                    className="font-bold text-blue-600 hover:text-blue-800"
                  >
                    Go to Planner →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 px-4 bg-white rounded-3xl border border-dashed border-zinc-300">
          <div className="w-14 h-14 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900 mb-1 font-serif">
            No Outfits Saved Yet
          </h2>
          <p className="text-xs text-zinc-500 max-w-md mx-auto mb-6 leading-relaxed">
            When you generate a weekly style schedule, click the bookmark icon on any day's card to permanently save that combination here.
          </p>
          <button
            onClick={onOpenGenerator}
            className="px-6 py-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold"
          >
            Generate Outfits Now
          </button>
        </div>
      )}
    </div>
  );
};
