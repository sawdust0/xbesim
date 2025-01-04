import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import type { FeedType } from '@/types';

export const feedServices = {
  // Tüm yemleri getir
  getAll: async (): Promise<FeedType[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'feeds'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FeedType[];
    } catch (error) {
      console.error('Feeds getAll error:', error);
      return [];
    }
  },

  // Kategoriye göre yemleri getir
  getByCategory: async (category: string): Promise<FeedType[]> => {
    try {
      const q = query(
        collection(db, 'feeds'),
        where('category', '==', category)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FeedType[];
    } catch (error) {
      console.error('Feeds getByCategory error:', error);
      return [];
    }
  },

  // Fiyat aralığına göre yemleri getir
  getByPriceRange: async (min: number, max: number): Promise<FeedType[]> => {
    try {
      const q = query(
        collection(db, 'feeds'),
        where('currentPrice', '>=', min),
        where('currentPrice', '<=', max)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FeedType[];
    } catch (error) {
      console.error('Feeds getByPriceRange error:', error);
      return [];
    }
  }
}; 