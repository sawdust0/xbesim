import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { CattleType } from '@/types';

export const cattleTypeServices = {
  getAll: async (): Promise<CattleType[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'cattleTypes'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CattleType[];
    } catch (error) {
      console.error('CattleTypes getAll error:', error);
      return [];
    }
  }
}; 