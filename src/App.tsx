import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { WardrobeManager } from './components/WardrobeManager';
import { OutfitPlanner } from './components/OutfitPlanner';
import { SavedOutfits } from './components/SavedOutfits';
import { ProfileView } from './components/ProfileView';
import { AuthModal } from './components/AuthModal';
import { UploadItemModal } from './components/UploadItemModal';
import { OutfitGeneratorModal } from './components/OutfitGeneratorModal';
import { CollectionScanModal } from './components/CollectionScanModal';
import { ClothingCategory } from './types';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { user, activeTab, toast } = useApp();

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [generatorModalOpen, setGeneratorModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [uploadDefaultCategory, setUploadDefaultCategory] = useState<ClothingCategory | undefined>(undefined);

  const handleOpenUpload = (defaultCategory?: string) => {
    setUploadDefaultCategory(defaultCategory as ClothingCategory | undefined);
    setUploadModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-zinc-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Navigation */}
      <Navbar
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenGenerator={() => setGeneratorModalOpen(true)}
        onOpenUpload={() => handleOpenUpload()}
        onOpenScan={() => setScanModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {!user ? (
          <LandingPage
            onGetStarted={() => setAuthModalOpen(true)}
            onLogIn={() => setAuthModalOpen(true)}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                onOpenGenerator={() => setGeneratorModalOpen(true)}
                onOpenUpload={handleOpenUpload}
                onOpenScan={() => setScanModalOpen(true)}
              />
            )}

            {activeTab === 'wardrobe' && (
              <WardrobeManager
                onOpenUpload={handleOpenUpload}
                onOpenGenerator={() => setGeneratorModalOpen(true)}
                onOpenScan={() => setScanModalOpen(true)}
              />
            )}

            {activeTab === 'planner' && (
              <OutfitPlanner
                onOpenGenerator={() => setGeneratorModalOpen(true)}
                onOpenUpload={() => handleOpenUpload()}
              />
            )}

            {activeTab === 'saved' && (
              <SavedOutfits
                onOpenGenerator={() => setGeneratorModalOpen(true)}
              />
            )}

            {activeTab === 'profile' && <ProfileView />}
          </>
        )}
      </main>

      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-zinc-950 text-white shadow-xl text-xs font-semibold animate-in slide-in-from-bottom duration-200 border border-zinc-800">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <UploadItemModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        defaultCategory={uploadDefaultCategory}
      />

      <OutfitGeneratorModal
        isOpen={generatorModalOpen}
        onClose={() => setGeneratorModalOpen(false)}
      />

      <CollectionScanModal
        isOpen={scanModalOpen}
        onClose={() => setScanModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
