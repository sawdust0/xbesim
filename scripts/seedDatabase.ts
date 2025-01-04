import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';
import { feedTypes, cattleTypes, diseases, vaccineTypes } from '@/data/sampleData';
import { firebaseConfig } from '@/lib/firebase';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function seedDatabase() {
  try {
    const batch = writeBatch(db);

    // Yem türlerini ekle
    console.log('Yem türleri ekleniyor...');
    for (const feed of feedTypes) {
      const docRef = doc(collection(db, 'feeds'));
      batch.set(docRef, {
        ...feed,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    // Büyükbaş türlerini ekle
    console.log('Büyükbaş türleri ekleniyor...');
    for (const cattle of cattleTypes) {
      const docRef = doc(collection(db, 'cattleTypes'));
      batch.set(docRef, {
        ...cattle,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    // Hastalık bilgilerini ekle
    console.log('Hastalık bilgileri ekleniyor...');
    for (const disease of diseases) {
      const docRef = doc(collection(db, 'diseases'));
      batch.set(docRef, {
        ...disease,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    // Aşı türlerini ekle
    console.log('Aşı türleri ekleniyor...');
    for (const vaccine of vaccineTypes) {
      const docRef = doc(collection(db, 'vaccineTypes'));
      batch.set(docRef, {
        ...vaccine,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    // Örnek yem kombinasyonları ekle
    console.log('Örnek yem kombinasyonları ekleniyor...');
    const sampleCombination = {
      userId: 'TEST_USER_ID', // Kendi user ID'nizi kullanın
      cattleName: 'Test Sığır',
      totalCost: 150.5,
      efficiencyScore: 85,
      nutritionalValues: {
        totalProtein: 16.5,
        totalEnergy: 2.8,
        totalFiber: 22.0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const combinationRef = doc(collection(db, 'feedCombinations'));
    batch.set(combinationRef, sampleCombination);

    await batch.commit();
    console.log('Veritabanı başarıyla dolduruldu!');

  } catch (error) {
    console.error('Veritabanı doldurulurken hata:', error);
  }
} 