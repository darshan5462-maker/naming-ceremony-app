import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  increment,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Photo, EventStats } from '../types';
import { initialPhotos } from '../data/initialPhotos';

const PHOTOS_COLLECTION = 'photos';

// Subscribe to real-time photos stream with auto-seeding if empty
export const subscribePhotos = (
  onPhotosUpdate: (photos: Photo[]) => void,
  onError?: (err: Error) => void
) => {
  const photosRef = collection(db, PHOTOS_COLLECTION);
  const q = query(photosRef, orderBy('uploadedAt', 'desc'));

  return onSnapshot(
    q,
    async (snapshot) => {
      if (snapshot.empty) {
        // Seed initial photos if collection is empty
        try {
          console.log('Firestore photos empty, seeding initial photos...');
          for (const photo of initialPhotos) {
            const photoDocRef = doc(db, PHOTOS_COLLECTION, photo.id);
            await setDoc(photoDocRef, {
              ...photo,
              createdAt: serverTimestamp(),
            });
          }
        } catch (e) {
          console.error('Failed to seed initial photos:', e);
        }
        return;
      }

      const fetchedPhotos: Photo[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          url: data.url || '',
          caption: data.caption || '',
          location: data.location || 'Grand Hall',
          uploadedAt: data.uploadedAt || new Date().toISOString(),
          timeAgo: data.timeAgo || 'Recently',
          likesCount: typeof data.likesCount === 'number' ? data.likesCount : 0,
          sharesCount: typeof data.sharesCount === 'number' ? data.sharesCount : 0,
          photographer: data.photographer || 'Official Photographer',
          aspectRatio: data.aspectRatio || 'portrait',
          tags: Array.isArray(data.tags) ? data.tags : [],
        };
      });

      onPhotosUpdate(fetchedPhotos);
    },
    (error) => {
      console.error('Error listening to photos collection:', error);
      if (onError) onError(error);
      // Fallback to initial photos if offline or permission issue
      onPhotosUpdate(initialPhotos);
    }
  );
};

// Add new photo to Firestore
export const addPhotoToFirestore = async (
  photoData: Omit<Photo, 'id'> & { id?: string }
): Promise<Photo> => {
  const photoId = photoData.id || `photo-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  const photoDocRef = doc(db, PHOTOS_COLLECTION, photoId);

  const newPhoto: Photo = {
    id: photoId,
    url: photoData.url,
    caption: photoData.caption || 'Live moment at Naming Ceremony',
    location: photoData.location || 'Grand Hall',
    uploadedAt: photoData.uploadedAt || new Date().toISOString(),
    timeAgo: 'Just now',
    likesCount: photoData.likesCount || 0,
    sharesCount: photoData.sharesCount || 0,
    photographer: photoData.photographer || 'Official Photographer',
    aspectRatio: photoData.aspectRatio || 'portrait',
    tags: photoData.tags || ['naming', 'ceremony', 'live'],
  };

  await setDoc(photoDocRef, {
    ...newPhoto,
    createdAt: serverTimestamp(),
  });

  return newPhoto;
};

// Increment Likes in Firestore
export const likePhotoInFirestore = async (photoId: string): Promise<void> => {
  try {
    const photoDocRef = doc(db, PHOTOS_COLLECTION, photoId);
    await updateDoc(photoDocRef, {
      likesCount: increment(1),
    });
  } catch (err) {
    console.error(`Failed to like photo ${photoId} in Firestore:`, err);
  }
};

// Increment Shares in Firestore
export const sharePhotoInFirestore = async (photoId: string): Promise<void> => {
  try {
    const photoDocRef = doc(db, PHOTOS_COLLECTION, photoId);
    await updateDoc(photoDocRef, {
      sharesCount: increment(1),
    });
  } catch (err) {
    console.error(`Failed to share photo ${photoId} in Firestore:`, err);
  }
};

// Update Photo details in Firestore
export const updatePhotoInFirestore = async (
  photoId: string,
  updates: Partial<Photo>
): Promise<void> => {
  try {
    const photoDocRef = doc(db, PHOTOS_COLLECTION, photoId);
    await updateDoc(photoDocRef, updates);
  } catch (err) {
    console.error(`Failed to update photo ${photoId} in Firestore:`, err);
  }
};

// Delete Photo from Firestore
export const deletePhotoFromFirestore = async (photoId: string): Promise<void> => {
  try {
    const photoDocRef = doc(db, PHOTOS_COLLECTION, photoId);
    await deleteDoc(photoDocRef);
  } catch (err) {
    console.error(`Failed to delete photo ${photoId} from Firestore:`, err);
  }
};

// Helper to calculate EventStats dynamically from photos array
export const calculateEventStats = (photosList: Photo[]): EventStats => {
  const totalPhotos = photosList.length;
  const totalLikes = photosList.reduce((acc, p) => acc + (p.likesCount || 0), 0);
  const totalShares = photosList.reduce((acc, p) => acc + (p.sharesCount || 0), 0);
  const engagement =
    totalPhotos > 0
      ? Math.min(99, Math.round(((totalLikes + totalShares) / totalPhotos) * 12 + 45))
      : 78;

  return {
    totalPhotos,
    activeGuests: 280,
    engagementRate: engagement,
    remainingSeconds: 2 * 3600 + 45 * 60,
    eventName: 'Grand Naming Ceremony 👶✨',
    eventDate: 'August 5, 2026',
    location: 'Royal Palace Banquets',
  };
};
