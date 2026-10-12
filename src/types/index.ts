export type ClothingCategory =
  | 'Shirts and Tops'
  | 'Pants and Trousers'
  | 'Shoes'
  | 'Watches and Accessories';

export type Occasion = 'Formal' | 'Casual' | 'Streetwear';

export type StylePreference = 'Formal' | 'Casual' | 'Streetwear' | 'Mixed styles';

export interface WardrobeItem {
  id: string;
  name: string;
  category: ClothingCategory;
  clothingType: string;
  primaryColor: string;
  secondaryColors: string[];
  pattern: string;
  occasion: Occasion;
  notes: string;
  imageUrl: string;
  createdAt: string;
  wornCount: number;
  lastWornDate?: string;
}

export interface PlannedOutfit {
  dayIndex: number;
  dayName: string;
  dateString?: string;
  outfitName: string;
  styleCategory: Occasion;
  topId: string | null;
  bottomId: string | null;
  shoesId: string | null;
  accessoryId: string | null;
  colorPalette: string[];
  coordinationExplanation: string;
  stylingReason: string;
  missingItemTips?: string;
  isWorn?: boolean;
  isSaved?: boolean;
  lockedSlots?: {
    top?: boolean;
    bottom?: boolean;
    shoes?: boolean;
    accessory?: boolean;
  };
}

export interface SavedOutfit {
  id: string;
  name: string;
  styleCategory: Occasion;
  topId: string | null;
  bottomId: string | null;
  shoesId: string | null;
  accessoryId: string | null;
  colorPalette: string[];
  coordinationExplanation: string;
  stylingReason?: string;
  createdAt: string;
  wearDates: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  authProvider: 'demo' | 'google' | 'email' | 'phone';
  avatarUrl?: string;
  preferredStyle: StylePreference;
  favoriteColors: string[];
}

export const CATEGORY_LIMIT = 30;

export const CATEGORIES: {
  key: ClothingCategory;
  label: string;
  singular: string;
  description: string;
  examples: string;
}[] = [
  {
    key: 'Shirts and Tops',
    label: 'Shirts and Tops',
    singular: 'Shirt / Top',
    description: 'Shirts, tees, polos, sweaters, jackets & blazers',
    examples: 'Oxford shirts, relaxed tees, knit sweaters, jackets',
  },
  {
    key: 'Pants and Trousers',
    label: 'Pants and Trousers',
    singular: 'Pants / Trousers',
    description: 'Chinos, denim, tailored trousers, cargo pants & shorts',
    examples: 'Tailored trousers, raw denim, chinos, linen pants',
  },
  {
    key: 'Shoes',
    label: 'Shoes',
    singular: 'Shoes',
    description: 'Sneakers, dress shoes, loafers, boots & sandals',
    examples: 'Minimalist sneakers, leather loafers, Chelsea boots, derbies',
  },
  {
    key: 'Watches and Accessories',
    label: 'Watches and Accessories',
    singular: 'Watch / Accessory',
    description: 'Watches, leather belts, eyewear, scarves & bags',
    examples: 'Chronograph watches, leather belts, classic sunglasses',
  },
];
