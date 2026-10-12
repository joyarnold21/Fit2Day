import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ClothingCategory, Occasion, CATEGORIES, CATEGORY_LIMIT, WardrobeItem } from '../types';
import {
  X,
  Upload,
  Camera,
  Sparkles,
  Check,
  CheckSquare,
  Square,
  AlertCircle,
  Loader2,
  Layers,
  ArrowRight,
  Shirt,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';

interface CollectionScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToPlanner?: () => void;
}

interface DetectedGarment {
  name: string;
  category: ClothingCategory;
  clothingType: string;
  primaryColor: string;
  secondaryColors?: string[];
  pattern?: string;
  occasion: Occasion;
  visualDescription?: string;
  notes?: string;
  selected: boolean;
}

interface InstantOutfit {
  outfitName: string;
  styleCategory: Occasion;
  piecesSummary: string;
  coordinationReason: string;
}

const SAMPLE_COLLECTION_PRESETS = [
  {
    title: 'Capsule Collection Flat-Lay',
    description: 'Oxford shirt, knit sweater, chinos & leather footwear laid out on neutral linen.',
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Wardrobe Rack Collection',
    description: 'Tailored jackets, casual tees, and trousers on minimalist hangers.',
    url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80',
  },
];

export const CollectionScanModal: React.FC<CollectionScanModalProps> = ({
  isOpen,
  onClose,
  onGoToPlanner,
}) => {
  const { addMultipleWardrobeItems, showToast, setActiveTab, setPlannedOutfits } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Analysis Result
  const [collectionSummary, setCollectionSummary] = useState<string | null>(null);
  const [detectedItems, setDetectedItems] = useState<DetectedGarment[]>([]);
  const [instantOutfits, setInstantOutfits] = useState<InstantOutfit[]>([]);
  const [isDoneScanning, setIsDoneScanning] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please select a valid image (JPEG, PNG, WEBP).');
        return;
      }
      setErrorMessage(null);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        setImagePreview(base64);
        processCollectionPhoto(base64, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (url: string) => {
    setImagePreview(url);
    processCollectionPhoto(url, 'image/jpeg');
  };

  const processCollectionPhoto = async (base64OrUrl: string, mimeType = 'image/jpeg') => {
    setIsProcessing(true);
    setErrorMessage(null);
    setIsDoneScanning(false);

    try {
      const res = await fetch('/api/analyze-collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64OrUrl,
          mimeType,
        }),
      });

      if (!res.ok) {
        throw new Error('Backend failed to process wardrobe collection photo.');
      }

      const data = await res.json();

      setCollectionSummary(data.collectionSummary || 'Detected clothing collection.');
      
      const items: DetectedGarment[] = (data.detectedItems || []).map((item: any) => ({
        name: item.name || 'Wardrobe Garment',
        category: (item.category as ClothingCategory) || 'Shirts and Tops',
        clothingType: item.clothingType || 'Clothing Piece',
        primaryColor: item.primaryColor || 'Neutral',
        secondaryColors: item.secondaryColors || [],
        pattern: item.pattern || 'Solid',
        occasion: (['Formal', 'Casual', 'Streetwear'].includes(item.occasion)
          ? item.occasion
          : 'Casual') as Occasion,
        visualDescription: item.visualDescription || '',
        notes: item.notes || '',
        selected: true, // selected by default
      }));

      setDetectedItems(items);
      setInstantOutfits(data.instantOutfits || []);
      setIsDoneScanning(true);
      showToast(`AI identified ${items.length} garments from your photo!`, 'success');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'Error scanning dress collection. Please try another photo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleSelectGarment = (index: number) => {
    setDetectedItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, selected: !item.selected } : item))
    );
  };

  const toggleSelectAll = () => {
    const allSelected = detectedItems.every((i) => i.selected);
    setDetectedItems((prev) => prev.map((i) => ({ ...i, selected: !allSelected })));
  };

  const handleImportToWardrobe = (andPlan = false) => {
    const selected = detectedItems.filter((i) => i.selected);
    if (selected.length === 0) {
      setErrorMessage('Please select at least one garment to import.');
      return;
    }

    const payload = selected.map((item) => ({
      name: item.name,
      category: item.category,
      clothingType: item.clothingType,
      primaryColor: item.primaryColor,
      secondaryColors: item.secondaryColors || [],
      pattern: item.pattern || 'Solid',
      occasion: item.occasion,
      notes: item.notes || item.visualDescription || 'Imported from collection scan',
      imageUrl: imagePreview || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    }));

    addMultipleWardrobeItems(payload);

    resetAndClose();

    if (andPlan) {
      setActiveTab('planner');
    } else {
      setActiveTab('wardrobe');
    }
  };

  const resetAndClose = () => {
    setImagePreview(null);
    setCollectionSummary(null);
    setDetectedItems([]);
    setInstantOutfits([]);
    setIsDoneScanning(false);
    setErrorMessage(null);
    onClose();
  };

  const selectedCount = detectedItems.filter((i) => i.selected).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl p-5 sm:p-8 shadow-2xl border border-zinc-100 my-8 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                <Camera className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold text-zinc-950 font-serif">
                Scan Dress Collection Photo
              </h2>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Send a photo of multiple clothes (closet rack, flat-lay, or bed layout). The backend AI detects every piece and crafts coordinated outfits.
            </p>
          </div>
          <button
            onClick={resetAndClose}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto py-4 space-y-6 flex-1 pr-1">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Photo Upload Box */}
          {!imagePreview ? (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-300 hover:border-blue-500 rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all bg-zinc-50/70 hover:bg-blue-50/20 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-white shadow-xs border border-zinc-200 text-zinc-600 group-hover:text-blue-600 group-hover:scale-105 flex items-center justify-center mx-auto mb-4 transition">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 mb-1 font-serif">
                  Upload a photo of your dress collection
                </h3>
                <p className="text-xs text-zinc-500 max-w-md mx-auto mb-2">
                  Take a photo of clothes hanging in your closet, folded on a table, or laid out on your bed.
                </p>
                <span className="inline-block px-3 py-1 bg-white border border-zinc-200 text-zinc-700 rounded-xl text-xs font-semibold shadow-2xs group-hover:border-blue-400">
                  Select File from Device
                </span>
              </div>

              {/* Sample Collection Presets */}
              <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200/80">
                <p className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2.5">
                  Or test with sample wardrobe collections:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SAMPLE_COLLECTION_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(preset.url)}
                      className="flex items-center gap-3 p-2.5 bg-white hover:bg-zinc-100 rounded-2xl border border-zinc-200 hover:border-zinc-400 text-left transition group"
                    >
                      <img
                        src={preset.url}
                        alt={preset.title}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-zinc-900 group-hover:text-blue-600 transition truncate">
                          {preset.title}
                        </p>
                        <p className="text-[11px] text-zinc-500 line-clamp-2">
                          {preset.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Image Preview Banner */}
              <div className="relative rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-950 max-h-56">
                <img
                  src={imagePreview}
                  alt="Dress Collection"
                  className="w-full h-56 object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent flex items-end p-4 justify-between">
                  <div className="text-white">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                      Collection Photo Analyzed
                    </p>
                    <p className="text-sm font-bold">
                      {isProcessing ? 'Gemini 3.8 Flash Vision Inspecting...' : 'Scan Complete'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setDetectedItems([]);
                      setIsDoneScanning(false);
                    }}
                    className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white text-xs font-medium transition"
                  >
                    Upload Another
                  </button>
                </div>

                {isProcessing && (
                  <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                    <p className="text-sm font-bold font-serif">Backend AI Stylist at Work...</p>
                    <p className="text-xs text-zinc-300">
                      Detecting garments, analyzing color palettes, and generating outfits...
                    </p>
                  </div>
                )}
              </div>

              {/* Scan Results */}
              {isDoneScanning && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Summary Banner */}
                  <div className="p-4 bg-blue-50/80 border border-blue-200/80 rounded-2xl flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider mb-0.5">
                        Backend AI Analysis Output
                      </h4>
                      <p className="text-xs text-blue-900 leading-relaxed font-medium">
                        {collectionSummary}
                      </p>
                    </div>
                  </div>

                  {/* Detected Clothing Pieces */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Shirt className="w-4 h-4 text-zinc-700" />
                        <h4 className="text-sm font-bold text-zinc-950">
                          Detected Garments ({detectedItems.length})
                        </h4>
                      </div>
                      <button
                        onClick={toggleSelectAll}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        {detectedItems.every((i) => i.selected) ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {detectedItems.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => toggleSelectGarment(idx)}
                          className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                            item.selected
                              ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                              : 'border-zinc-200 bg-white hover:border-zinc-300 opacity-60'
                          }`}
                        >
                          <button
                            type="button"
                            className="mt-0.5 text-blue-600 shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSelectGarment(idx);
                            }}
                          >
                            {item.selected ? (
                              <CheckSquare className="w-4 h-4 fill-blue-600 text-white" />
                            ) : (
                              <Square className="w-4 h-4 text-zinc-400" />
                            )}
                          </button>

                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                                {item.category}
                              </span>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-zinc-200 text-zinc-600">
                                {item.occasion}
                              </span>
                            </div>

                            <p className="text-xs font-bold text-zinc-950 leading-snug">
                              {item.name}
                            </p>

                            <p className="text-[11px] text-zinc-500">
                              {item.clothingType} • Color: <strong>{item.primaryColor}</strong>
                            </p>

                            {item.visualDescription && (
                              <p className="text-[10px] text-zinc-400 italic">
                                Location: {item.visualDescription}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Instant Outfits Generated From Collection Photo */}
                  {instantOutfits.length > 0 && (
                    <div className="pt-2">
                      <div className="flex items-center gap-2 mb-3">
                        <Layers className="w-4 h-4 text-zinc-700" />
                        <h4 className="text-sm font-bold text-zinc-950">
                          Instant Outfits Curated From This Collection
                        </h4>
                      </div>

                      <div className="space-y-3">
                        {instantOutfits.map((outfit, i) => (
                          <div
                            key={i}
                            className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/90 space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-zinc-900">
                                {outfit.outfitName}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-800">
                                {outfit.styleCategory}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-blue-700">
                              {outfit.piecesSummary}
                            </p>
                            <p className="text-[11px] text-zinc-600 italic">
                              "{outfit.coordinationReason}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
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

        {/* Modal Actions Footer */}
        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={resetAndClose}
            className="px-4 py-2.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition"
          >
            Cancel
          </button>

          {isDoneScanning && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleImportToWardrobe(false)}
                disabled={selectedCount === 0}
                className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-40"
              >
                <Check className="w-4 h-4" />
                <span>Add {selectedCount} Items to Wardrobe</span>
              </button>

              <button
                onClick={() => handleImportToWardrobe(true)}
                disabled={selectedCount === 0}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition flex items-center gap-1.5 disabled:opacity-40"
              >
                <Sparkles className="w-4 h-4 fill-white/80" />
                <span>Add & Go to Planner</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
