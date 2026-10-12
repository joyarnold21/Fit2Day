import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ClothingCategory, Occasion, CATEGORIES, CATEGORY_LIMIT } from '../types';
import {
  X,
  Upload,
  Camera,
  Sparkles,
  Trash2,
  Check,
  AlertCircle,
  HelpCircle,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';

interface UploadItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: ClothingCategory;
}

const COMMON_COLORS = [
  'White',
  'Black',
  'Navy Blue',
  'Charcoal Grey',
  'Light Grey',
  'Beige / Khaki',
  'Brown / Cognac',
  'Olive Green',
  'Burgundy',
  'Light Blue',
  'Dark Indigo',
  'Forest Green',
  'Cream / Off-White',
];

const PRESET_STOCK_IMAGES: Record<ClothingCategory, { name: string; url: string; type: string; color: string; occasion: Occasion }[]> = {
  'Shirts and Tops': [
    {
      name: 'Relaxed Oatmeal Linen Shirt',
      url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80',
      type: 'Linen Shirt',
      color: 'Beige / Khaki',
      occasion: 'Casual',
    },
    {
      name: 'Black Cashmere Knit Turtleneck',
      url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80',
      type: 'Knit Sweater',
      color: 'Black',
      occasion: 'Formal',
    },
    {
      name: 'Vintage Wash Boxy Graphic Tee',
      url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
      type: 'Graphic Tee',
      color: 'Charcoal Grey',
      occasion: 'Streetwear',
    },
  ],
  'Pants and Trousers': [
    {
      name: 'Classic Stone Chinos',
      url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80',
      type: 'Chinos',
      color: 'Beige / Khaki',
      occasion: 'Casual',
    },
    {
      name: 'Black Minimalist Utility Pants',
      url: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=600&q=80',
      type: 'Cargo Pants',
      color: 'Black',
      occasion: 'Streetwear',
    },
  ],
  'Shoes': [
    {
      name: 'Suede Belgian Loafers',
      url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80',
      type: 'Loafers',
      color: 'Brown / Cognac',
      occasion: 'Formal',
    },
    {
      name: 'Cream Canvas Skate Lows',
      url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80',
      type: 'Sneakers',
      color: 'White',
      occasion: 'Casual',
    },
  ],
  'Watches and Accessories': [
    {
      name: 'Gold Vintage Mesh Watch',
      url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
      type: 'Dress Watch',
      color: 'Beige / Khaki',
      occasion: 'Formal',
    },
    {
      name: 'Matte Black Geometric Sunglasses',
      url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
      type: 'Sunglasses',
      color: 'Black',
      occasion: 'Streetwear',
    },
  ],
};

