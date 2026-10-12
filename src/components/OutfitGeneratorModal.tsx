import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StylePreference, PlannedOutfit } from '../types';
import {
  X,
  Sparkles,
  Calendar,
  Layers,
  CloudSun,
  Palette,
  Check,
  AlertCircle,
  Loader2,
  Lock,
} from 'lucide-react';

interface OutfitGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WEATHER_OPTIONS = [
  'Sunny & Warm (70°F+)',
  'Mild & Crisp (55-68°F)',
  'Breezy / Layering Weather',
  'Cool & Rainy',
  'Winter Cold (Cozy & Layered)',
];

const OCCASION_FOCUS = [
  'Everyday Versatile',
  'Office & Client Meetings',
  'Casual Weekday / Work From Home',
  'Weekend Social & Dinners',
  'Creative / Elevated Night Out',
];

export const OutfitGeneratorModal: React.FC<OutfitGeneratorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { wardrobe, setPlannedOutfits, setActiveTab, showToast, isGenerating, setIsGenerating } = useApp();

  // Days selection
  const [daySelection, setDaySelection] = useState<'1' | '3' | '5' | '7' | 'custom'>('7');
  const [customDays, setCustomDays] = useState(4);

  // Style Preference
  const [stylePreference, setStylePreference] = useState<StylePreference>('Mixed styles');

  // Optional Preferences
  const [weatherSeason, setWeatherSeason] = useState(WEATHER_OPTIONS[1]);
  const [occasionFocus, setOccasionFocus] = useState(OCCASION_FOCUS[0]);
  const [selectedFavoriteColors, setSelectedFavoriteColors] = useState<string[]>([]);
  const [preferredItemIds, setPreferredItemIds] = useState<string[]>([]);

  // Generation status
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const resolvedDays = daySelection === 'custom' ? Math.min(Math.max(customDays, 1), 14) : parseInt(daySelection, 10);

  // Check wardrobe inventory
  const tops = wardrobe.filter((w) => w.category === 'Shirts and Tops');
  const bottoms = wardrobe.filter((w) => w.category === 'Pants and Trousers');
  const shoes = wardrobe.filter((w) => w.category === 'Shoes');
  const accessories = wardrobe.filter((w) => w.category === 'Watches and Accessories');

  const handleToggleColor = (color: string) => {
    if (selectedFavoriteColors.includes(color)) {
      setSelectedFavoriteColors((prev) => prev.filter((c) => c !== color));
    } else {
      setSelectedFavoriteColors((prev) => [...prev, color]);
    }
  };

  const handleTogglePreferredItem = (id: string) => {
    if (preferredItemIds.includes(id)) {
      setPreferredItemIds((prev) => prev.filter((i) => i !== id));
    } else {
      setPreferredItemIds((prev) => [...prev, id]);
    }
  };

  const handleGenerate = async () => {
    if (wardrobe.length === 0) {
      setErrorMsg('Your wardrobe is currently empty. Please upload some clothes or load the sample wardrobe first.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/generate-outfits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wardrobeItems: wardrobe,
          days: resolvedDays,
          stylePreference,
          preferences: {
            weatherSeason,
            occasionFocus,
            favoriteColors: selectedFavoriteColors,
            preferredItems: preferredItemIds,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reach AI styling service.');
      }

      const data = await response.json();
      if (!Array.isArray(data.outfits) || data.outfits.length === 0) {
        throw new Error('AI could not produce outfits with current constraints.');
      }

      // Add client-side state flags (isWorn, isSaved, lockedSlots)
      const mappedOutfits: PlannedOutfit[] = data.outfits.map((outfit: any, idx: number) => ({
        ...outfit,
        dayIndex: idx + 1,
        isWorn: false,
        isSaved: false,
        lockedSlots: {},
      }));

      setPlannedOutfits(mappedOutfits);
      showToast(`Generated ${mappedOutfits.length} curated outfits for your week!`, 'success');
      onClose();
      setActiveTab('planner');
    } catch (err: any) {
      console.error('Outfit generation error:', err);
      setErrorMsg(err?.message || 'Error occurred while generating outfits. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-100 my-8 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold text-zinc-950 font-serif">
                AI Outfit Generator
              </h2>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Powered by Gemini. Analyzes only the real clothes in your wardrobe.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="overflow-y-auto py-4 space-y-6 flex-1 pr-1">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Inventory Health Check */}
          <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200/80 flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-700">Wardrobe Pieces:</span>
            <div className="flex items-center gap-3 text-zinc-600">
              <span className={tops.length === 0 ? 'text-amber-600 font-bold' : ''}>
                {tops.length} Tops
              </span>
              <span className={bottoms.length === 0 ? 'text-amber-600 font-bold' : ''}>
                {bottoms.length} Pants
              </span>
              <span className={shoes.length === 0 ? 'text-amber-600 font-bold' : ''}>
                {shoes.length} Shoes
              </span>
              <span>{accessories.length} Accessories</span>
            </div>
          </div>

          {/* 1. Number of Days */}
          <div>
            <label className="block text-xs font-bold text-zinc-900 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>1. Number of Days</span>
            </label>

            <div className="grid grid-cols-5 gap-2">
              {(['1', '3', '5', '7', 'custom'] as const).map((daysVal) => {
                const isSelected = daySelection === daysVal;
                return (
                  <button
                    key={daysVal}
                    type="button"
                    onClick={() => setDaySelection(daysVal)}
                    className={`py-3 px-2 rounded-xl text-center border transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 text-blue-950 font-bold shadow-xs'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
                    }`}
                  >
                    <p className="text-xs">
                      {daysVal === 'custom' ? 'Custom' : `${daysVal} Day${daysVal === '1' ? '' : 's'}`}
                    </p>
                  </button>
                );
              })}
            </div>

            {daySelection === 'custom' && (
              <div className="mt-3 p-3 bg-blue-50/60 rounded-xl border border-blue-200/70 flex items-center justify-between text-xs">
                <span className="font-semibold text-blue-900">
                  Select Custom Days (1 to 14 days):
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="14"
                    value={customDays}
                    onChange={(e) => setCustomDays(parseInt(e.target.value, 10))}
                    className="w-32 accent-blue-600 cursor-pointer"
                  />
                  <span className="font-bold text-blue-950 w-8 text-right">
                    {customDays} days
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 2. Style Preference */}
          <div>
            <label className="block text-xs font-bold text-zinc-900 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>2. Style Preference</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Formal', 'Casual', 'Streetwear', 'Mixed styles'] as StylePreference[]).map((style) => {
                const isSelected = stylePreference === style;
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setStylePreference(style)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'border-zinc-950 bg-zinc-950 text-white font-bold shadow-xs'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
                    }`}
                  >
                    <p className="text-xs">{style}</p>
                    <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-zinc-300' : 'text-zinc-400'}`}>
                      {style === 'Formal' && 'Tailored, sharp'}
                      {style === 'Casual' && 'Effortless, clean'}
                      {style === 'Streetwear' && 'Relaxed, statement'}
                      {style === 'Mixed styles' && 'Balanced variety'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Weather / Season */}
          <div>
            <label className="block text-xs font-bold text-zinc-900 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
              <CloudSun className="w-4 h-4 text-blue-600" />
              <span>3. Weather or Season</span>
            </label>
            <select
              value={weatherSeason}
              onChange={(e) => setWeatherSeason(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
            >
              {WEATHER_OPTIONS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Occasion Focus */}
          <div>
            <label className="block text-xs font-bold text-zinc-900 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
              <Check className="w-4 h-4 text-blue-600" />
              <span>4. Target Occasion Focus</span>
            </label>
            <select
              value={occasionFocus}
              onChange={(e) => setOccasionFocus(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
            >
              {OCCASION_FOCUS.map((occ) => (
                <option key={occ} value={occ}>
                  {occ}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Prioritize Specific Clothing Items */}
          {wardrobe.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-zinc-900 mb-2 uppercase tracking-wider">
                5. Prefer Specific Items (Optional)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-2 bg-zinc-50 rounded-xl border border-zinc-200">
                {wardrobe.slice(0, 9).map((item) => {
                  const isChecked = preferredItemIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleTogglePreferredItem(item.id)}
                      className={`flex items-center gap-2 p-1.5 rounded-lg border text-left transition ${
                        isChecked
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                          : 'border-zinc-200 bg-white text-zinc-700'
                      }`}
                    >
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="w-7 h-7 rounded-md object-cover shrink-0"
                      />
                      <span className="text-[11px] truncate">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="px-4 py-2.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition"
          >
            Cancel
          </button>

          {/* Prominent Button Labeled "Generate My Outfits" */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || wardrobe.length === 0}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 transition active:scale-98 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>AI Curating {resolvedDays} Days...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-white/80" />
                <span>Generate My Outfits</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
