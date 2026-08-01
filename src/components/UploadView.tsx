import React, { useRef, useState } from 'react';
import { SelectedMedia, ActiveTab } from '../types';
import { addPhotoToFirestore } from '../services/firestoreService';

interface UploadViewProps {
  onUploadSuccess: (newPhotos: Array<{ url: string; caption: string; location: string }>) => void;
  setActiveTab: (tab: ActiveTab) => void;
  isAdminLoggedIn?: boolean;
  onOpenLogin?: () => void;
}

const defaultLocations = ['Pooja Mandap 🪔', 'Cradle Area 🍼', 'Grand Hall 🏛️', 'Dining & Feast 🍱', 'Welcome Entrance 🌺'];

export const UploadView: React.FC<UploadViewProps> = ({
  onUploadSuccess,
  setActiveTab,
  isAdminLoggedIn = false,
  onOpenLogin,
}) => {
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  // If user is not logged in as Admin, show Photographer Authorization Lock
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-5 max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl space-y-6 border-[#f2ca50]/30 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#f2ca50]/20 text-[#f2ca50] flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-3xl">lock</span>
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs text-[#f2ca50] tracking-widest uppercase font-bold">
              PHOTOGRAPHER ADMIN PORTAL
            </span>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white">
              Official Photo Upload
            </h2>
            <p className="text-sm text-[#d0c5af] max-w-md mx-auto leading-relaxed">
              Photo uploads are restricted to official photographers to ensure high quality and real-time ceremony coverage.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <button
              onClick={() => onOpenLogin?.()}
              className="w-full py-3.5 bg-[#f2ca50] text-[#3c2f00] font-mono text-xs font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#f2ca50]/20 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">vpn_key</span>
              LOG IN AS PHOTOGRAPHER ADMIN
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className="w-full py-3 glass-card text-[#d0c5af] hover:text-white font-mono text-xs font-bold rounded-full transition-all"
            >
              RETURN TO GUEST GALLERY
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pre-loaded sample selected media for Naming Ceremony if empty
  const [selectedMediaList, setSelectedMediaList] = useState<SelectedMedia[]>([
    {
      id: 'sel-1',
      previewUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDs64HIEYvLup-cqa5Gdr2grVVZMziwu-En9sDAzh91DTPSDpNxFmC-tc26yHLgetEy2ORPiS32i2iYl7YuSRoBuaZENTD5F3F7G61pd3gTi6vOgPUa7GtWDTuBZhb9tOezwjl4fAu23pxdA5B5WbXpyZ45lg5B2N8U3xtL-x2O_EnHucEugZxUNX3vHnQNdKrSCTtvZ_jJz_ndQiiQuLmo6QIbN8Ge2-wJXgMwB03uaTWBkdwhUhEo',
      caption: 'Floral cradle decoration setup',
      location: 'Cradle Area',
    },
    {
      id: 'sel-2',
      previewUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCZZKsi1t12ARBHNS28ZNB0HBhbIdp1NYK6iVOnrnHLlAkQ6ErLor6EvTqRIJ1vQLGkNwzPFfXz8tMD8RDHc6UYfYgat_ZPOIMWghQ4SzbXUVw1FVSbNWQBHIrLgYY-9p03S4qekudFNdtxFJFWGi1sgR-hMRUmXZkzxjMOXhwymeb0Bv4ZnEw024WfwbJSzmbR5bNGy8_xYMP8XZBXIGjBs2PQv847geQdrQKWo51dMeCd66sL4kdG',
      caption: 'Sacred Pooja Mandap ritual setup',
      location: 'Pooja Mandap',
    },
  ]);

  const [activeCaption, setActiveCaption] = useState<string>('Blessings at Naming Ceremony');
  const [activeLocation, setActiveLocation] = useState<string>('Pooja Mandap');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [showToast, setShowToast] = useState<boolean>(false);

  // File selection handler
  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newMedia: SelectedMedia[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewUrl = e.target?.result as string;
        setSelectedMediaList((prev) => [
          ...prev,
          {
            id: 'sel-' + Date.now() + '-' + Math.random(),
            file,
            previewUrl,
            caption: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            location: activeLocation,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveMedia = (id: string) => {
    setSelectedMediaList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUploadTrigger = async () => {
    if (selectedMediaList.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate real-time progress & compression step
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 20) + 10;
      });
    }, 250);

    setTimeout(async () => {
      clearInterval(interval);
      setUploadProgress(100);

      // Save uploaded items to Firestore and API
      const itemsToUpload = selectedMediaList.map((item) => ({
        url: item.previewUrl,
        caption: item.caption || activeCaption || 'Captured moment at Naming Ceremony 👶✨',
        location: item.location || activeLocation || 'Grand Hall',
      }));

      // Add to Firestore so all devices get real-time persisted updates
      for (const item of itemsToUpload) {
        try {
          await addPhotoToFirestore({
            url: item.url,
            caption: item.caption,
            location: item.location.replace(/ [^\s]+$/, ''),
            uploadedAt: new Date().toISOString(),
            timeAgo: 'Just now',
            likesCount: 0,
            sharesCount: 0,
            photographer: 'Official Photographer',
            aspectRatio: 'portrait',
            tags: ['naming', 'ceremony', 'live'],
          });
        } catch (fsErr) {
          console.error('Failed to save to Firestore:', fsErr);
        }
      }

      try {
        await fetch('/api/photos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ photos: itemsToUpload }),
        });
      } catch (err) {
        console.error('Upload API error:', err);
      }

      onUploadSuccess(itemsToUpload);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setShowToast(true);
        setSelectedMediaList([]);

        // Auto hide toast after 5s or switch to gallery
        setTimeout(() => {
          setShowToast(false);
          setActiveTab('gallery');
        }, 3000);
      }, 400);
    }, 1800);
  };

  return (
    <div className="min-h-screen pt-24 pb-32 px-5 md:px-16 max-w-[1440px] mx-auto w-full">
      {/* Hidden native file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFilesSelected(e.target.files)}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFilesSelected(e.target.files)}
      />

      {/* Header Section matching Screenshot 3 */}
      <div className="mb-10 animate-in fade-in duration-300">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-[#e5e2e1] mb-2">
          Capture the Moment
        </h2>
        <p className="font-body text-base text-[#d0c5af]/80">
          Share your exclusive perspective with the community.
        </p>
      </div>

      {/* Main Action Area: Glassmorphic Buttons matching Screenshot 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Camera Button */}
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="glass-button h-48 rounded-2xl flex flex-col items-center justify-center group hover:border-[#f2ca50]/50 transition-all cursor-pointer"
        >
          <div className="w-16 h-16 rounded-full bg-[#f2ca50]/10 flex items-center justify-center mb-4 group-hover:bg-[#f2ca50]/20 group-hover:scale-110 transition-all">
            <span className="material-symbols-outlined text-[#f2ca50] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              photo_camera
            </span>
          </div>
          <span className="font-display font-semibold text-xl text-[#e5e2e1]">Camera</span>
          <span className="font-mono text-xs text-[#d0c5af]/60 mt-1">Live Capture</span>
        </button>

        {/* Gallery Button */}
        <button
          onClick={() => galleryInputRef.current?.click()}
          className="glass-button h-48 rounded-2xl flex flex-col items-center justify-center group hover:border-[#b3c5ff]/50 transition-all cursor-pointer"
        >
          <div className="w-16 h-16 rounded-full bg-[#b3c5ff]/10 flex items-center justify-center mb-4 group-hover:bg-[#b3c5ff]/20 group-hover:scale-110 transition-all">
            <span className="material-symbols-outlined text-[#b3c5ff] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              gallery_thumbnail
            </span>
          </div>
          <span className="font-display font-semibold text-xl text-[#e5e2e1]">Gallery</span>
          <span className="font-mono text-xs text-[#d0c5af]/60 mt-1">Choose Existing</span>
        </button>
      </div>

      {/* Selected Media Section matching Screenshot 3 */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-semibold text-xl text-[#e5e2e1]">Selected Media</h3>
          <span className="font-mono text-xs font-bold text-[#f2ca50] tracking-wider uppercase">
            {selectedMediaList.length} FILE{selectedMediaList.length === 1 ? '' : 'S'} SELECTED
          </span>
        </div>

        {selectedMediaList.length === 0 ? (
          <div
            onClick={() => galleryInputRef.current?.click()}
            className="aspect-[3/1] rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-[#d0c5af]/50 hover:border-[#f2ca50]/40 hover:text-[#f2ca50] transition-all cursor-pointer glass-panel p-8 text-center"
          >
            <span className="material-symbols-outlined text-4xl mb-2">add_photo_alternate</span>
            <span className="font-mono text-xs tracking-wider">TAP HERE OR DRAG & DROP PHOTOS TO UPLOAD</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {selectedMediaList.map((item) => (
              <div
                key={item.id}
                className="relative aspect-square rounded-2xl overflow-hidden glass-panel group border-white/10"
              >
                <img
                  src={item.previewUrl}
                  alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  onClick={() => handleRemoveMedia(item.id)}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                  title="Remove"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            ))}

            {/* Add More Card matching Screenshot 3 */}
            <div
              onClick={() => galleryInputRef.current?.click()}
              className="aspect-square rounded-2xl border-2 border-dashed border-white/15 flex flex-col items-center justify-center text-[#d0c5af]/60 hover:border-[#f2ca50]/50 hover:text-[#f2ca50] transition-all cursor-pointer glass-panel"
            >
              <span className="material-symbols-outlined text-3xl mb-2">add_circle</span>
              <span className="font-mono text-xs tracking-wider font-semibold">ADD MORE</span>
            </div>
          </div>
        )}
      </section>

      {/* Upload Form Controls */}
      {selectedMediaList.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl mb-12 space-y-4 max-w-2xl mx-auto border-white/10">
          <div>
            <label className="block font-mono text-xs text-[#d0c5af]/80 mb-2 uppercase">
              Caption / Moment Description
            </label>
            <input
              type="text"
              value={activeCaption}
              onChange={(e) => setActiveCaption(e.target.value)}
              placeholder="e.g., Grand entrance at Gala Premiere..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#f2ca50]"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-[#d0c5af]/80 mb-2 uppercase">
              Event Location Tag
            </label>
            <div className="flex flex-wrap gap-2">
              {defaultLocations.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setActiveLocation(loc)}
                  className={`px-3.5 py-1.5 rounded-full font-mono text-xs transition-all ${
                    activeLocation === loc
                      ? 'bg-[#f2ca50] text-[#3c2f00] font-bold'
                      : 'bg-white/5 text-[#d0c5af] hover:bg-white/10'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upload Action & Progress Bar Section matching Screenshot 3 */}
      <div className="max-w-md mx-auto">
        {!isUploading ? (
          <button
            onClick={handleUploadTrigger}
            disabled={selectedMediaList.length === 0}
            className={`w-full h-14 bg-[#f2ca50] text-[#3c2f00] font-mono font-bold text-sm tracking-widest rounded-full shadow-lg shadow-[#f2ca50]/20 active:scale-95 transition-all flex items-center justify-center gap-3 ${
              selectedMediaList.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
            }`}
          >
            <span className="material-symbols-outlined">publish</span>
            <span>UPLOAD TO EVENT</span>
          </button>
        ) : (
          /* Animated Progress Bar matching Screenshot 3 */
          <div className="glass-panel p-6 rounded-2xl space-y-3 animate-in fade-in">
            <div className="flex justify-between items-end">
              <span className="font-mono text-xs text-[#e5e2e1]">Uploading assets & processing...</span>
              <span className="font-mono font-bold text-lg text-[#f2ca50]">{uploadProgress}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-[#f2ca50] rounded-full transition-all duration-300 ease-out shadow-[0_0_15px_rgba(242,202,80,0.5)]"
                style={{ width: `${uploadProgress}%` }}
              />
              <div className="absolute inset-0 upload-shimmer pointer-events-none" />
            </div>
            <p className="text-center font-body text-xs text-[#d0c5af]/60 italic pt-1">
              Optimizing for high-fidelity viewing & broadcasting to guests...
            </p>
          </div>
        )}
      </div>

      {/* Success Toast matching Screenshot 3 */}
      {showToast && (
        <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-8 md:w-96 z-[100] glass-panel p-4 rounded-2xl flex items-center gap-4 border-l-4 border-l-[#f2ca50] shadow-2xl animate-in slide-in-from-bottom-8">
          <div className="w-10 h-10 rounded-full bg-[#f2ca50]/20 flex items-center justify-center flex-shrink-0">
            <span
              className="material-symbols-outlined text-[#f2ca50]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </div>
          <div className="flex-1">
            <p className="font-display font-semibold text-[#e5e2e1] text-sm">Upload Successful</p>
            <p className="font-body text-[#d0c5af] text-xs">
              Your memories are now live in the event gallery.
            </p>
          </div>
          <button onClick={() => setShowToast(false)} className="text-[#d0c5af]/40 hover:text-[#e5e2e1]">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}
    </div>
  );
};
