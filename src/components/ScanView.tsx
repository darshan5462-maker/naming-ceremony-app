import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

export const ScanView: React.FC = () => {
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://luxelive.app';

  useEffect(() => {
    if (qrCanvasRef.current) {
      QRCode.toCanvas(
        qrCanvasRef.current,
        currentUrl,
        {
          width: 320,
          margin: 1.5,
          color: {
            dark: '#131313',
            light: '#ffffff',
          },
        },
        (err) => {
          if (err) console.error('QR code generation error:', err);
        }
      );
    }
  }, [currentUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadQR = () => {
    if (qrCanvasRef.current) {
      const url = qrCanvasRef.current.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'luxe-live-2024-qr-code.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between pt-8 pb-28 px-5 relative overflow-hidden">
      {/* Background Atmospheric Shaders */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#f2ca50]/20 blur-[130px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full"></div>
      </div>

      {/* Main Glassmorphic QR Signage Canvas */}
      <main className="flex-grow flex items-center justify-center relative z-10 py-6">
        <div className="relative w-full max-w-xl group">
          <div className="glass-panel rounded-[2.5rem] p-8 sm:p-12 md:p-16 flex flex-col items-center text-center qr-glow transition-all duration-500 hover:scale-[1.01] border-[#f2ca50]/20">
            {/* Floating Decorative Scanner Badge */}
            <div className="absolute -top-5 -right-3 w-12 h-12 glass-panel rounded-full flex items-center justify-center text-[#f2ca50] shadow-xl animate-bounce">
              <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
            </div>

            {/* QR Centerpiece Box matching Screenshot 4 */}
            <div className="relative mb-8 p-5 glass-panel rounded-3xl bg-white/[0.03] border-white/10">
              <div className="relative aspect-square w-64 md:w-80 flex items-center justify-center rounded-2xl overflow-hidden bg-white p-3 shadow-2xl">
                <canvas ref={qrCanvasRef} className="w-full h-full rounded-xl" />
                
                {/* Center Brand Overlay Icon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-14 h-14 bg-[#131313] rounded-2xl flex items-center justify-center border-2 border-[#f2ca50]/40 shadow-2xl backdrop-blur-md">
                    <span className="material-symbols-outlined text-[#f2ca50] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      child_care
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Instructions */}
            <div className="space-y-3">
              <p className="font-mono text-xs text-[#f2ca50] tracking-[0.3em] uppercase block">
                SISTER'S NAMING CEREMONY • AUG 5
              </p>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-[#e5e2e1]">
                Scan for Live Ceremony Gallery
              </h2>
              <p className="font-body text-sm text-[#d0c5af] max-w-sm mx-auto leading-relaxed opacity-90">
                Scan with your phone camera to view live photos as they are taken by our official photographers, or use AI Face Match!
              </p>
            </div>

            {/* Interactive Scanning Indicator */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <div className="w-px h-10 bg-gradient-to-b from-[#f2ca50]/60 to-transparent"></div>
              <div className="upload-shimmer px-6 py-2 rounded-full border border-[#f2ca50]/30 bg-[#f2ca50]/10">
                <span className="font-mono text-xs text-[#f2ca50] font-bold tracking-widest">
                  SCANNING ENABLED
                </span>
              </div>
            </div>

            {/* Action Buttons: Copy Link & Download QR */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 w-full pt-6 border-t border-white/10">
              <button
                onClick={handleCopyLink}
                className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-[#e5e2e1] font-mono text-xs font-semibold flex items-center gap-2 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-base">
                  {copiedLink ? 'check' : 'content_copy'}
                </span>
                <span>{copiedLink ? 'LINK COPIED' : 'COPY LIVE LINK'}</span>
              </button>

              <button
                onClick={handleDownloadQR}
                className="px-5 py-2.5 rounded-full bg-[#f2ca50] text-[#3c2f00] font-mono text-xs font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <span className="material-symbols-outlined text-base">download</span>
                <span>DOWNLOAD SIGNAGE QR</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Attendees & Security Badge matching Screenshot 4 */}
      <footer className="w-full max-w-xl mx-auto py-4 flex flex-col sm:flex-row items-center justify-between gap-4 z-10 text-xs text-[#d0c5af]/70">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUNoE7cC5RiGqLPCPfx37-wKebakbpXaQRvphxlh37DWq4yUtXzhnFZYTTWyofcagQ53FRkscXwQgQgSimaiSxT1FiuWrtoZm-O8SPVWaQPT78Pt6MJZuA9qsBx48GDzHxzRsmWwuyvVj0fmnErsj3JmVMH3PS-iDAIrKiyoAGgUMNSj9CPQCvFSnl2PfEdrR7H7VqXMR4EbK0_kDh9R5V1pgNFMkIynm03K5elr01xvrAzUu3M5e1"
              alt="Guest 1"
              className="w-8 h-8 rounded-full border-2 border-[#131313] object-cover"
            />
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCv6dyw_63YOQ7TUMP-Wxt70zQKXhawv8rXBEvy1QrYU-dbB21rPaKKFM4jiQDnVtEwsHrvBIrfRHzwXot3NY7P9OnD8CSDXS3xByxEm2X7XMVQ6KsIZIoPDPQmmY9nGxAQzoHAHL2TezeRLwBHX8q093pldwf3bMwnj6nbp_mNMuLYxKn4aGazK62BUbsprMOaImnynx9BVBdLQUqw34Yi1vwrRr5TBv-Kdvi4dQpIqTi3fd13Ufqu"
              alt="Guest 2"
              className="w-8 h-8 rounded-full border-2 border-[#131313] object-cover"
            />
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBH5afS6-S0fq_oZcoBgFiwGWHtOvfSPXD11AZdVEHzGki_lLS7Ki2-uKd_IHNw65lxqjWamnTzPRq24g0FTRiDF7M2GZjZyIAF5ccaUeIjYxSOmvv-yLYy-Xzbq3x5WQyNO6P6aZut3DlN03GNsDSRR69gX6JE1e7D7BEgz8upwgKNNm3QFnF5QoLG1AsIzTTRPOLdYEyZNbrYtrxsftvc_q4hyHehQlK0bEsYuJoPStpSrEfwp4yw"
              alt="Guest 3"
              className="w-8 h-8 rounded-full border-2 border-[#131313] object-cover"
            />
            <div className="w-8 h-8 rounded-full border-2 border-[#131313] bg-[#2a2a2a] flex items-center justify-center font-mono text-[10px] text-[#f2ca50] font-bold">
              +124
            </div>
          </div>
          <span className="font-mono text-xs text-[#d0c5af]">Live Attendees Uploading</span>
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>Privacy Protected</span>
          <span>•</span>
          <span>Luxe Protocol v2.4</span>
        </div>
      </footer>
    </div>
  );
};