export const UploadItemModal: React.FC<UploadItemModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'Shirts and Tops',
}) => {
  const { addWardrobeItem, getCategoryCount, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ClothingCategory>(defaultCategory);
  const [clothingType, setClothingType] = useState('');
  const [primaryColor, setPrimaryColor] = useState('White');
  const [secondaryColors, setSecondaryColors] = useState<string[]>([]);
  const [pattern, setPattern] = useState('Solid');
  const [occasion, setOccasion] = useState<Occasion>('Casual');
  const [notes, setNotes] = useState('');

  // AI Vision state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiDetected, setAiDetected] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentCategoryCount = getCategoryCount(category);
  const isCategoryFull = currentCategoryCount >= CATEGORY_LIMIT;

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      // Auto trigger AI Vision analysis
      analyzeWithAiVision(result, file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  const handlePresetSelect = (preset: typeof PRESET_STOCK_IMAGES['Shirts and Tops'][0]) => {
    setImagePreview(preset.url);
    setName(preset.name);
    setClothingType(preset.type);
    setPrimaryColor(preset.color);
    setOccasion(preset.occasion);
    setAiDetected(true);
    setErrorMessage(null);
  };

  const analyzeWithAiVision = async (base64Image: string, mimeType = 'image/jpeg') => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/analyze-clothing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Image,
          mimeType,
        }),
      });

      if (!res.ok) {
        throw new Error('AI Vision analysis service unavailable.');
      }

      const data = await res.json();
      if (data.suggestedName) setName(data.suggestedName);
      if (data.category && CATEGORIES.some((c) => c.key === data.category)) {
        setCategory(data.category as ClothingCategory);
      }
      if (data.clothingType) setClothingType(data.clothingType);
      if (data.primaryColor) setPrimaryColor(data.primaryColor);
      if (Array.isArray(data.secondaryColors)) setSecondaryColors(data.secondaryColors);
      if (data.pattern) setPattern(data.pattern);
      if (data.occasion && ['Formal', 'Casual', 'Streetwear'].includes(data.occasion)) {
        setOccasion(data.occasion as Occasion);
      }
      if (data.notes) setNotes(data.notes);

      setAiDetected(true);
      showToast('Gemini Vision identified item details! You can fine-tune below.', 'success');
    } catch (err: any) {
      console.warn('Vision detection note:', err);
      // Fallback: set clean defaults
      if (!name) setName('Wardrobe Piece');
      if (!clothingType) setClothingType('Clothing Item');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please give this item a name.');
      return;
    }

    if (!clothingType.trim()) {
      setErrorMessage('Please specify the clothing type (e.g. Oxford Shirt, Chinos).');
      return;
    }

    if (isCategoryFull) {
      setErrorMessage(`Category limit reached (${CATEGORY_LIMIT} items max for ${category}).`);
      return;
    }

    const finalImage = imagePreview || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80';

    const result = addWardrobeItem({
      name: name.trim(),
      category,
      clothingType: clothingType.trim(),
      primaryColor,
      secondaryColors,
      pattern,
      occasion,
      notes: notes.trim(),
      imageUrl: finalImage,
    });

    if (result.success) {
      resetAndClose();
    } else {
      setErrorMessage(result.error || 'Failed to add item.');
    }
  };

  const resetAndClose = () => {
    setImagePreview(null);
    setName('');
    setCategory(defaultCategory);
    setClothingType('');
    setPrimaryColor('White');
    setSecondaryColors([]);
    setPattern('Solid');
    setOccasion('Casual');
    setNotes('');
    setAiDetected(false);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-8 shadow-2xl border border-zinc-100 my-8 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-zinc-100 rounded-lg text-zinc-800">
                <Camera className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold text-zinc-950 font-serif">
                Add to Your Digital Wardrobe
              </h2>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Snap or upload a piece you own. AI Vision detects colors, patterns, and style automatically.
            </p>
          </div>
          <button
            onClick={resetAndClose}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto py-4 space-y-5 flex-1 pr-1">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Photo Upload & Preview Section */}
          <div>
            <label className="block text-xs font-bold text-zinc-800 mb-2 uppercase tracking-wider">
              1. Photo of Clothing Item
            </label>

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50 p-3 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-32 h-32 rounded-xl overflow-hidden bg-zinc-100 shrink-0 relative group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xs flex flex-col items-center justify-center text-white text-xs gap-1.5">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                      <span className="font-semibold text-[11px]">AI Vision...</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    {aiDetected && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                        <Check className="w-3 h-3" />
                        AI Vision Analyzed
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500">
                    Image loaded successfully. You can replace it or use the presets below.
                  </p>
                  <div className="flex items-center gap-2 justify-center sm:justify-start pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-700"
                    >
                      Replace Image
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setAiDetected(false);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-200 hover:border-blue-400 rounded-2xl p-6 text-center cursor-pointer transition-all bg-zinc-50/60 hover:bg-blue-50/20 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-zinc-200 text-zinc-500 group-hover:text-blue-600 flex items-center justify-center mx-auto mb-3 transition">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-zinc-900 mb-0.5">
                    Click to upload a photo from your device
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    PNG, JPG, or WEBP. Gemini AI will auto-detect category, colors & occasion.
                  </p>
                </div>

                {/* Preset quick test images */}
                <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-200/80">
                  <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-2">
                    Or select a sample item to test instantly:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_STOCK_IMAGES[category]?.slice(0, 3).map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handlePresetSelect(item)}
                        className="flex items-center gap-2 p-1.5 bg-white rounded-xl border border-zinc-200 hover:border-zinc-400 text-left transition group"
                      >
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-8 h-8 rounded-lg object-cover shrink-0"
                        />
                        <span className="text-[11px] font-medium text-zinc-800 truncate">
                          {item.type}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Category Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider">
                2. Category (Max 30 Per Category)
              </label>
              <span
                className={`text-xs font-bold ${
                  isCategoryFull ? 'text-amber-600' : 'text-zinc-500'
                }`}
              >
                {currentCategoryCount} / {CATEGORY_LIMIT} items
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => {
                const count = getCategoryCount(cat.key);
                const isSelected = category === cat.key;
                const isFull = count >= CATEGORY_LIMIT;

                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCategory(cat.key)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-bold shadow-xs'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
                    }`}
                  >
                    <p className="text-xs truncate">{cat.label}</p>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      {count} / {CATEGORY_LIMIT}
                    </span>
                  </button>
                );
              })}
            </div>

            {isCategoryFull && (
              <p className="text-xs text-amber-600 font-semibold mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                This category has reached its 30-item limit. Delete an item to add a new one.
              </p>
            )}
          </div>

          {/* Details Row: Name & Clothing Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                Item Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Crisp White Oxford Shirt"
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                Clothing Type *
              </label>
              <input
                type="text"
                value={clothingType}
                onChange={(e) => setClothingType(e.target.value)}
                placeholder="e.g. Oxford Shirt, Chinos, Chelsea Boots"
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition"
                required
              />
            </div>
          </div>

          {/* Color & Occasion Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                Dominant Color
              </label>
              <select
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition"
              >
                {COMMON_COLORS.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                Style Occasion *
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Formal', 'Casual', 'Streetwear'] as Occasion[]).map((occ) => (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => setOccasion(occ)}
                    className={`py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                      occasion === occ
                        ? 'border-zinc-950 bg-zinc-950 text-white font-bold'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-zinc-800 mb-1.5">
              Styling Notes / Fit (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Slim fit, pairs great with white sneakers, breathable summer linen."
              className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition"
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={resetAndClose}
            className="px-4 py-2.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isCategoryFull || !name.trim() || isAnalyzing}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition disabled:opacity-40 disabled:hover:bg-blue-600 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Save to Wardrobe</span>
          </button>
        </div>
      </div>
    </div>
  );
};
