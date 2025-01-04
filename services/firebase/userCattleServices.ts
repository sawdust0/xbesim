import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import type { UserCattle } from '@/types';

export const userCattleServices = {
  getAll: async (userId: string): Promise<UserCattle[]> => {
    try {
      const q = query(collection(db, 'userCattle'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserCattle[];
    } catch (error) {
      console.error('UserCattle getAll error:', error);
      return [];
    }
  },

  add: async (cattle: Omit<UserCattle, 'id'>) => {
    return addDoc(collection(db, 'userCattle'), cattle);
  },

  update: async (id: string, data: Partial<UserCattle>) => {
    const docRef = doc(db, 'userCattle', id);
    return updateDoc(docRef, data);
  },

  delete: async (id: string) => {
    const docRef = doc(db, 'userCattle', id);
    return deleteDoc(docRef);
  }
}; 