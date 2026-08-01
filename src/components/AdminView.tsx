import React, { useEffect, useState } from 'react';
import { Photo, EventStats, ActiveTab } from '../types';

interface AdminViewProps {
  photos: Photo[];
  stats: EventStats | null;
  isAdminLoggedIn: boolean;
  onLogin: (passcode: string) => Promise<boolean>;
  onLogout: () => void;
  onDeletePhoto: (id: string) => void;
  onUpdatePhoto: (id: string, caption: string, location: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  photos,
  stats,
  isAdminLoggedIn,
  onLogin,
  onLogout,
  onDeletePhoto,
  onUpdatePhoto,
  setActiveTab,
}) => {
  const [passcode, setPasscode] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [editCaption, setEditCaption] = useState<string>('');
  const [editLocation, setEditLocation] = useState<string>('');
  const [filterLocation, setFilterLocation] = useState<string>('All');

  // Countdown timer simulation (02:45:00)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(2 * 3600 + 45 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = await onLogin(passcode || '1234');
    if (!success) {
      setLoginError('Invalid Passcode. Please enter 1234.');
    }
  };

  const handleQuickLogin = async () => {
    setPasscode('1234');
    await onLogin('1234');
  };

  const handleOpenEdit = (photo: Photo) => {
    setEditingPhoto(photo);
    setEditCaption(photo.caption);
    setEditLocation(photo.location);
  };

  const handleSaveEdit = () => {
    if (editingPhoto) {
      onUpdatePhoto(editingPhoto.id, editCaption, editLocation);
      setEditingPhoto(null);
    }
  };

  // If not logged in, render Secure Login view
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen pt-24 pb-32 px-5 flex items-center justify-center">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl max-w-md w-full border-[#f2ca50]/30 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-[#f2ca50]/15 flex items-center justify-center mx-auto text-[#f2ca50] mb-2">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                lock
              </span>
            </div>
            <h2 className="font-display font-bold text-2xl text-[#e5e2e1]">Photographer Login</h2>
            <p className="font-body text-xs text-[#d0c5af]/70">
              Enter your passcode to manage photos and view live event stats.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-[11px] text-[#d0c5af]/80 mb-2 uppercase">
                PASSCODE / PIN
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter 1234..."
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-base text-center text-[#e5e2e1] tracking-widest focus:outline-none focus:border-[#f2ca50]"
              />
              {loginError && <p className="text-xs text-red-400 mt-2 text-center">{loginError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#f2ca50] text-[#3c2f00] font-mono font-bold text-xs tracking-wider rounded-full hover:scale-105 transition-all shadow-lg shadow-[#f2ca50]/20"
            >
              ACCESS DASHBOARD
            </button>
          </form>

          <div className="pt-2 text-center border-t border-white/10">
            <button
              onClick={handleQuickLogin}
              className="text-xs font-mono text-[#f2ca50] hover:underline"
            >
              ⚡ Quick Demo Passcode (Click to auto-login as Photographer)
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredAdminPhotos = photos.filter(
    (p) => filterLocation === 'All' || p.location.toLowerCase() === filterLocation.toLowerCase()
  );

  return (
    <div className="min-h-screen pt-24 pb-32 px-5 md:px-16 max-w-[1440px] mx-auto w-full">
      {/* Header Section matching Screenshot 1 */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="font-display font-bold text-2xl md:text-4xl text-[#e5e2e1]">
                Photographer Dashboard
              </h2>
              <button
                onClick={onLogout}
                className="font-mono text-[10px] text-[#d0c5af]/60 hover:text-red-400 border border-white/10 px-2.5 py-1 rounded-full transition-colors"
                title="Log out"
              >
                LOGOUT
              </button>
            </div>
            <p className="text-[#d0c5af]/80 font-body text-sm max-w-lg">
              Monitor live event performance and manage your captures with precision.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#2a2a2a] px-4 py-2 rounded-xl border border-white/5 self-start md:self-auto">
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="font-mono text-xs font-semibold text-[#e5e2e1]">LIVE SESSION ACTIVE</span>
          </div>
        </div>
      </section>

      {/* Stats Grid matching Screenshot 1 */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {/* Card 1: Total Photos */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden group">
          <div className="shimmer-bg absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <span className="text-[#d0c5af]/70 font-mono text-xs uppercase tracking-widest">
            TOTAL PHOTOS
          </span>
          <span className="text-4xl md:text-5xl font-display font-bold text-[#f2ca50]">
            {stats ? stats.totalPhotos : photos.length}
          </span>
          <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">trending_up</span> +12 in last hour
          </span>
        </div>

        {/* Card 2: Active Guests */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-2">
          <span className="text-[#d0c5af]/70 font-mono text-xs uppercase tracking-widest">
            ACTIVE GUESTS
          </span>
          <span className="text-4xl md:text-5xl font-display font-bold text-[#e5e2e1]">
            {stats ? stats.activeGuests : 85}
          </span>
          <span className="text-[#d0c5af]/50 font-mono text-[11px] flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">group</span> QR scans active
          </span>
        </div>

        {/* Card 3: Engagement */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-2">
          <span className="text-[#d0c5af]/70 font-mono text-xs uppercase tracking-widest">
            ENGAGEMENT
          </span>
          <span className="text-4xl md:text-5xl font-display font-bold text-[#e5e2e1]">
            {stats ? `${stats.engagementRate}%` : '92%'}
          </span>
          <span className="text-[#d0c5af]/50 font-mono text-[11px] flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">favorite</span> Likes & Shares
          </span>
        </div>

        {/* Card 4: Event Time */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-2 bg-[#f2ca50]/5 border-[#f2ca50]/20">
          <span className="text-[#f2ca50] font-mono text-xs uppercase tracking-widest">
            EVENT TIME
          </span>
          <span className="text-4xl md:text-5xl font-display font-bold text-[#f2ca50]">
            {formatCountdown(secondsRemaining)}
          </span>
          <span className="text-[#d0c5af]/50 font-mono text-[11px] flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">timer</span> Hours remaining
          </span>
        </div>
      </section>

      {/* Recent Uploads Section matching Screenshot 1 */}
      <section>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h3 className="font-display font-semibold text-2xl text-[#e5e2e1]">Recent Uploads</h3>

          <div className="flex gap-3">
            <div className="flex gap-1.5 overflow-x-auto max-w-xs sm:max-w-none pb-2">
              {[
                { id: 'All', label: 'All Photos 🖼️' },
                { id: 'Pooja Mandap', label: 'Pooja Mandap 🪔' },
                { id: 'Cradle Area', label: 'Cradle Area 🍼' },
                { id: 'Grand Hall', label: 'Grand Hall 🏛️' },
                { id: 'Dining & Feast', label: 'Dining & Feast 🍱' },
                { id: 'Welcome Entrance', label: 'Welcome Entrance 🌺' },
              ].map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setFilterLocation(loc.id)}
                  className={`px-3.5 py-1.5 rounded-full font-mono text-[11px] whitespace-nowrap transition-all ${
                    filterLocation.toLowerCase() === loc.id.toLowerCase()
                      ? 'bg-[#f2ca50] text-[#3c2f00] font-bold shadow-md shadow-[#f2ca50]/20'
                      : 'glass-panel text-[#d0c5af] hover:text-white'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Admin Upload Items Grid matching Screenshot 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAdminPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group relative glass-panel rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01] border-white/10"
            >
              {/* Photo Image Aspect 4/5 matching Screenshot 1 */}
              <div className="aspect-[4/5] relative overflow-hidden bg-[#201f1f]">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
              </div>

              {/* Card Footer Info & Buttons */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <span className="font-mono text-[10px] text-[#f2ca50] block mb-1 uppercase font-semibold">
                      UPLOADED {photo.timeAgo.toUpperCase()}
                    </span>
                    <p className="text-[#e5e2e1] font-body text-sm line-clamp-2">{photo.caption}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/5 font-mono text-xs">
                  <button
                    onClick={() => handleOpenEdit(photo)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#e5e2e1] transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span> EDIT
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this photo from the live gallery?')) {
                        onDeletePhoto(photo.id);
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-red-400 bg-red-400/10 hover:bg-red-400/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span> DELETE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Action Button matching Screenshot 1 */}
      <button
        onClick={() => setActiveTab('upload')}
        className="fixed bottom-24 right-6 md:right-12 z-50 flex items-center gap-3 px-8 py-5 bg-[#f2ca50] text-[#3c2f00] rounded-full shadow-[0px_20px_40px_rgba(242,202,80,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 font-mono font-bold text-xs tracking-[0.2em]"
      >
        <span className="material-symbols-outlined font-bold text-2xl">cloud_upload</span>
        <span>UPLOAD NEW</span>
      </button>

      {/* Edit Photo Modal */}
      {editingPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setEditingPhoto(null)}
        >
          <div
            className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full space-y-4 border-[#f2ca50]/30 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-xl text-white">Edit Photo Details</h3>
              <button onClick={() => setEditingPhoto(null)} className="text-[#d0c5af] hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="aspect-video rounded-xl overflow-hidden">
              <img src={editingPhoto.url} alt={editingPhoto.caption} className="w-full h-full object-cover" />
            </div>

            <div>
              <label className="block font-mono text-[11px] text-[#d0c5af] mb-1">CAPTION</label>
              <input
                type="text"
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#f2ca50]"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] text-[#d0c5af] mb-1">LOCATION TAG</label>
              <input
                type="text"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#f2ca50]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEditingPhoto(null)}
                className="px-5 py-2.5 rounded-full bg-white/10 text-white font-mono text-xs"
              >
                CANCEL
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2.5 rounded-full bg-[#f2ca50] text-[#3c2f00] font-mono text-xs font-bold"
              >
                SAVE CHANGES
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
