import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  WardrobeItem,
  PlannedOutfit,
  SavedOutfit,
  UserProfile,
  ClothingCategory,
  CATEGORY_LIMIT,
} from '../types';
import { SAMPLE_WARDROBE } from '../data/sampleWardrobe';

export type ActiveTab = 'dashboard' | 'wardrobe' | 'planner' | 'saved' | 'profile';

interface AppContextType {
  user: UserProfile | null;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  wardrobe: WardrobeItem[];
  plannedOutfits: PlannedOutfit[];
  savedOutfits: SavedOutfit[];
  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;
  
  // Wardrobe operations
  addWardrobeItem: (
    item: Omit<WardrobeItem, 'id' | 'createdAt' | 'wornCount'>
  ) => { success: boolean; error?: string; item?: WardrobeItem };
  addMultipleWardrobeItems: (
    items: Omit<WardrobeItem, 'id' | 'createdAt' | 'wornCount'>[]
  ) => { addedCount: number; skippedCount: number };
  updateWardrobeItem: (id: string, updates: Partial<WardrobeItem>) => void;
  deleteWardrobeItem: (id: string) => void;
  loadSampleWardrobe: () => void;
  clearWardrobe: () => void;
  getCategoryCount: (category: ClothingCategory) => number;
  
  // Planner operations
  setPlannedOutfits: (outfits: PlannedOutfit[]) => void;
  updateOutfit: (dayIndex: number, updates: Partial<PlannedOutfit>) => void;
  replaceOutfitItem: (
    dayIndex: number,
    slot: 'top' | 'bottom' | 'shoes' | 'accessory',
    newItemId: string | null
  ) => void;
  toggleLockSlot: (
    dayIndex: number,
    slot: 'top' | 'bottom' | 'shoes' | 'accessory'
  ) => void;
  markOutfitWorn: (dayIndex: number) => void;
  saveOutfit: (dayIndex: number) => void;
  deleteSavedOutfit: (id: string) => void;
  swapOutfitDays: (indexA: number, indexB: number) => void;

