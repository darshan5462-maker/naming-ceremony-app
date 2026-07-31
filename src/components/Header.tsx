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
        <span className="material-symbols-outlined text-[#f2ca50] text-2xl group-hover:scale-110 transition-transform">
          child_care
        </span>
        <h1 className="font-display font-bold text-lg md:text-xl tracking-tight text-[#f2ca50] uppercase flex items-center gap-1.5">
          NAMING CEREMONY <span className="text-base">👶✨</span> <span className="text-xs text-[#d0c5af] font-normal tracking-widest ml-1 hidden sm:inline border-l border-white/20 pl-2">AUG 5</span>
        </h1>
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
        /* Desktop Navigation Links */
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`font-mono text-xs tracking-wider uppercase transition-colors ${
              activeTab === 'gallery' ? 'text-[#f2ca50] active-dot font-semibold' : 'text-[#d0c5af] hover:text-[#f2ca50]'
            }`}
          >
            GALLERY
          </button>
          <button
            onClick={() => setActiveTab('facematch')}
            className={`font-mono text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5 ${
              activeTab === 'facematch' ? 'text-[#f2ca50] active-dot font-semibold' : 'text-[#d0c5af] hover:text-[#f2ca50]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">face</span>
            FIND MY FACE
          </button>
          <button
            onClick={() => setActiveTab('scan')}
            className={`font-mono text-xs tracking-wider uppercase transition-colors ${
              activeTab === 'scan' ? 'text-[#f2ca50] active-dot font-semibold' : 'text-[#d0c5af] hover:text-[#f2ca50]'
            }`}
          >
            QR SIGNAGE
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
