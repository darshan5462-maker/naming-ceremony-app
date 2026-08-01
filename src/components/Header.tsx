import React from 'react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isAdminLoggedIn: boolean;
  onOpenLogin: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isAdminLoggedIn,
  onOpenLogin,
  searchQuery,
  setSearchQuery,
  isSearchOpen,
  setIsSearchOpen,
}) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#131313]/70 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-5 md:px-16 h-16 transition-all duration-300">
      {/* Brand Title & Icon */}
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => setActiveTab('gallery')}
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#f2ca50] to-[#e6a817] p-[1px] shadow-lg shadow-[#f2ca50]/10 group-hover:scale-105 transition-transform">
          <div className="w-full h-full bg-[#171411] rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-[#f2ca50] text-xl">
              child_care
            </span>
          </div>
        </div>
        <div>
          <h1 className="font-display font-bold text-base md:text-lg tracking-tight text-[#f2ca50] uppercase flex items-center gap-2">
            <span>NAMING CEREMONY</span>
            <span className="bg-[#f2ca50]/15 text-[#f2ca50] text-[11px] px-2 py-0.5 rounded-full font-medium border border-[#f2ca50]/30 hidden sm:inline-block">
              ನಾಮಕರಣ ಮಹೋತ್ಸವ
            </span>
          </h1>
          <p className="text-[10px] text-[#c4b595] font-mono tracking-widest hidden md:block">
            ಆಗಸ್ಟ್ ೫, ೨೦೨೬ • ROYAL PALACE
          </p>
        </div>
      </div>

      {/* Center Search input if toggled */}
      {isSearchOpen ? (
        <div className="flex-1 max-w-md mx-4 relative animate-in fade-in duration-200">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#d0c5af] text-sm">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search photos by caption or ceremony location..."
            autoFocus
            className="w-full bg-white/5 border border-white/15 rounded-full pl-9 pr-8 py-1.5 text-sm text-[#e5e2e1] placeholder:text-[#d0c5af]/50 focus:outline-none focus:border-[#f2ca50]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#d0c5af] hover:text-white"
            >
              <span className="material-symbols-outlined text-xs">close</span>
            </button>
          )}
        </div>
      ) : (
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`font-mono text-xs tracking-wider uppercase transition-all px-3 py-1.5 rounded-full flex flex-col items-center ${
              activeTab === 'gallery'
                ? 'bg-[#f2ca50] text-[#1a1400] font-bold shadow-md shadow-[#f2ca50]/20'
                : 'text-[#d0c5af] hover:text-[#f2ca50] hover:bg-white/5'
            }`}
          >
            <span>GALLERY</span>
            <span className="text-[9px] font-sans tracking-normal font-normal opacity-80">ಗ್ಯಾಲರಿ</span>
          </button>
          <button
            onClick={() => setActiveTab('facematch')}
            className={`font-mono text-xs tracking-wider uppercase transition-all px-3 py-1.5 rounded-full flex flex-col items-center gap-0.5 ${
              activeTab === 'facematch'
                ? 'bg-[#f2ca50] text-[#1a1400] font-bold shadow-md shadow-[#f2ca50]/20'
                : 'text-[#d0c5af] hover:text-[#f2ca50] hover:bg-white/5'
            }`}
          >
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">face</span>
              FIND MY FACE
            </span>
            <span className="text-[9px] font-sans tracking-normal font-normal opacity-80">ಮುಖದ ಗುರುತು</span>
          </button>
          <button
            onClick={() => setActiveTab('scan')}
            className={`font-mono text-xs tracking-wider uppercase transition-all px-3 py-1.5 rounded-full flex flex-col items-center ${
              activeTab === 'scan'
                ? 'bg-[#f2ca50] text-[#1a1400] font-bold shadow-md shadow-[#f2ca50]/20'
                : 'text-[#d0c5af] hover:text-[#f2ca50] hover:bg-white/5'
            }`}
          >
            <span>QR SIGNAGE</span>
            <span className="text-[9px] font-sans tracking-normal font-normal opacity-80">ಸ್ಕ್ಯಾನ್ ಮಾಡಿ</span>
          </button>
        </nav>
      )}

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className={`p-2 rounded-full transition-colors ${
            isSearchOpen ? 'bg-[#f2ca50]/20 text-[#f2ca50]' : 'text-[#d0c5af] hover:bg-white/5 hover:text-white'
          }`}
          title="Search photos"
        >
          <span className="material-symbols-outlined text-xl">
            {isSearchOpen ? 'close' : 'search'}
          </span>
        </button>

        {/* Display Photographer Admin Badge ONLY if logged in as Admin */}
        {isAdminLoggedIn && (
          <button
            onClick={() => setActiveTab('admin')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all border border-[#f2ca50]/50 bg-[#f2ca50]/10 text-[#f2ca50] hover:bg-[#f2ca50]/20"
            title="Photographer Admin Dashboard Active"
          >
            <span className="material-symbols-outlined text-base">photo_camera</span>
            <span className="text-xs font-mono font-bold tracking-wider">
              DASHBOARD
            </span>
          </button>
        )}
      </div>
    </header>
  );
};
