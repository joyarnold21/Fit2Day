import React from 'react';
import { useApp } from '../context/AppContext';
import { ClothingCategory, WardrobeItem } from '../types';
import { X, Check, ArrowRight } from 'lucide-react';

interface ReplaceItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayIndex: number;
  dayName: string;
  slot: 'top' | 'bottom' | 'shoes' | 'accessory';
  currentSelectedId: string | null;
}

export const ReplaceItemModal: React.FC<ReplaceItemModalProps> = ({
  isOpen,
  onClose,
  dayIndex,
  dayName,
  slot,
  currentSelectedId,
}) => {
  const { wardrobe, replaceOutfitItem } = useApp();

  if (!isOpen) return null;

  const categoryMap: Record<typeof slot, ClothingCategory> = {
    top: 'Shirts and Tops',
    bottom: 'Pants and Trousers',
    shoes: 'Shoes',
    accessory: 'Watches and Accessories',
  };

  const targetCategory = categoryMap[slot];
  const compatibleItems = wardrobe.filter((w) => w.category === targetCategory);

  const handleSelect = (itemId: string | null) => {
    replaceOutfitItem(dayIndex, slot, itemId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-100 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div>
            <h3 className="text-lg font-bold text-zinc-950 font-serif">
              Replace {slot.charAt(0).toUpperCase() + slot.slice(1)} for {dayName}
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Select any compatible piece from your {targetCategory}.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of items */}
        <div className="overflow-y-auto py-4 space-y-2.5 flex-1 pr-1">
          {/* Option to leave slot empty */}
          <button
            type="button"
            onClick={() => handleSelect(null)}
            className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition ${
              currentSelectedId === null
                ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold'
                : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <span className="text-xs">None / Leave slot empty for this day</span>
            {currentSelectedId === null && <Check className="w-4 h-4 text-blue-600" />}
          </button>

          {compatibleItems.map((item) => {
            const isSelected = item.id === currentSelectedId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full p-3 rounded-2xl border text-left flex items-center gap-3.5 transition group ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                    : 'border-zinc-200 bg-white hover:border-zinc-400'
                }`}
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-700">
                      {item.occasion}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {item.primaryColor}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-900 group-hover:text-blue-600 transition">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-zinc-500 line-clamp-1">
                    {item.clothingType} • Worn {item.wornCount || 0}x
                  </p>
                </div>

                {isSelected ? (
                  <span className="p-1 rounded-full bg-blue-600 text-white shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-zinc-400 group-hover:text-zinc-900 flex items-center gap-1 shrink-0">
                    Select
                    <ArrowRight className="w-3 h-3" />
                  </span>
                )}
              </button>
            );
          })}

          {compatibleItems.length === 0 && (
            <div className="text-center py-8 text-xs text-zinc-400">
              No pieces uploaded in {targetCategory} yet.
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-zinc-100 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 rounded-xl"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
