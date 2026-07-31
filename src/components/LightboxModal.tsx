import React, { useEffect } from 'react';
import { Photo } from '../types';

interface LightboxModalProps {
  photo: Photo | null;
  photos: Photo[];
  onClose: () => void;
  onSelectPhoto: (photo: Photo) => void;
  onLike: (photoId: string) => void;
  isAdminLoggedIn?: boolean;
  onDelete?: (photoId: string) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  photo,
  photos,
  onClose,
  onSelectPhoto,
  onLike,
  isAdminLoggedIn,
  onDelete,
}) => {
  if (!photo) return null;

  const currentIndex = photos.findIndex((p) => p.id === photo.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasPrev) onSelectPhoto(photos[currentIndex - 1]);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasNext) onSelectPhoto(photos[currentIndex + 1]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onSelectPhoto(photos[currentIndex - 1]);
      if (e.key === 'ArrowRight' && hasNext) onSelectPhoto(photos[currentIndex + 1]);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, hasNext, hasPrev, onClose, onSelectPhoto, photos]);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `luxe-live-${photo.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(photo.url, '_blank');
    }
  };

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(
      `Check out this live photo from LUXE LIVE 2024: "${photo.caption}" ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleNativeShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'LUXE LIVE 2024 Photo',
          text: photo.caption,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      handleWhatsAppShare(e);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 md:p-8 animate-in fade-in duration-300 overflow-y-auto"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between w-full max-w-6xl mx-auto z-10 py-2">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#f2ca50] text-xl">camera_enhance</span>
          <div>
            <span className="font-mono text-xs text-[#f2ca50] uppercase tracking-widest block">
              {photo.location}
            </span>
            <span className="text-[11px] text-[#d0c5af]/60 font-mono">{photo.timeAgo}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleNativeShare}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-[#e5e2e1] transition-all"
            title="Share"
          >
            <span className="material-symbols-outlined text-lg">share</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-[#e5e2e1] transition-all"
            title="Download Full Resolution"
          >
            <span className="material-symbols-outlined text-lg">download</span>
          </button>

          {isAdminLoggedIn && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Delete this photo from the live event gallery?')) {
                  onDelete(photo.id);
                  onClose();
                }
              }}
              className="p-2.5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
              title="Delete Photo (Admin)"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-[#f2ca50]/20 text-[#f2ca50] hover:bg-[#f2ca50]/30 transition-all ml-2"
            title="Close Lightbox"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
      </div>

      {/* Center Image Container */}
      <div className="relative flex-1 flex items-center justify-center my-4 max-w-5xl mx-auto w-full min-h-[60vh]">
        {/* Previous Button */}
        {hasPrev && (
          <button
            onClick={handlePrev}
            className="absolute left-2 md:left-4 z-20 p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-[#f2ca50] hover:text-[#3c2f00] transition-all"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
        )}

        <img
          src={photo.url}
          alt={photo.caption}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[75vh] max-w-full object-contain rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-200"
        />

        {/* Next Button */}
        {hasNext && (
          <button
            onClick={handleNext}
            className="absolute right-2 md:right-4 z-20 p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-[#f2ca50] hover:text-[#3c2f00] transition-all"
          >
            <span className="material-symbols-outlined text-2xl">arrow_forward</span>
          </button>
        )}
      </div>

      {/* Bottom Info & Action Bar */}
      <div
        className="w-full max-w-4xl mx-auto glass-panel p-4 md:p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1 max-w-2xl">
          <p className="text-base md:text-lg font-display text-white leading-snug">
            {photo.caption}
          </p>
          <div className="flex items-center gap-3 text-xs text-[#d0c5af]/70 font-mono">
            <span>Uploaded by {photo.photographer || 'Photographer'}</span>
            <span>•</span>
            <span>{photo.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t border-white/10 pt-3 md:pt-0 md:border-t-0">
          <button
            onClick={() => onLike(photo.id)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#f2ca50]/15 hover:bg-[#f2ca50]/25 border border-[#f2ca50]/30 text-[#f2ca50] transition-all active:scale-95"
          >
            <span
              className="material-symbols-outlined text-xl"
              style={{ fontVariationSettings: photo.likesCount > 0 ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
            <span className="font-mono text-xs font-bold">{photo.likesCount} Likes</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">share</span>
            <span className="font-mono text-xs font-bold">WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
