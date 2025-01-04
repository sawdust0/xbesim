import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import type { FeedCombination } from '@/types';

export const combinationServices = {
  getAllForUser: async (userId: string): Promise<FeedCombination[]> => {
    try {
      const q = query(
        collection(db, 'feedCombinations'),
        where('userId', '==', userId)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FeedCombination[];
    } catch (error) {
      console.error('Error getting combinations:', error);
      return [];
    }
  },

  add: async (combination: Omit<FeedCombination, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'feedCombinations'), {
        ...combination,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return {
        id: docRef.id,
        ...combination
      } as FeedCombination;
    } catch (error) {
      console.error('Error adding combination:', error);
      throw error;
    }
  }
}; 