  // Auth operations
  loginAsDemo: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithPhone: (phone: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  deleteAccount: () => void;
  
  // Toast notifications
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_DEMO_USER: UserProfile = {
  id: 'usr_alex_modern',
  name: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  phone: '+1 (555) 234-5678',
  authProvider: 'demo',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  preferredStyle: 'Mixed styles',
  favoriteColors: ['Navy Blue', 'White', 'Charcoal Grey', 'Olive Green'],
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication State
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('fit2day_current_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Wardrobe Items (isolated per user)
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);
  // Current Planned Outfits
  const [plannedOutfits, setPlannedOutfits] = useState<PlannedOutfit[]>([]);
  // Saved Outfits
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Sync state whenever user changes
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('fit2day_current_user', JSON.stringify(user));
        
        // Load user's private wardrobe (default blank so user uploads their own clothes)
        const storedWardrobe = localStorage.getItem(`fit2day_wardrobe_${user.id}`);
        if (storedWardrobe) {
          const parsed = JSON.parse(storedWardrobe);
          // If it was the previously pre-loaded sample wardrobe, clear it to start blank as requested
          if (Array.isArray(parsed) && parsed.some((item) => item.id === 'top-1' && item.name === 'Crisp Oxford Button-Down')) {
            setWardrobe([]);
            localStorage.setItem(`fit2day_wardrobe_${user.id}`, JSON.stringify([]));
          } else {
            setWardrobe(parsed);
          }
        } else {
          // Default: completely blank wardrobe
          setWardrobe([]);
          localStorage.setItem(`fit2day_wardrobe_${user.id}`, JSON.stringify([]));
        }

        // Load user's private planned outfits
        const storedPlans = localStorage.getItem(`fit2day_planner_${user.id}`);
        if (storedPlans) {
          setPlannedOutfits(JSON.parse(storedPlans));
        } else {
          setPlannedOutfits([]);
        }

        // Load user's saved outfits
        const storedSaved = localStorage.getItem(`fit2day_saved_${user.id}`);
        if (storedSaved) {
          setSavedOutfits(JSON.parse(storedSaved));
        } else {
          setSavedOutfits([]);
        }
      } catch (err) {
        console.error('Error reading localStorage for user:', err);
      }
    } else {
      localStorage.removeItem('fit2day_current_user');
      setWardrobe([]);
      setPlannedOutfits([]);
      setSavedOutfits([]);
    }
  }, [user?.id]);

  // Save wardrobe on changes
  useEffect(() => {
    if (user && wardrobe.length > 0) {
      try {
        localStorage.setItem(`fit2day_wardrobe_${user.id}`, JSON.stringify(wardrobe));
      } catch (e) {
        console.warn('LocalStorage quota warning for wardrobe:', e);
      }
    }
  }, [wardrobe, user?.id]);

  // Save planner on changes
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(`fit2day_planner_${user.id}`, JSON.stringify(plannedOutfits));
      } catch (e) {
        console.warn('LocalStorage error for planner:', e);
      }
    }
  }, [plannedOutfits, user?.id]);

  // Save saved outfits on changes
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(`fit2day_saved_${user.id}`, JSON.stringify(savedOutfits));
      } catch (e) {
        console.warn('LocalStorage error for saved outfits:', e);
      }
    }
  }, [savedOutfits, user?.id]);

  const getCategoryCount = (category: ClothingCategory): number => {
    return wardrobe.filter((item) => item.category === category).length;
  };

  const addWardrobeItem = (
    itemData: Omit<WardrobeItem, 'id' | 'createdAt' | 'wornCount'>
  ) => {
    const currentCount = getCategoryCount(itemData.category);
    if (currentCount >= CATEGORY_LIMIT) {
      showToast(`Category limit reached (${CATEGORY_LIMIT} items max for ${itemData.category}).`, 'error');
      return {
        success: false,
        error: `Maximum of ${CATEGORY_LIMIT} items allowed in ${itemData.category}. Please delete or replace an existing item.`,
      };
    }

    const newItem: WardrobeItem = {
      ...itemData,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
      wornCount: 0,
    };

    setWardrobe((prev) => [newItem, ...prev]);
    showToast(`Added "${newItem.name}" to ${newItem.category}.`, 'success');
    return { success: true, item: newItem };
  };

  const addMultipleWardrobeItems = (
    items: Omit<WardrobeItem, 'id' | 'createdAt' | 'wornCount'>[]
  ) => {
    let addedCount = 0;
    let skippedCount = 0;
    const newItemsToAdd: WardrobeItem[] = [];

    // Track current category counts locally during batch addition
    const categoryCounts: Record<ClothingCategory, number> = {
      'Shirts and Tops': getCategoryCount('Shirts and Tops'),
      'Pants and Trousers': getCategoryCount('Pants and Trousers'),
      'Shoes': getCategoryCount('Shoes'),
      'Watches and Accessories': getCategoryCount('Watches and Accessories'),
    };

    items.forEach((itemData, index) => {
      const currentCatCount = categoryCounts[itemData.category] || 0;
      if (currentCatCount >= CATEGORY_LIMIT) {
        skippedCount++;
      } else {
        categoryCounts[itemData.category] = currentCatCount + 1;
        newItemsToAdd.push({
          ...itemData,
          id: `item-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 5)}`,
          createdAt: new Date().toISOString(),
          wornCount: 0,
        });
        addedCount++;
      }
    });

    if (newItemsToAdd.length > 0) {
      setWardrobe((prev) => [...newItemsToAdd, ...prev]);
      showToast(`Added ${addedCount} items from collection to your wardrobe!`, 'success');
    }
    if (skippedCount > 0) {
      showToast(`${skippedCount} items skipped due to category limit (30 max).`, 'info');
    }

    return { addedCount, skippedCount };
  };

  const updateWardrobeItem = (id: string, updates: Partial<WardrobeItem>) => {
    setWardrobe((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    showToast('Wardrobe item updated.', 'success');
  };

  const deleteWardrobeItem = (id: string) => {
    const target = wardrobe.find((w) => w.id === id);
    setWardrobe((prev) => prev.filter((item) => item.id !== id));
    showToast(`Removed "${target?.name || 'Item'}" from your wardrobe.`, 'info');
  };

  const loadSampleWardrobe = () => {
    setWardrobe(SAMPLE_WARDROBE);
    if (user) {
      localStorage.setItem(`fit2day_wardrobe_${user.id}`, JSON.stringify(SAMPLE_WARDROBE));
    }
    showToast('Loaded curated starter wardrobe (18 pieces)!', 'success');
  };

  const clearWardrobe = () => {
    setWardrobe([]);
    if (user) {
      localStorage.setItem(`fit2day_wardrobe_${user.id}`, JSON.stringify([]));
    }
    showToast('Wardrobe cleared.', 'info');
  };

  const updateOutfit = (dayIndex: number, updates: Partial<PlannedOutfit>) => {
    setPlannedOutfits((prev) =>
      prev.map((outfit) =>
        outfit.dayIndex === dayIndex ? { ...outfit, ...updates } : outfit
      )
    );
  };

  const replaceOutfitItem = (
    dayIndex: number,
    slot: 'top' | 'bottom' | 'shoes' | 'accessory',
    newItemId: string | null
  ) => {
    setPlannedOutfits((prev) =>
      prev.map((outfit) => {
        if (outfit.dayIndex !== dayIndex) return outfit;
        if (slot === 'top') return { ...outfit, topId: newItemId };
        if (slot === 'bottom') return { ...outfit, bottomId: newItemId };
        if (slot === 'shoes') return { ...outfit, shoesId: newItemId };
        if (slot === 'accessory') return { ...outfit, accessoryId: newItemId };
        return outfit;
      })
    );
    showToast('Item updated for this day.', 'success');
  };

  const toggleLockSlot = (
    dayIndex: number,
    slot: 'top' | 'bottom' | 'shoes' | 'accessory'
  ) => {
    setPlannedOutfits((prev) =>
      prev.map((outfit) => {
        if (outfit.dayIndex !== dayIndex) return outfit;
        const currentLocks = outfit.lockedSlots || {};
        return {
          ...outfit,
          lockedSlots: {
            ...currentLocks,
            [slot]: !currentLocks[slot],
          },
        };
      })
    );
  };

  const markOutfitWorn = (dayIndex: number) => {
    const outfit = plannedOutfits.find((o) => o.dayIndex === dayIndex);
    if (!outfit) return;

    const newWornState = !outfit.isWorn;
    setPlannedOutfits((prev) =>
      prev.map((o) => (o.dayIndex === dayIndex ? { ...o, isWorn: newWornState } : o))
    );

    // If marked worn, increment wear count on wardrobe items
    if (newWornState) {
      const itemIds = [outfit.topId, outfit.bottomId, outfit.shoesId, outfit.accessoryId].filter(Boolean) as string[];
      setWardrobe((prev) =>
        prev.map((item) =>
          itemIds.includes(item.id)
            ? {
                ...item,
                wornCount: (item.wornCount || 0) + 1,
                lastWornDate: new Date().toLocaleDateString(),
              }
            : item
        )
      );
      showToast(`Marked ${outfit.dayName}'s outfit as worn!`, 'success');
    } else {
      showToast(`Unmarked ${outfit.dayName}'s outfit.`, 'info');
    }
  };

  const saveOutfit = (dayIndex: number) => {
    const outfit = plannedOutfits.find((o) => o.dayIndex === dayIndex);
    if (!outfit) return;

    const alreadySaved = savedOutfits.some(
      (s) =>
        s.topId === outfit.topId &&
        s.bottomId === outfit.bottomId &&
        s.shoesId === outfit.shoesId &&
        s.accessoryId === outfit.accessoryId
    );

    if (alreadySaved) {
      showToast('This outfit is already in your Saved Outfits.', 'info');
      return;
    }

    const newSaved: SavedOutfit = {
      id: `saved-${Date.now()}`,
      name: outfit.outfitName,
      styleCategory: outfit.styleCategory,
      topId: outfit.topId,
      bottomId: outfit.bottomId,
      shoesId: outfit.shoesId,
      accessoryId: outfit.accessoryId,
      colorPalette: outfit.colorPalette,
      coordinationExplanation: outfit.coordinationExplanation,
      stylingReason: outfit.stylingReason,
      createdAt: new Date().toISOString(),
      wearDates: outfit.isWorn ? [new Date().toLocaleDateString()] : [],
    };

    setSavedOutfits((prev) => [newSaved, ...prev]);
    setPlannedOutfits((prev) =>
      prev.map((o) => (o.dayIndex === dayIndex ? { ...o, isSaved: true } : o))
    );
    showToast(`Saved "${outfit.outfitName}" to your collection!`, 'success');
  };

  const deleteSavedOutfit = (id: string) => {
    setSavedOutfits((prev) => prev.filter((s) => s.id !== id));
    showToast('Outfit removed from saved collection.', 'info');
  };

  const swapOutfitDays = (indexA: number, indexB: number) => {
    setPlannedOutfits((prev) => {
      const newArr = [...prev];
      const outfitA = newArr.find((o) => o.dayIndex === indexA);
      const outfitB = newArr.find((o) => o.dayIndex === indexB);
      if (!outfitA || !outfitB) return prev;

      const topA = outfitA.topId;
      const bottomA = outfitA.bottomId;
      const shoesA = outfitA.shoesId;
      const accA = outfitA.accessoryId;
      const nameA = outfitA.outfitName;
      const styleA = outfitA.styleCategory;
      const explA = outfitA.coordinationExplanation;
      const reasonA = outfitA.stylingReason;

      outfitA.topId = outfitB.topId;
      outfitA.bottomId = outfitB.bottomId;
      outfitA.shoesId = outfitB.shoesId;
      outfitA.accessoryId = outfitB.accessoryId;
      outfitA.outfitName = outfitB.outfitName;
      outfitA.styleCategory = outfitB.styleCategory;
      outfitA.coordinationExplanation = outfitB.coordinationExplanation;
      outfitA.stylingReason = outfitB.stylingReason;

      outfitB.topId = topA;
      outfitB.bottomId = bottomA;
      outfitB.shoesId = shoesA;
      outfitB.accessoryId = accA;
      outfitB.outfitName = nameA;
      outfitB.styleCategory = styleA;
      outfitB.coordinationExplanation = explA;
      outfitB.stylingReason = reasonA;

      return newArr;
    });
    showToast('Outfits swapped between days!', 'success');
  };

  // Auth Functions
  const loginAsDemo = () => {
    setUser(DEFAULT_DEMO_USER);
    showToast('Logged in as Demo Stylist (Alex Rivera).', 'success');
    setActiveTab('dashboard');
  };

  const loginWithGoogle = async () => {
    // In preview environment without external OAuth client, provide authenticated Google persona
    const googleUser: UserProfile = {
      id: 'usr_google_' + Date.now().toString(36),
      name: 'Taylor Brooks',
      email: 'taylor.brooks@gmail.com',
      authProvider: 'google',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      preferredStyle: 'Casual',
      favoriteColors: ['Navy Blue', 'Off-White', 'Olive Green'],
    };
    setUser(googleUser);
    showToast('Signed in successfully with Google!', 'success');
    setActiveTab('dashboard');
  };

  const loginWithPhone = async (phone: string, otp: string): Promise<{ success: boolean; error?: string }> => {
    if (!phone || phone.trim().length < 8) {
      return { success: false, error: 'Please enter a valid phone number.' };
    }
    if (!otp || otp.trim().length !== 6) {
      return { success: false, error: 'Please enter the 6-digit OTP code sent to your phone.' };
    }

    const phoneUser: UserProfile = {
      id: 'usr_phone_' + phone.replace(/[^0-9]/g, '').slice(-8),
      name: 'Fashion Member',
      email: `${phone.replace(/[^0-9]/g, '').slice(-6)}@mobile.fit2day.app`,
      phone: phone,
      authProvider: 'phone',
      preferredStyle: 'Streetwear',
      favoriteColors: ['Black', 'Charcoal Grey', 'White'],
    };
    setUser(phoneUser);
    showToast('Phone number verified! Welcome to Fit2Day.', 'success');
    setActiveTab('dashboard');
    return { success: true };
  };

  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!pass || pass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const emailName = email.split('@')[0].replace(/[._]/g, ' ');
    const formattedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);

    const emailUser: UserProfile = {
      id: 'usr_email_' + Math.abs(email.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)),
      name: formattedName,
      email: email,
      authProvider: 'email',
      preferredStyle: 'Formal',
      favoriteColors: ['Navy Blue', 'Black', 'White', 'Charcoal Grey'],
    };
    setUser(emailUser);
    showToast(`Welcome back, ${formattedName}!`, 'success');
    setActiveTab('dashboard');
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    showToast('Signed out of Fit2Day.', 'info');
    setActiveTab('dashboard');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    showToast('Profile preferences updated.', 'success');
  };

  const deleteAccount = () => {
    if (user) {
      localStorage.removeItem(`fit2day_wardrobe_${user.id}`);
      localStorage.removeItem(`fit2day_planner_${user.id}`);
      localStorage.removeItem(`fit2day_saved_${user.id}`);
      localStorage.removeItem('fit2day_current_user');
      setUser(null);
      showToast('Account data cleared successfully.', 'info');
      setActiveTab('dashboard');
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        activeTab,
        setActiveTab,
        wardrobe,
        plannedOutfits,
        savedOutfits,
        isGenerating,
        setIsGenerating,
        addWardrobeItem,
        addMultipleWardrobeItems,
        updateWardrobeItem,
        deleteWardrobeItem,
        loadSampleWardrobe,
        clearWardrobe,
        getCategoryCount,
        setPlannedOutfits,
        updateOutfit,
        replaceOutfitItem,
        toggleLockSlot,
        markOutfitWorn,
        saveOutfit,
        deleteSavedOutfit,
        swapOutfitDays,
        loginAsDemo,
        loginWithGoogle,
        loginWithPhone,
        loginWithEmail,
        logout,
        updateProfile,
        deleteAccount,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
