import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlannedOutfit, WardrobeItem, Occasion } from '../types';
import { ReplaceItemModal } from './ReplaceItemModal';
import {
  Calendar,
  Sparkles,
  RefreshCw,
  Lock,
  Unlock,
  CheckCircle2,
  Bookmark,
  Share2,
  ChevronLeft,
  ChevronRight,
  Plus,
  AlertCircle,
  HelpCircle,
  Layers,
  Shuffle,
  Printer,
  SlidersHorizontal,
} from 'lucide-react';

interface OutfitPlannerProps {
  onOpenGenerator: () => void;
  onOpenUpload: () => void;
}

export const OutfitPlanner: React.FC<OutfitPlannerProps> = ({
  onOpenGenerator,
  onOpenUpload,
}) => {
  const {
    wardrobe,
    plannedOutfits,
    updateOutfit,
    markOutfitWorn,
    saveOutfit,
    toggleLockSlot,
    swapOutfitDays,
    showToast,
  } = useApp();

  // Replacement modal state
  const [replacingSlot, setReplacingSlot] = useState<{
    dayIndex: number;
    dayName: string;
    slot: 'top' | 'bottom' | 'shoes' | 'accessory';
    currentId: string | null;
  } | null>(null);

  // Drag and drop state for day cards
  const [draggedDayIndex, setDraggedDayIndex] = useState<number | null>(null);
  const [draggedItemDrawerId, setDraggedItemDrawerId] = useState<string | null>(null);

  // Drawer filter
  const [drawerCategory, setDrawerCategory] = useState<string>('All');
  const [isRegeneratingDay, setIsRegeneratingDay] = useState<number | null>(null);

  // Regenerate a single day
  const handleRegenerateDay = async (dayIndex: number) => {
    const outfit = plannedOutfits.find((o) => o.dayIndex === dayIndex);
    if (!outfit) return;

    setIsRegeneratingDay(dayIndex);
    try {
      const locked = outfit.lockedSlots || {};
      const otherDayIds = plannedOutfits
        .filter((o) => o.dayIndex !== dayIndex)
        .flatMap((o) => [o.topId, o.bottomId, o.shoesId, o.accessoryId])
        .filter(Boolean) as string[];

      const res = await fetch('/api/regenerate-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayIndex,
          dayName: outfit.dayName,
          wardrobeItems: wardrobe,
          stylePreference: outfit.styleCategory,
          otherDayItemIds: otherDayIds,
          lockedTopId: locked.top ? outfit.topId : null,
          lockedBottomId: locked.bottom ? outfit.bottomId : null,
          lockedShoesId: locked.shoes ? outfit.shoesId : null,
          lockedAccessoryId: locked.accessory ? outfit.accessoryId : null,
        }),
      });

      if (!res.ok) throw new Error('Regeneration failed.');

      const data = await res.json();
      if (data.outfit) {
        updateOutfit(dayIndex, {
          outfitName: data.outfit.outfitName,
          styleCategory: data.outfit.styleCategory,
          topId: data.outfit.topId,
          bottomId: data.outfit.bottomId,
          shoesId: data.outfit.shoesId,
          accessoryId: data.outfit.accessoryId,
          coordinationExplanation: data.outfit.coordinationExplanation,
          stylingReason: data.outfit.stylingReason,
          colorPalette: data.outfit.colorPalette || outfit.colorPalette,
        });
        showToast(`Regenerated outfit for ${outfit.dayName}!`, 'success');
      }
    } catch (err: any) {
      console.error(err);
      showToast('Could not regenerate day.', 'error');
    } finally {
      setIsRegeneratingDay(null);
    }
  };

  // Shuffle all unlocked outfits
  const handleShuffleCombinations = () => {
    if (plannedOutfits.length < 2) return;
    for (let i = 0; i < plannedOutfits.length - 1; i++) {
      const j = Math.floor(Math.random() * (plannedOutfits.length - i)) + i;
      swapOutfitDays(plannedOutfits[i].dayIndex, plannedOutfits[j].dayIndex);
    }
    showToast('Shuffled weekly combinations!', 'success');
  };

  // Drag over handler for day cards
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Drop on day card to swap days or drop wardrobe item
  const handleDropOnDay = (targetDayIndex: number) => {
    if (draggedDayIndex !== null && draggedDayIndex !== targetDayIndex) {
      swapOutfitDays(draggedDayIndex, targetDayIndex);
      setDraggedDayIndex(null);
      return;
    }

    if (draggedItemDrawerId) {
      const item = wardrobe.find((w) => w.id === draggedItemDrawerId);
      if (item) {
        if (item.category === 'Shirts and Tops') {
          updateOutfit(targetDayIndex, { topId: item.id });
        } else if (item.category === 'Pants and Trousers') {
          updateOutfit(targetDayIndex, { bottomId: item.id });
        } else if (item.category === 'Shoes') {
          updateOutfit(targetDayIndex, { shoesId: item.id });
        } else if (item.category === 'Watches and Accessories') {
          updateOutfit(targetDayIndex, { accessoryId: item.id });
        }
        showToast(`Assigned ${item.name} to Day ${targetDayIndex}!`, 'success');
      }
      setDraggedItemDrawerId(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (plannedOutfits.length === 0) {
    return (
      <div className="space-y-6 pb-12 animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight font-serif">
              Your Style, Planned.
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Interactive multi-day wardrobe scheduler powered by Gemini AI.
            </p>
          </div>
          <button
            onClick={onOpenGenerator}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-white/80" />
            <span>Generate My Outfits</span>
          </button>
        </div>

        <div className="text-center py-20 px-4 bg-white rounded-3xl border border-dashed border-zinc-300">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 mb-2 font-serif">
            No Active Outfit Plan Yet
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto mb-6 leading-relaxed">
            Click "Generate My Outfits" to create coordinated daily looks for 1, 3, 5, 7, or custom days using the clothes already in your wardrobe.
          </p>
          <button
            onClick={onOpenGenerator}
            className="px-8 py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-2xl text-xs font-bold shadow-sm transition active:scale-98"
          >
            Start Styling Schedule
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Planner Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Weekly Lookbook & Scheduler</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight font-serif">
            Your Style, Planned.
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            {plannedOutfits.length} days coordinated. Drag & drop cards to reorder days or swap individual pieces.
          </p>
        </div>

        {/* Global Planner Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleShuffleCombinations}
            className="px-3.5 py-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            title="Shuffle combinations across days"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            title="Print or save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Lookbook</span>
          </button>

          <button
            onClick={onOpenGenerator}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 fill-white/80" />
            <span>New AI Plan</span>
          </button>
        </div>
      </div>

      {/* Quick Drag-and-Drop Wardrobe Drawer Ribbon */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-900">Drag & Drop Wardrobe Items:</span>
            <span className="text-zinc-500 hidden sm:inline">
              (Drag any item onto a day card to instantly swap it)
            </span>
          </div>
          <div className="flex items-center gap-1">
            {['All', 'Shirts and Tops', 'Pants and Trousers', 'Shoes', 'Watches and Accessories'].map((cat) => (
              <button
                key={cat}
                onClick={() => setDrawerCategory(cat)}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition ${
                  drawerCategory === cat
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-500 hover:bg-zinc-100'
                }`}
              >
                {cat === 'All' ? 'All' : cat.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto py-2 pr-2">
          {wardrobe
            .filter((w) => drawerCategory === 'All' || w.category === drawerCategory)
            .slice(0, 15)
            .map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => setDraggedItemDrawerId(item.id)}
                onDragEnd={() => setDraggedItemDrawerId(null)}
                className="group shrink-0 flex items-center gap-2 p-1.5 bg-zinc-50 hover:bg-zinc-100 rounded-xl border border-zinc-200 cursor-grab active:cursor-grabbing transition"
                title={`Drag ${item.name} to any day`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-10 h-10 rounded-lg object-cover pointer-events-none"
                />
                <div className="pr-1 text-left">
                  <p className="text-[11px] font-bold text-zinc-900 max-w-[120px] truncate">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-zinc-500 truncate">{item.category}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Grid of Day Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {plannedOutfits.map((outfit, index) => {
          const top = wardrobe.find((w) => w.id === outfit.topId);
          const bottom = wardrobe.find((w) => w.id === outfit.bottomId);
          const shoes = wardrobe.find((w) => w.id === outfit.shoesId);
          const acc = wardrobe.find((w) => w.id === outfit.accessoryId);
          const locks = outfit.lockedSlots || {};

          return (
            <div
              key={outfit.dayIndex}
              draggable
              onDragStart={() => setDraggedDayIndex(outfit.dayIndex)}
              onDragOver={handleDragOver}
              onDrop={() => handleDropOnDay(outfit.dayIndex)}
              className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md ${
                outfit.isWorn
                  ? 'border-emerald-200/90 bg-emerald-50/10'
                  : 'border-zinc-200/80 hover:border-zinc-300'
              }`}
            >
              <div>
                {/* Day Header */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-zinc-950 text-white text-xs font-bold flex items-center justify-center">
                      {outfit.dayIndex}
                    </span>
                    <div>
                      <h3 className="text-sm font-extrabold text-zinc-950">
                        {outfit.dayName}
                      </h3>
                      <span className="text-[10px] uppercase font-bold text-zinc-400">
                        Day {outfit.dayIndex} of {plannedOutfits.length}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      outfit.styleCategory === 'Formal'
                        ? 'bg-zinc-100 text-zinc-800'
                        : outfit.styleCategory === 'Streetwear'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {outfit.styleCategory}
                    </span>

                    {/* Move day left/right quick buttons */}
                    {index > 0 && (
                      <button
                        onClick={() => swapOutfitDays(outfit.dayIndex, plannedOutfits[index - 1].dayIndex)}
                        className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
                        title="Move Earlier"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {index < plannedOutfits.length - 1 && (
                      <button
                        onClick={() => swapOutfitDays(outfit.dayIndex, plannedOutfits[index + 1].dayIndex)}
                        className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
                        title="Move Later"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Outfit Title & Palette */}
                <div className="my-3 space-y-1.5">
                  <h4 className="text-base font-bold text-zinc-900 leading-snug">
                    {outfit.outfitName}
                  </h4>

                  {outfit.colorPalette && outfit.colorPalette.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 mr-0.5">
                        Palette:
                      </span>
                      {outfit.colorPalette.map((col, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.2 bg-zinc-100 text-zinc-700 rounded-md text-[10px] font-medium"
                        >
                          {col}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Visual Flat-Lay Outfit Collage Preview */}
                <div className="grid grid-cols-2 gap-2 my-3 bg-zinc-50 p-2.5 rounded-2xl border border-zinc-200/80">
                  {/* Slot 1: Top */}
                  <div className="relative group/slot rounded-xl overflow-hidden bg-white border border-zinc-200/80 p-2 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        Top
                      </span>
                      <button
                        onClick={() => toggleLockSlot(outfit.dayIndex, 'top')}
                        className={`p-1 rounded-md transition ${
                          locks.top ? 'text-blue-600 bg-blue-50' : 'text-zinc-300 hover:text-zinc-500'
                        }`}
                        title={locks.top ? 'Slot locked' : 'Lock top during regeneration'}
                      >
                        {locks.top ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      </button>
                    </div>

                    <div className="aspect-square rounded-lg overflow-hidden bg-zinc-100 mb-1.5">
                      {top ? (
                        <img src={top.imageUrl} alt={top.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400">
                          Empty
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-zinc-900 truncate">
                        {top ? top.name : 'Missing Top'}
                      </p>
                      <button
                        onClick={() =>
                          setReplacingSlot({
                            dayIndex: outfit.dayIndex,
                            dayName: outfit.dayName,
                            slot: 'top',
                            currentId: outfit.topId,
                          })
                        }
                        className="text-[10px] font-bold text-blue-600 hover:underline shrink-0"
                      >
                        Swap
                      </button>
                    </div>
                  </div>

                  {/* Slot 2: Bottom */}
                  <div className="relative group/slot rounded-xl overflow-hidden bg-white border border-zinc-200/80 p-2 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        Pants
                      </span>
                      <button
                        onClick={() => toggleLockSlot(outfit.dayIndex, 'bottom')}
                        className={`p-1 rounded-md transition ${
                          locks.bottom ? 'text-blue-600 bg-blue-50' : 'text-zinc-300 hover:text-zinc-500'
                        }`}
                        title={locks.bottom ? 'Slot locked' : 'Lock pants during regeneration'}
                      >
                        {locks.bottom ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      </button>
                    </div>

                    <div className="aspect-square rounded-lg overflow-hidden bg-zinc-100 mb-1.5">
                      {bottom ? (
                        <img src={bottom.imageUrl} alt={bottom.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400">
                          Empty
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-zinc-900 truncate">
                        {bottom ? bottom.name : 'Missing Pants'}
                      </p>
                      <button
                        onClick={() =>
                          setReplacingSlot({
                            dayIndex: outfit.dayIndex,
                            dayName: outfit.dayName,
                            slot: 'bottom',
                            currentId: outfit.bottomId,
                          })
                        }
                        className="text-[10px] font-bold text-blue-600 hover:underline shrink-0"
                      >
                        Swap
                      </button>
                    </div>
                  </div>

                  {/* Slot 3: Shoes */}
                  <div className="relative group/slot rounded-xl overflow-hidden bg-white border border-zinc-200/80 p-2 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        Shoes
                      </span>
                      <button
                        onClick={() => toggleLockSlot(outfit.dayIndex, 'shoes')}
                        className={`p-1 rounded-md transition ${
                          locks.shoes ? 'text-blue-600 bg-blue-50' : 'text-zinc-300 hover:text-zinc-500'
                        }`}
                        title={locks.shoes ? 'Slot locked' : 'Lock shoes during regeneration'}
                      >
                        {locks.shoes ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      </button>
                    </div>

                    <div className="aspect-square rounded-lg overflow-hidden bg-zinc-100 mb-1.5">
                      {shoes ? (
                        <img src={shoes.imageUrl} alt={shoes.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400">
                          Empty
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-zinc-900 truncate">
                        {shoes ? shoes.name : 'Missing Shoes'}
                      </p>
                      <button
                        onClick={() =>
                          setReplacingSlot({
                            dayIndex: outfit.dayIndex,
                            dayName: outfit.dayName,
                            slot: 'shoes',
                            currentId: outfit.shoesId,
                          })
                        }
                        className="text-[10px] font-bold text-blue-600 hover:underline shrink-0"
                      >
                        Swap
                      </button>
                    </div>
                  </div>

                  {/* Slot 4: Watch / Accessory */}
                  <div className="relative group/slot rounded-xl overflow-hidden bg-white border border-zinc-200/80 p-2 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        Accessory
                      </span>
                      <button
                        onClick={() => toggleLockSlot(outfit.dayIndex, 'accessory')}
                        className={`p-1 rounded-md transition ${
                          locks.accessory ? 'text-blue-600 bg-blue-50' : 'text-zinc-300 hover:text-zinc-500'
                        }`}
                        title={locks.accessory ? 'Slot locked' : 'Lock watch during regeneration'}
                      >
                        {locks.accessory ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      </button>
                    </div>

                    <div className="aspect-square rounded-lg overflow-hidden bg-zinc-100 mb-1.5">
                      {acc ? (
                        <img src={acc.imageUrl} alt={acc.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400">
                          Optional
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-zinc-900 truncate">
                        {acc ? acc.name : 'Optional Piece'}
                      </p>
                      <button
                        onClick={() =>
                          setReplacingSlot({
                            dayIndex: outfit.dayIndex,
                            dayName: outfit.dayName,
                            slot: 'accessory',
                            currentId: outfit.accessoryId,
                          })
                        }
                        className="text-[10px] font-bold text-blue-600 hover:underline shrink-0"
                      >
                        Swap
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI Stylist Reason */}
                <div className="space-y-1 pt-1 text-xs text-zinc-600">
                  <p className="leading-relaxed">
                    <strong className="text-zinc-900 font-semibold">Styling: </strong>
                    {outfit.stylingReason}
                  </p>
                  {outfit.missingItemTips && (
                    <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-xl mt-1 flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{outfit.missingItemTips}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Day Card Footer Controls */}
              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between gap-1">
                {/* Mark as worn toggle */}
                <button
                  onClick={() => markOutfitWorn(outfit.dayIndex)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    outfit.isWorn
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{outfit.isWorn ? 'Worn Today' : 'Mark Worn'}</span>
                </button>

                <div className="flex items-center gap-1">
                  {/* Save Outfit button */}
                  <button
                    onClick={() => saveOutfit(outfit.dayIndex)}
                    className={`p-2 rounded-xl border transition ${
                      outfit.isSaved
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-zinc-200 hover:bg-zinc-50 text-zinc-500'
                    }`}
                    title="Save outfit to your favorites"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>

                  {/* Regenerate this specific day */}
                  <button
                    onClick={() => handleRegenerateDay(outfit.dayIndex)}
                    disabled={isRegeneratingDay === outfit.dayIndex}
                    className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-500 hover:text-zinc-900 transition disabled:opacity-50"
                    title="Regenerate this day with AI"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${
                        isRegeneratingDay === outfit.dayIndex ? 'animate-spin text-blue-600' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Item Replacement Modal */}
      {replacingSlot && (
        <ReplaceItemModal
          isOpen={Boolean(replacingSlot)}
          onClose={() => setReplacingSlot(null)}
          dayIndex={replacingSlot.dayIndex}
          dayName={replacingSlot.dayName}
          slot={replacingSlot.slot}
          currentSelectedId={replacingSlot.currentId}
        />
      )}
    </div>
  );
};
