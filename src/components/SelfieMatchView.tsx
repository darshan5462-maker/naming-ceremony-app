import React, { useState, useRef, useEffect } from 'react';
import { Photo, FaceMatchResult } from '../types';
import { matchSelfieToPhotos } from '../utils/faceMatcher';

interface SelfieMatchViewProps {
  photos: Photo[];
  onOpenLightbox: (photo: Photo) => void;
  onGoToGallery: () => void;
}

export const SelfieMatchView: React.FC<SelfieMatchViewProps> = ({
  photos,
  onOpenLightbox,
  onGoToGallery,
}) => {
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [matchedResults, setMatchedResults] = useState<FaceMatchResult[] | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Start Front Camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Camera access denied or unavailable. Please upload a selfie photo instead.');
      setIsCameraActive(false);
    }
  };

  // Stop Camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Capture Selfie photo from Video stream
  const captureSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 640;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setSelfieImage(dataUrl);
        stopCamera();
        runFaceMatch(dataUrl);
      }
    }
  };

  // Handle uploaded selfie photo file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setSelfieImage(dataUrl);
          stopCamera();
          runFaceMatch(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Run Intelligent Face Match Engine
  const runFaceMatch = async (base64Selfie: string) => {
    setIsScanning(true);
    setScanProgress(10);
    setMatchedResults(null);

    const interval = setInterval(() => {
      setScanProgress((prev) => (prev < 85 ? prev + 15 : prev));
    }, 200);

    try {
      // 1. Try backend multimodal AI face matching endpoint first
      const apiRes = await fetch('/api/match-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selfieBase64: base64Selfie }),
      });

      if (apiRes.ok) {
        const data = await apiRes.json();
        if (data.success && Array.isArray(data.results)) {
          clearInterval(interval);
          setScanProgress(100);
          setMatchedResults(data.results);
          return;
        }
      }

      // 2. Client-side fallback if server API is unavailable
      const results = await matchSelfieToPhotos(base64Selfie, photos);
      clearInterval(interval);
      setScanProgress(100);
      setMatchedResults(results);
    } catch (err) {
      console.error('Face match error:', err);
      const results = await matchSelfieToPhotos(base64Selfie, photos);
      clearInterval(interval);
      setScanProgress(100);
      setMatchedResults(results);
    } finally {
      setTimeout(() => {
        setIsScanning(false);
      }, 400);
    }
  };

  const handleResetSelfie = () => {
    setSelfieImage(null);
    setMatchedResults(null);
    setIsScanning(false);
    stopCamera();
  };

  // Map matched results to photo items
  const matchedPhotosWithConfidence = matchedResults
    ? matchedResults
        .map((r) => {
          const photo = photos.find((p) => p.id === r.photoId);
          if (!photo) return null;
          return {
            ...photo,
            matchConfidence: r.confidence,
            matchReason: r.reason,
          };
        })
        .filter(Boolean) as (Photo & { matchConfidence: number; matchReason?: string })[]
    : [];

  const handleDownloadAllMatches = () => {
    matchedPhotosWithConfidence.forEach((p, idx) => {
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = p.url;
        a.download = `naming-ceremony-matched-${p.id}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, idx * 300);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-10 pt-24 min-h-screen text-[#e5e2e1]">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f2ca50]/10 border border-[#f2ca50]/30 text-[#f2ca50] font-mono text-xs uppercase tracking-widest mb-3">
          <span className="material-symbols-outlined text-sm">center_focus_strong</span>
          <span>AI SELFIE MATCH • ಮುಖದ ಮೂಲಕ ಹುಡುಕಿ</span>
        </div>
        <h2 className="font-display font-bold text-3xl md:text-4xl text-[#f2ca50] tracking-tight">
          Find All Your Ceremony Pictures Live
        </h2>
        <p className="text-[#c4b595] text-sm md:text-base mt-2 font-sans leading-relaxed">
          Snap or upload a quick selfie. Our AI scans all official photographer uploads to instantly bring you every photo featuring your face.
        </p>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Camera / Selfie Capture Card */}
        <div className="lg:col-span-4 bg-[#1a1612] border border-[#f2ca50]/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg text-[#f2ca50] flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">camera_front</span>
              Your Reference Selfie
            </h3>
            {selfieImage && (
              <button
                onClick={handleResetSelfie}
                className="text-xs font-mono text-[#d0c5af] hover:text-[#f2ca50] flex items-center gap-1 underline"
              >
                Retake / New
              </button>
            )}
          </div>

          {/* Selfie Display Box */}
          <div className="relative aspect-square rounded-xl bg-black/60 border border-white/10 overflow-hidden flex items-center justify-center">
            {isCameraActive ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
                {/* Face Frame Overlay */}
                <div className="absolute inset-0 border-2 border-dashed border-[#f2ca50]/60 m-8 rounded-full pointer-events-none animate-pulse flex items-center justify-center">
                  <span className="text-[10px] font-mono text-[#f2ca50] bg-black/60 px-2 py-1 rounded">
                    ALIGN FACE
                  </span>
                </div>
              </div>
            ) : selfieImage ? (
              <div className="relative w-full h-full">
                <img
                  src={selfieImage}
                  alt="Your reference selfie"
                  className="w-full h-full object-cover"
                />
                {/* Scanning Laser Effect */}
                {isScanning && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center p-4">
                    <div className="w-full h-1 bg-[#f2ca50] shadow-[0_0_15px_#f2ca50] animate-bounce mb-4" />
                    <span className="material-symbols-outlined text-4xl text-[#f2ca50] animate-spin mb-2">
                      sync
                    </span>
                    <p className="font-mono text-xs text-[#f2ca50] uppercase tracking-widest text-center">
                      SCANNING CEREMONY PHOTOS... {scanProgress}%
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-6 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#f2ca50]/10 flex items-center justify-center mb-3 border border-[#f2ca50]/30 text-[#f2ca50]">
                  <span className="material-symbols-outlined text-3xl">face_5</span>
                </div>
                <p className="text-sm font-medium text-[#e5e2e1]">No Selfie Loaded Yet</p>
                <p className="text-xs text-[#c4b595] mt-1">
                  Take a front camera photo or choose from gallery to match your face.
                </p>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>

          {cameraError && (
            <p className="text-xs text-red-400 mt-3 font-sans bg-red-950/40 border border-red-500/30 p-2 rounded-lg">
              {cameraError}
            </p>
          )}

          {/* Action Control Buttons */}
          <div className="mt-5 space-y-3">
            {isCameraActive ? (
              <button
                onClick={captureSelfie}
                className="w-full py-3 bg-gradient-to-r from-[#f2ca50] to-[#dca51a] text-[#1a1400] font-bold text-sm rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">photo_camera</span>
                CAPTURE & MATCH FACE
              </button>
            ) : (
              <>
                <button
                  onClick={startCamera}
                  className="w-full py-3 bg-[#f2ca50] text-[#1a1400] font-bold text-sm rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">camera_front</span>
                  OPEN CAMERA (ಸೆಲ್ಫಿ)
                </button>

                <div className="relative">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 bg-white/5 border border-white/15 text-[#e5e2e1] hover:bg-white/10 font-mono text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">upload_file</span>
                    UPLOAD SELFIE FROM GALLERY
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Matched Photo Results Grid */}
        <div className="lg:col-span-8">
          {isScanning ? (
            <div className="bg-[#1a1612] border border-[#f2ca50]/20 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[380px]">
              <div className="w-16 h-16 rounded-full bg-[#f2ca50]/10 border border-[#f2ca50]/40 flex items-center justify-center text-[#f2ca50] mb-4 animate-pulse">
                <span className="material-symbols-outlined text-3xl animate-spin">
                  search_hands_free
                </span>
              </div>
              <h3 className="font-display font-bold text-xl text-[#f2ca50] mb-2">
                Analyzing Facial Contours & Matches
              </h3>
              <p className="text-sm text-[#c4b595] max-w-md mb-6 font-sans">
                AI is cross-referencing your facial profile across all ceremony gallery uploads...
              </p>
              <div className="w-full max-w-xs bg-black/60 h-2.5 rounded-full overflow-hidden border border-white/10">
                <div
                  className="bg-gradient-to-r from-[#f2ca50] to-[#e6a817] h-full transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          ) : matchedResults !== null ? (
            <div>
              {/* Results Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1612] border border-[#f2ca50]/20 p-4 rounded-xl mb-6 shadow-xl">
                <div>
                  <h3 className="font-display font-bold text-lg text-[#f2ca50] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#f2ca50]">check_circle</span>
                    Found {matchedPhotosWithConfidence.length} Photos Matching Your Face!
                  </h3>
                  <p className="text-xs text-[#c4b595] font-sans">
                    ನಿಮ್ಮ ಮುಖಕ್ಕೆ ಹೊಂದುವ ಫೋಟೋಗಳನ್ನು ಕೆಳಗೆ ಪರಿಶೀಲಿಸಿ.
                  </p>
                </div>

                {matchedPhotosWithConfidence.length > 0 && (
                  <button
                    onClick={handleDownloadAllMatches}
                    className="px-4 py-2 bg-[#f2ca50] text-[#1a1400] font-bold text-xs uppercase tracking-wider rounded-lg shadow-md hover:brightness-110 transition-all flex items-center gap-2 self-start sm:self-auto"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    DOWNLOAD ALL ({matchedPhotosWithConfidence.length})
                  </button>
                )}
              </div>

              {matchedPhotosWithConfidence.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                  {matchedPhotosWithConfidence.map((photo) => (
                    <div
                      key={photo.id}
                      className="group bg-[#1a1612] border border-[#f2ca50]/25 rounded-2xl overflow-hidden shadow-xl hover:border-[#f2ca50] transition-all duration-300 flex flex-col"
                    >
                      {/* Photo Image Container */}
                      <div
                        className="relative aspect-4/3 overflow-hidden cursor-pointer bg-black/60"
                        onClick={() => onOpenLightbox(photo)}
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />

                        {/* Top Confidence Badge */}
                        <div className="absolute top-3 left-3 bg-[#f2ca50] text-[#1a1400] font-mono font-bold text-[11px] px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">verified</span>
                          {photo.matchConfidence}% MATCH
                        </div>
                      </div>

                      {/* Photo Info & Action Footer */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-xs text-[#e5e2e1] font-sans font-medium line-clamp-2">
                            {photo.caption}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-[11px] text-[#c4b595] font-mono">
                            <span className="material-symbols-outlined text-xs text-[#f2ca50]">
                              auto_awesome
                            </span>
                            <span>{photo.matchReason || 'Verified face contour'}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                          <span className="text-[10px] text-[#c4b595] font-mono">
                            {photo.timeAgo || 'Ceremony Live'}
                          </span>
                          <a
                            href={photo.url}
                            download={`ceremony-photo-${photo.id}.jpg`}
                            onClick={(e) => e.stopPropagation()}
                            className="px-3 py-1.5 bg-white/10 hover:bg-[#f2ca50] hover:text-[#1a1400] text-xs font-mono font-bold rounded-lg transition-all flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-xs">download</span>
                            DOWNLOAD
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#1a1612] border border-white/10 rounded-2xl p-10 text-center flex flex-col items-center">
                  <span className="material-symbols-outlined text-4xl text-[#c4b595] mb-3">
                    sentiment_dissatisfied
                  </span>
                  <h4 className="font-display font-bold text-lg text-[#e5e2e1] mb-1">
                    No Matching Face Found
                  </h4>
                  <p className="text-xs text-[#c4b595] max-w-sm mb-5 font-sans">
                    We couldn't detect your face in the current photographer uploads. Try taking another selfie with good lighting.
                  </p>
                  <button
                    onClick={onGoToGallery}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all"
                  >
                    BROWSE ALL CEREMONY PHOTOS
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Initial Empty Guidance Card */
            <div className="bg-[#1a1612] border border-[#f2ca50]/20 rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[380px] shadow-xl">
              <div className="w-16 h-16 rounded-full bg-[#f2ca50]/10 border border-[#f2ca50]/30 flex items-center justify-center text-[#f2ca50] mb-4">
                <span className="material-symbols-outlined text-3xl">face_retouching_natural</span>
              </div>
              <h3 className="font-display font-bold text-xl text-[#f2ca50] mb-2">
                Ready for AI Face Scanning
              </h3>
              <p className="text-sm text-[#c4b595] max-w-md mb-6 font-sans leading-relaxed">
                Open your camera on the left or upload a clear front face photo to discover all pictures where you appear!
              </p>
              <div className="flex items-center gap-3 text-xs font-mono text-[#f2ca50] bg-[#f2ca50]/10 px-4 py-2 rounded-full border border-[#f2ca50]/20">
                <span className="material-symbols-outlined text-sm">shield</span>
                <span>Private & Instant Canvas Recognition</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
