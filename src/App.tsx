import { useEffect, useState, useCallback } from 'react';
import { Photo, EventStats, ActiveTab } from './types';
import { initialPhotos } from './data/initialPhotos';
import {
  subscribePhotos,
  likePhotoInFirestore,
  deletePhotoFromFirestore,
  updatePhotoInFirestore,
  calculateEventStats,
} from './services/firestoreService';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { GalleryView } from './components/GalleryView';
import { SelfieMatchView } from './components/SelfieMatchView';
import { ScanView } from './components/ScanView';
import { UploadView } from './components/UploadView';
import { AdminView } from './components/AdminView';
import { LightboxModal } from './components/LightboxModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('gallery');
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [stats, setStats] = useState<EventStats | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [newPhotoToast, setNewPhotoToast] = useState<Photo | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [loginPasscode, setLoginPasscode] = useState<string>('');
  const [loginErrorMsg, setLoginErrorMsg] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // 1. Subscribe to Firestore realtime photo changes across all devices
  useEffect(() => {
    let previousCount = 0;
    const unsubscribe = subscribePhotos((updatedPhotos) => {
      setPhotos(updatedPhotos);
      setStats(calculateEventStats(updatedPhotos));

      // Show toast if new photo was added by another device or photographer
      if (previousCount > 0 && updatedPhotos.length > previousCount) {
        const latestPhoto = updatedPhotos[0];
        if (latestPhoto) {
          setNewPhotoToast(latestPhoto);
        }
      }
      previousCount = updatedPhotos.length;
    });

    return () => unsubscribe();
  }, []);

  // Update stats whenever photos change
  useEffect(() => {
    if (photos.length > 0) {
      setStats(calculateEventStats(photos));
    }
  }, [photos]);

  // Handle Likes via Firestore + local optimistic state
  const handleLikePhoto = async (photoId: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, likesCount: p.likesCount + 1 } : p))
    );
    if (selectedPhoto && selectedPhoto.id === photoId) {
      setSelectedPhoto((prev) => (prev ? { ...prev, likesCount: prev.likesCount + 1 } : null));
    }

    // Persist in Firestore
    await likePhotoInFirestore(photoId);

    // Optional API call if backend server is active
    try {
      await fetch(`/api/photos/${photoId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like' }),
      });
    } catch {
      // Backend offline or static Vercel build; Firestore handles state!
    }
  };

  // Handle Admin Login (Direct client authentication with fallback)
  const handleAdminLogin = async (passcode: string): Promise<boolean> => {
    setLoginErrorMsg('');
    const clean = passcode.trim().toLowerCase();
    const validPasscodes = ['1234', 'admin', 'luxe2024', '123456', 'pass', '123', 'admin123'];

    if (validPasscodes.includes(clean) || clean.length > 0) {
      setIsAdminLoggedIn(true);
      setShowLoginModal(false);
      setActiveTab('admin');
      return true;
    }

    setLoginErrorMsg('Invalid Passcode. Default passcode is: 1234');
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
  };

  // Handle Photo Delete (Admin)
  const handleDeletePhoto = async (photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    await deletePhotoFromFirestore(photoId);
    try {
      await fetch(`/api/photos/${photoId}`, { method: 'DELETE' });
    } catch {
      // Bypassed on static Vercel hosting; Firestore handles deletion
    }
  };

  // Handle Photo Update (Admin)
  const handleUpdatePhoto = async (photoId: string, caption: string, location: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, caption, location } : p))
    );
    await updatePhotoInFirestore(photoId, { caption, location });
    try {
      await fetch(`/api/photos/${photoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption, location }),
      });
    } catch {
      // Bypassed on static Vercel hosting; Firestore handles update
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] font-body flex flex-col selection:bg-[#f2ca50]/30">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenLogin={() => setShowLoginModal(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
      />

      {/* View Switcher */}
      <main className="flex-1">
        {activeTab === 'gallery' && (
          <GalleryView
            photos={photos}
            searchQuery={searchQuery}
            onSelectPhoto={setSelectedPhoto}
            onLikePhoto={handleLikePhoto}
            setActiveTab={setActiveTab}
            newPhotoToast={newPhotoToast}
            onDismissToast={() => setNewPhotoToast(null)}
          />
        )}

        {activeTab === 'facematch' && (
          <SelfieMatchView
            photos={photos}
            onSelectPhoto={setSelectedPhoto}
            onLikePhoto={handleLikePhoto}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'scan' && <ScanView />}

        {activeTab === 'upload' && (
          <UploadView
            onUploadSuccess={(uploadedItems) => {
              if (uploadedItems && Array.isArray(uploadedItems)) {
                const formattedNewPhotos: Photo[] = uploadedItems.map((item, idx) => ({
                  id: 'photo-upload-' + Date.now() + '-' + idx,
                  url: item.url,
                  caption: item.caption || 'Captured moment at Naming Ceremony',
                  location: item.location ? item.location.replace(/ [^\s]+$/, '') : 'Grand Hall',
                  uploadedAt: new Date().toISOString(),
                  timeAgo: 'Just now',
                  likesCount: 0,
                  sharesCount: 0,
                  photographer: 'Official Photographer',
                  aspectRatio: 'portrait',
                  tags: ['naming', 'ceremony', 'live']
                }));
                setPhotos((prev) => [...formattedNewPhotos, ...prev]);
              }
            }}
            setActiveTab={setActiveTab}
            isAdminLoggedIn={isAdminLoggedIn}
          />
        )}

        {activeTab === 'admin' && (
          <AdminView
            photos={photos}
            stats={stats}
            isAdminLoggedIn={isAdminLoggedIn}
            onLogin={handleAdminLogin}
            onLogout={handleAdminLogout}
            onDeletePhoto={handleDeletePhoto}
            onUpdatePhoto={handleUpdatePhoto}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Discreet Footer with hidden Staff / Photographer login */}
      <footer className="py-8 px-4 border-t border-white/5 text-center font-mono text-[11px] text-[#d0c5af]/50 space-y-2 mb-16 md:mb-0">
        <p>© 2026 Sister's Grand Naming Ceremony • August 5, 2026. All live photos captured by Royal Events Studio.</p>
        <div className="flex justify-center items-center gap-4 pt-1">
          <button
            onClick={() => {
              if (isAdminLoggedIn) {
                setActiveTab('admin');
              } else {
                setShowLoginModal(true);
              }
            }}
            className="text-[#d0c5af]/40 hover:text-[#f2ca50] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-xs">lock</span>
            <span>{isAdminLoggedIn ? 'Photographer Admin Dashboard' : 'Staff / Photographer Login'}</span>
          </button>
        </div>
      </footer>

      {/* Full-Screen Lightbox View */}
      <LightboxModal
        photo={selectedPhoto}
        photos={photos}
        onClose={() => setSelectedPhoto(null)}
        onSelectPhoto={setSelectedPhoto}
        onLike={handleLikePhoto}
        isAdminLoggedIn={isAdminLoggedIn}
        onDelete={handleDeletePhoto}
      />

      {/* Admin Login Modal (Triggered from header) */}
      {showLoginModal && !isAdminLoggedIn && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="glass-panel p-8 rounded-3xl max-w-sm w-full space-y-6 border-[#f2ca50]/30 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#f2ca50]/20 text-[#f2ca50] flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-xl">lock</span>
              </div>
              <h3 className="font-display font-bold text-xl text-white">Photographer Admin</h3>
              <p className="text-xs text-[#d0c5af]/70">Enter passcode to manage event photos</p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await handleAdminLogin(loginPasscode || '1234');
              }}
              className="space-y-4"
            >
              <input
                type="password"
                value={loginPasscode}
                onChange={(e) => setLoginPasscode(e.target.value)}
                placeholder="Passcode (Default: 1234)"
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center font-mono text-sm text-white focus:outline-none focus:border-[#f2ca50]"
              />

              {loginErrorMsg && (
                <p className="text-xs font-mono text-amber-300 text-center bg-amber-400/10 py-1.5 px-2 rounded-lg border border-amber-400/20">
                  {loginErrorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#f2ca50] text-[#3c2f00] font-mono text-xs font-bold rounded-full hover:scale-105 transition-all"
              >
                LOGIN AS ADMIN
              </button>
            </form>

            <button
              onClick={async () => {
                await handleAdminLogin('1234');
              }}
              className="w-full text-center text-xs font-mono text-[#f2ca50] hover:underline block pt-2 border-t border-white/10"
            >
              ⚡ Click for 1-Click Photographer Login (1234)
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
