import React from 'react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center py-2.5 px-4 bg-[#131313]/80 backdrop-blur-2xl border-t border-white/10 z-50 shadow-[0px_-10px_40px_rgba(0,0,0,0.5)] md:hidden">
      {/* Gallery Tab */}
      <button
        onClick={() => setActiveTab('gallery')}
        className={`flex flex-col items-center justify-center transition-all duration-200 ${
          activeTab === 'gallery'
            ? 'text-[#f2ca50] scale-105'
            : 'text-[#d0c5af]/70 hover:text-[#f2ca50] active:scale-90'
        }`}
      >
        <span
          className="material-symbols-outlined text-2xl"
          style={{ fontVariationSettings: activeTab === 'gallery' ? "'FILL' 1" : "'FILL' 0" }}
        >
          grid_view
        </span>
        <span className="font-mono text-[10px] mt-0.5 tracking-wider font-semibold">ಗ್ಯಾಲರಿ</span>
      </button>

      {/* Face Match Tab */}
      <button
        onClick={() => setActiveTab('facematch')}
        className={`flex flex-col items-center justify-center transition-all duration-200 ${
          activeTab === 'facematch'
            ? 'text-[#f2ca50] scale-105'
            : 'text-[#d0c5af]/70 hover:text-[#f2ca50] active:scale-90'
        }`}
      >
        <span
          className="material-symbols-outlined text-2xl"
          style={{ fontVariationSettings: activeTab === 'facematch' ? "'FILL' 1" : "'FILL' 0" }}
        >
          face
        </span>
        <span className="font-mono text-[10px] mt-0.5 tracking-wider font-semibold">ಮುಖ ಗುರುತು</span>
      </button>

      {/* Scan QR Tab */}
      <button
        onClick={() => setActiveTab('scan')}
        className={`flex flex-col items-center justify-center transition-all duration-200 ${
          activeTab === 'scan'
            ? 'text-[#f2ca50] scale-105'
            : 'text-[#d0c5af]/70 hover:text-[#f2ca50] active:scale-90'
        }`}
      >
        <span
          className="material-symbols-outlined text-2xl"
          style={{ fontVariationSettings: activeTab === 'scan' ? "'FILL' 1" : "'FILL' 0" }}
        >
          qr_code_scanner
        </span>
        <span className="font-mono text-[10px] mt-0.5 tracking-wider font-semibold">ಸ್ಕ್ಯಾನ್</span>
      </button>
    </nav>
  );
};
