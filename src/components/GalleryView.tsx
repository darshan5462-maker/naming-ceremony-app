import React, { useState } from 'react';
import { Photo, ActiveTab } from '../types';

interface GalleryViewProps {
  photos: Photo[];
  searchQuery: string;
  onSelectPhoto: (photo: Photo) => void;
  onLikePhoto: (id: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  newPhotoToast: Photo | null;
  onDismissToast: () => void;
}

const locations = [
  'All 🖼️',
  'Pooja Mandap 🪔',
  'Cradle Area 🍼',
  'Grand Hall 🏛️',
  'Dining & Feast 🍱',
  'Welcome Entrance 🌺',
];

export const GalleryView: React.FC<GalleryViewProps> = ({
  photos,
  searchQuery,
  onSelectPhoto,
  onLikePhoto,
  setActiveTab,
  newPhotoToast,
  onDismissToast,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'oldest'>('latest');
  const [showEventDetails, setShowEventDetails] = useState<boolean>(false);

  // Filter & Sort photos
  const filteredPhotos = photos.filter((p) => {
    const matchesLocation =
      selectedLocation.startsWith('All') ||
      selectedLocation.toLowerCase().includes(p.location.toLowerCase()) ||
      p.location.toLowerCase().includes(selectedLocation.split(' ')[0].toLowerCase());
    const matchesSearch =
      !searchQuery ||
      p.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesLocation && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'popular') return b.likesCount - a.likesCount;
    if (sortBy === 'oldest') return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
    return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
  });

  const scrollToGallery = () => {
    const el = document.getElementById('gallery-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShare = (e: React.MouseEvent, photo: Photo) => {
    e.stopPropagation();
    const text = encodeURIComponent(`Live from Naming Ceremony 👶✨: "${photo.caption}" ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleDownload = async (e: React.MouseEvent, photo: Photo) => {
    e.stopPropagation();
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `naming-ceremony-${photo.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(photo.url, '_blank');
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section with Warm Festivity Theme */}
      <section className="relative w-full h-[540px] md:h-[620px] flex items-center justify-center overflow-hidden mb-12 px-5">
        {/* Background Ambient Blur Shader */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-[#f2ca50]/15 blur-[140px] rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-rose-600/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f2ca50]/15 border border-[#f2ca50]/30 text-[#f2ca50] font-mono text-xs font-semibold uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">child_care</span> BLESSINGS & CELEBRATION
          </div>

          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl tracking-tight leading-none text-[#e5e2e1] font-bold">
            Grand <br />
            <span className="text-[#f2ca50] italic font-serif">Naming Ceremony 👶✨</span>
          </h2>

          <p className="font-body text-base md:text-lg text-[#d0c5af] max-w-xl mx-auto leading-relaxed">
            Welcome to the live celebration on <span className="text-[#f2ca50] font-semibold">August 5th, 2026</span>. Capturing sacred rituals, cradle blessings, and joyous family moments live.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('facematch')}
              className="px-8 py-4 bg-[#f2ca50] text-[#3c2f00] font-mono text-xs font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#f2ca50]/20 tracking-wider flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">face</span>
              FIND MY FACE (AI SELFIE MATCH)
            </button>
            <button
              onClick={scrollToGallery}
              className="px-8 py-4 glass-card text-[#e5e2e1] font-mono text-xs font-bold rounded-full hover:bg-white/10 active:scale-95 transition-all tracking-wider"
            >
              ALL CEREMONY PHOTOS
            </button>
            <button
              onClick={() => setShowEventDetails(true)}
              className="px-8 py-4 glass-card text-[#d0c5af] font-mono text-xs font-bold rounded-full hover:bg-white/10 active:scale-95 transition-all tracking-wider"
            >
              PROGRAM SCHEDULE
            </button>
          </div>
        </div>

        {/* Ambient Floating Event Date */}
        <div className="absolute bottom-6 left-8 hidden md:block opacity-60">
          <p className="font-mono text-[11px] tracking-widest text-[#f2ca50]">
            AUGUST 5, 2026 • ROYAL PALACE BANQUETS
          </p>
        </div>
      </section>

      {/* Main Gallery Section */}
      <section id="gallery-section" className="max-w-[1440px] mx-auto px-5 md:px-16 scroll-mt-24">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h3 className="font-display font-semibold text-2xl md:text-3xl text-[#e5e2e1] mb-1">
              Ceremony Gallery
            </h3>
            <p className="text-sm text-[#d0c5af]/70">
              Live photographs uploaded directly by our official event photographers.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#201f1f] px-4 py-2 rounded-full border border-white/5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-mono text-xs text-[#f2ca50] uppercase tracking-widest font-medium">
              Official Photos Live
            </span>
          </div>
        </div>

        {/* Filters & Sorting Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          {/* Location Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {locations.map((loc) => (
              <button
                key={loc}
                onClick={() => setSelectedLocation(loc)}
                className={`px-4 py-2 rounded-full font-mono text-xs whitespace-nowrap transition-all ${
                  selectedLocation === loc
                    ? 'bg-[#f2ca50] text-[#3c2f00] font-bold shadow-md shadow-[#f2ca50]/20'
                    : 'glass-panel text-[#d0c5af] hover:text-white hover:bg-white/10'
                }`}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="font-mono text-xs text-[#d0c5af]/60">SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular' | 'oldest')}
              className="bg-[#201f1f] border border-white/10 text-xs font-mono text-[#e5e2e1] rounded-full px-4 py-2 focus:outline-none focus:border-[#f2ca50] cursor-pointer"
            >
              <option value="latest">LATEST</option>
              <option value="popular">MOST POPULAR</option>
              <option value="oldest">OLDEST</option>
            </select>
          </div>
        </div>

        {/* Empty state if search or filter returns 0 */}
        {filteredPhotos.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center space-y-4 my-8">
            <span className="material-symbols-outlined text-4xl text-[#f2ca50]">search_off</span>
            <h4 className="font-display text-xl text-white">No photos matched your criteria</h4>
            <p className="text-sm text-[#d0c5af]/70 max-w-md mx-auto">
              Try resetting your location filter or search term to discover all live event moments.
            </p>
            <button
              onClick={() => {
                setSelectedLocation('All');
              }}
              className="px-6 py-2.5 bg-[#f2ca50] text-[#3c2f00] font-mono text-xs font-bold rounded-full hover:scale-105 transition-all"
            >
              SHOW ALL PHOTOS
            </button>
          </div>
        ) : (
          /* Masonry Grid Layout */
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => onSelectPhoto(photo)}
                className="break-inside-avoid group glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#f2ca50]/10 cursor-pointer"
              >
                {/* Photo Image Container */}
                <div className="relative overflow-hidden bg-[#201f1f]">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    loading="lazy"
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                </div>

                {/* Card Info Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <span className="font-mono text-[10px] text-[#f2ca50] block mb-1">
                        {photo.timeAgo.toUpperCase()}
                      </span>
                      <p className="text-[#e5e2e1] text-sm font-body line-clamp-2 leading-snug">
                        {photo.caption}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom Bar Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    {/* Like button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLikePhoto(photo.id);
                      }}
                      className="flex items-center gap-1.5 text-xs font-mono text-[#d0c5af] hover:text-[#f2ca50] transition-colors"
                    >
                      <span
                        className="material-symbols-outlined text-base"
                        style={{ fontVariationSettings: photo.likesCount > 0 ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        favorite
                      </span>
                      <span>{photo.likesCount}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleShare(e, photo)}
                        className="p-1.5 rounded-full hover:bg-white/10 text-[#d0c5af] hover:text-[#f2ca50] transition-colors"
                        title="Share on WhatsApp"
                      >
                        <span className="material-symbols-outlined text-lg">share</span>
                      </button>

                      <button
                        onClick={(e) => handleDownload(e, photo)}
                        className="p-1.5 rounded-full hover:bg-white/10 text-[#d0c5af] hover:text-[#f2ca50] transition-colors"
                        title="Download Photo"
                      >
                        <span className="material-symbols-outlined text-lg">download</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Real-time SSE Notification Toast matching Screenshot 2 */}
      {newPhotoToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] transition-all duration-500 ease-out animate-in slide-in-from-bottom-6">
          <div
            onClick={() => {
              onSelectPhoto(newPhotoToast);
              onDismissToast();
            }}
            className="glass-card px-6 py-3.5 rounded-full flex items-center gap-4 shadow-2xl border-[#f2ca50]/30 cursor-pointer hover:border-[#f2ca50] transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#f2ca50] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#3c2f00] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                photo_camera
              </span>
            </div>
            <div>
              <p className="font-mono text-xs text-[#e5e2e1] font-semibold">New moment uploaded</p>
              <p className="text-[10px] text-[#f2ca50] font-mono font-bold uppercase tracking-widest">
                Just now • Click to view
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismissToast();
              }}
              className="ml-3 material-symbols-outlined text-[#d0c5af] hover:text-white text-lg"
            >
              close
            </button>
          </div>
        </div>
      )}

      {/* Event Details Drawer Modal */}
      {showEventDetails && (
        <div
          className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowEventDetails(false)}
        >
          <div
            className="glass-panel p-8 rounded-3xl max-w-lg w-full space-y-6 relative border-[#f2ca50]/30 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowEventDetails(false)}
              className="absolute top-6 right-6 text-[#d0c5af] hover:text-white"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="space-y-2">
              <span className="font-mono text-xs text-[#f2ca50] tracking-widest uppercase flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">event</span> EVENT SPECIFICATIONS
              </span>
              <h3 className="font-display font-bold text-2xl text-white">Grand Naming Ceremony 👶✨</h3>
            </div>

            <div className="space-y-3 text-sm text-[#d0c5af] font-body border-y border-white/10 py-4">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-[#d0c5af]/60">VENUE</span>
                <span className="font-semibold text-white">Royal Palace Banquets & Gardens</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-[#d0c5af]/60">DATE & TIME</span>
                <span className="font-semibold text-white">August 5, 2026 • 09:30 AM - 04:00 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-[#d0c5af]/60">PHOTOGRAPHY</span>
                <span className="font-semibold text-[#f2ca50]">Royal Events Studio (Official)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-[#d0c5af]/60">AI MATCH ENGINE</span>
                <span className="font-semibold text-emerald-400">Gemini 3.6 Face Match Active</span>
              </div>
            </div>

            {/* Program Schedule */}
            <div className="space-y-2">
              <h4 className="font-mono text-xs text-[#f2ca50] tracking-wider uppercase font-bold">PROGRAM SCHEDULE</h4>
              <div className="bg-white/5 p-3 rounded-xl space-y-1.5 text-xs text-[#d0c5af]">
                <div className="flex justify-between">
                  <span className="font-semibold text-white">09:30 AM</span>
                  <span>Ganesh Pooja & Holy Rituals</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-white">11:00 AM</span>
                  <span>Cradle Ceremony & Naming</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-white">12:30 PM</span>
                  <span>Grand Feast & Elder Blessings</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-white">02:00 PM</span>
                  <span>Family Photo Sessions</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#d0c5af]/70 leading-relaxed">
              Photos are uploaded exclusively by the official photographers. Take a selfie in "Find My Face" to view all photos of you automatically!
            </p>

            <button
              onClick={() => setShowEventDetails(false)}
              className="w-full py-3 bg-[#f2ca50] text-[#3c2f00] font-mono text-xs font-bold rounded-full hover:scale-105 transition-all"
            >
              RETURN TO GALLERY
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
