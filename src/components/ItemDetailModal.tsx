import React, { useState } from 'react';
import { WardrobeItem, Occasion, ClothingCategory, CATEGORIES } from '../types';
import { useApp } from '../context/AppContext';
import { X, Trash2, Edit2, Check, Clock, Sparkles } from 'lucide-react';

interface ItemDetailModalProps {
  item: WardrobeItem | null;
  onClose: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
}) => {
  const { updateWardrobeItem, deleteWardrobeItem } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [clothingType, setClothingType] = useState('');
  const [occasion, setOccasion] = useState<Occasion>('Casual');
  const [notes, setNotes] = useState('');

  if (!item) return null;

  const handleStartEdit = () => {
    setName(item.name);
    setClothingType(item.clothingType);
    setOccasion(item.occasion);
    setNotes(item.notes);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    updateWardrobeItem(item.id, {
      name: name.trim() || item.name,
      clothingType: clothingType.trim() || item.clothingType,
      occasion,
      notes: notes.trim(),
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${item.name}" from your wardrobe?`)) {
      deleteWardrobeItem(item.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start mb-6">
          <div className="w-36 h-36 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-[11px] font-bold uppercase tracking-wider">
              {item.category}
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-zinc-300 rounded-lg text-sm font-bold"
                />
                <input
                  type="text"
                  value={clothingType}
                  onChange={(e) => setClothingType(e.target.value)}
                  className="w-full px-3 py-1.5 border border-zinc-300 rounded-lg text-xs"
                />
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-zinc-950 leading-tight">
                  {item.name}
                </h3>
                <p className="text-xs text-zinc-500">{item.clothingType}</p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-1.5 justify-center sm:justify-start pt-1">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded-full text-[11px] font-semibold">
                Color: {item.primaryColor}
              </span>
              <span className="px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded-full text-[11px] font-semibold">
                {item.occasion}
              </span>
              {item.pattern && item.pattern !== 'Solid' && (
                <span className="px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded-full text-[11px] font-semibold">
                  {item.pattern}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats & Notes */}
        <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200/80 mb-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-600 border-b border-zinc-200/60 pb-2">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Rotation Count</span>
            </span>
            <span className="font-bold text-zinc-900">
              Worn {item.wornCount || 0} times {item.lastWornDate ? `(last: ${item.lastWornDate})` : ''}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
              Stylist Notes & Details
            </span>
            {isEditing ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full p-2 bg-white border border-zinc-200 rounded-lg text-xs"
              />
            ) : (
              <p className="text-xs text-zinc-700 italic">
                {item.notes || 'No custom notes provided for this piece.'}
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleDelete}
            className="px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Remove Item</span>
          </button>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 text-xs font-bold bg-zinc-950 text-white rounded-xl transition flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={handleStartEdit}
                className="px-4 py-2 text-xs font-bold bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl transition flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
