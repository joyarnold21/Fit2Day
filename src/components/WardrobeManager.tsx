import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ClothingCategory, Occasion, CATEGORIES, CATEGORY_LIMIT, WardrobeItem } from '../types';
import { ItemDetailModal } from './ItemDetailModal';
import {
  Plus,
  Search,
  Filter,
  Shirt,
  Sparkles,
  RefreshCw,
  Trash2,
  Tag,
  AlertCircle,
  Eye,
  Camera,
} from 'lucide-react';

interface WardrobeManagerProps {
  onOpenUpload: (defaultCategory?: ClothingCategory) => void;
  onOpenGenerator: () => void;
  onOpenScan?: () => void;
}

export const WardrobeManager: React.FC<WardrobeManagerProps> = ({
  onOpenUpload,
  onOpenGenerator,
  onOpenScan,
}) => {
  const { wardrobe, getCategoryCount, loadSampleWardrobe, clearWardrobe } = useApp();

  const [selectedCategoryTab, setSelectedCategoryTab] = useState<'All' | ClothingCategory>('All');
  const [selectedOccasionFilter, setSelectedOccasionFilter] = useState<'All' | Occasion>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);

  // Filter items
  const filteredItems = wardrobe.filter((item) => {
    if (selectedCategoryTab !== 'All' && item.category !== selectedCategoryTab) {
      return false;
    }
    if (selectedOccasionFilter !== 'All' && item.occasion !== selectedOccasionFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchType = item.clothingType.toLowerCase().includes(q);
      const matchColor = item.primaryColor.toLowerCase().includes(q);
      const matchOcc = item.occasion.toLowerCase().includes(q);
      if (!matchName && !matchType && !matchColor && !matchOcc) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Shirt className="w-3.5 h-3.5 text-blue-600" />
            <span>Digital Closet Collection</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight font-serif">
            Your Digital Wardrobe
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-xl">
            Upload and organize clothes you already own. Store up to 30 tops, 30 pants, 30 shoes, and 30 watches/accessories.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onOpenScan && (
            <button
              onClick={onOpenScan}
              className="px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-2xl text-xs font-bold border border-zinc-200 transition flex items-center gap-2 active:scale-98 cursor-pointer"
              title="Scan a photo of your wardrobe collection or closet"
            >
              <Camera className="w-4 h-4 text-blue-600" />
              <span>Scan Collection</span>
            </button>
          )}

          <button
            onClick={() => onOpenUpload(selectedCategoryTab !== 'All' ? selectedCategoryTab : undefined)}
            className="px-5 py-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-2xl text-xs font-bold shadow-sm transition flex items-center gap-2 active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Clothing Item</span>
          </button>

          <button
            onClick={onOpenGenerator}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-sm shadow-blue-500/20 transition flex items-center gap-2 active:scale-98 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-white/80" />
            <span>Generate Outfits</span>
          </button>
        </div>
      </div>

      {/* Category Tabs & Capacity Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <button
          onClick={() => setSelectedCategoryTab('All')}
          className={`p-3 rounded-2xl border text-left transition-all ${
            selectedCategoryTab === 'All'
              ? 'border-zinc-950 bg-zinc-950 text-white font-bold shadow-xs'
              : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
          }`}
        >
          <p className="text-xs">All Pieces</p>
          <span className={`text-[11px] block mt-0.5 ${selectedCategoryTab === 'All' ? 'text-zinc-300' : 'text-zinc-400'}`}>
            {wardrobe.length} items
          </span>
        </button>

        {CATEGORIES.map((cat) => {
          const count = getCategoryCount(cat.key);
          const isSelected = selectedCategoryTab === cat.key;
          const isFull = count >= CATEGORY_LIMIT;

          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategoryTab(cat.key)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'border-zinc-950 bg-zinc-950 text-white font-bold shadow-xs'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
              }`}
            >
              <p className="text-xs truncate">{cat.label}</p>
              <div className="flex items-center justify-between mt-0.5">
                <span className={`text-[11px] ${isSelected ? 'text-zinc-300' : 'text-zinc-400'}`}>
                  {count} / {CATEGORY_LIMIT}
                </span>
                {isFull && (
                  <span className="text-[10px] text-amber-500 font-bold">Max</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, color, type..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
          />
        </div>

        {/* Occasion Filter Buttons */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-zinc-400 mr-1 hidden sm:inline">
            Occasion:
          </span>
          {(['All', 'Formal', 'Casual', 'Streetwear'] as const).map((occ) => (
            <button
              key={occ}
              onClick={() => setSelectedOccasionFilter(occ)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all shrink-0 ${
                selectedOccasionFilter === occ
                  ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              {occ}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Items */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group bg-white rounded-2xl overflow-hidden border border-zinc-200/80 hover:border-zinc-400 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Photo Thumbnail */}
                <div className="aspect-square bg-zinc-100 overflow-hidden relative">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-950/80 backdrop-blur-xs text-white">
                      {item.occasion}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block truncate">
                    {item.category}
                  </span>
                  <h3 className="text-xs font-bold text-zinc-900 line-clamp-1 group-hover:text-blue-600 transition">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-zinc-500 line-clamp-1">
                    {item.clothingType} • {item.primaryColor}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-3 pb-3 pt-1 flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-50">
                <span>Worn {item.wornCount || 0}x</span>
                <span className="group-hover:text-zinc-900 font-semibold flex items-center gap-0.5">
                  <Eye className="w-3 h-3" />
                  View
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-zinc-300">
          <div className="w-14 h-14 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto mb-4">
            <Shirt className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-1">
            No clothing items found
          </h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto mb-6 leading-relaxed">
            {searchQuery
              ? `No items match "${searchQuery}". Try adjusting your filters.`
              : selectedCategoryTab !== 'All'
              ? `You haven't uploaded any pieces in ${selectedCategoryTab} yet.`
              : 'Your wardrobe is currently empty. Upload photos of your clothes or load our curated starter wardrobe!'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onOpenUpload(selectedCategoryTab !== 'All' ? selectedCategoryTab : undefined)}
              className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Clothing Piece</span>
            </button>

            {onOpenScan && (
              <button
                onClick={onOpenScan}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Scan Dress Collection Photo</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Item Detail / Edit Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};
