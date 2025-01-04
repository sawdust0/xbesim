import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import type { 
  CattleType, 
  FeedType, 
  UserCattle, 
  VaccinationRecord, 
  FeedCombination,
  VaccineType
} from '@/types';

// Büyükbaş Hayvan Türleri Servisleri
export const cattleTypeServices = {
  getAll: async () => {
    const querySnapshot = await getDocs(collection(db, 'cattleTypes'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CattleType[];
  },

  getById: async (id: string) => {
    const docRef = doc(db, 'cattleTypes', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as CattleType;
    }
    return null;
  }
};

// Yem Türleri Servisleri
export const feedTypeServices = {
  getAll: async () => {
    const querySnapshot = await getDocs(collection(db, 'feedTypes'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FeedType[];
  },

  getById: async (id: string) => {
    const docRef = doc(db, 'feedTypes', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as FeedType;
    }
    return null;
  },

  updatePrice: async (id: string, newPrice: number) => {
    const docRef = doc(db, 'feedTypes', id);
    await updateDoc(docRef, {
      currentPrice: newPrice,
      lastUpdated: new Date().toISOString()
    });
  }
};

// Kullanıcının Hayvanları Servisleri
export const userCattleServices = {
  getAll: async (userId: string) => {
    const q = query(collection(db, 'userCattle'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as UserCattle[];
  },

  add: async (cattle: Omit<UserCattle, 'id'>) => {
    const docRef = await addDoc(collection(db, 'userCattle'), cattle);
    return docRef.id;
  },

  update: async (id: string, data: Partial<UserCattle>) => {
    const docRef = doc(db, 'userCattle', id);
    await updateDoc(docRef, data);
  },

  delete: async (id: string) => {
    await deleteDoc(doc(db, 'userCattle', id));
  }
};

// Yem Kombinasyonları Servisleri
export const feedCombinationServices = {
  getAll: async (userId: string) => {
    const q = query(collection(db, 'feedCombinations'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FeedCombination[];
  },

  add: async (combination: Omit<FeedCombination, 'id'>) => {
    const docRef = await addDoc(collection(db, 'feedCombinations'), combination);
    return docRef.id;
  },

  update: async (id: string, data: Partial<FeedCombination>) => {
    const docRef = doc(db, 'feedCombinations', id);
    await updateDoc(docRef, data);
  },

  delete: async (id: string) => {
    await deleteDoc(doc(db, 'feedCombinations', id));
  }
};

// Aşı kayıtları servisleri
export const vaccinationServices = {
  getAll: async (cattleId: string) => {
    const q = query(
      collection(db, 'vaccinations'), 
      where('cattleId', '==', cattleId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as VaccinationRecord[];
  },

  add: async (vaccination: Omit<VaccinationRecord, 'id'>) => {
    const docRef = await addDoc(collection(db, 'vaccinations'), {
      ...vaccination,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  },

  update: async (id: string, data: Partial<VaccinationRecord>) => {
    const docRef = doc(db, 'vaccinations', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  },

  delete: async (id: string) => {
    await deleteDoc(doc(db, 'vaccinations', id));
  }
};

// Aşı türleri servisi
export const vaccineTypeServices = {
  getAll: async () => {
    const querySnapshot = await getDocs(collection(db, 'vaccineTypes'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as VaccineType[];
  }
}; 