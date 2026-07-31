export interface Photo {
  id: string;
  url: string;
  caption: string;
  location: string;
  uploadedAt: string;
  timeAgo: string;
  likesCount: number;
  sharesCount: number;
  photographer?: string;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  tags?: string[];
  matchConfidence?: number;
  matchReason?: string;
}

export interface FaceMatchResult {
  photoId: string;
  isMatch: boolean;
  confidence: number;
  reason?: string;
}

export interface EventStats {
  totalPhotos: number;
  activeGuests: number;
  engagementRate: number;
  remainingSeconds: number;
  eventName: string;
  eventDate: string;
  location: string;
}

export interface SelectedMedia {
  id: string;
  file?: File;
  previewUrl: string;
  caption: string;
  location: string;
}

export type ActiveTab = 'gallery' | 'facematch' | 'scan' | 'upload' | 'admin';
