import { db } from '@/lib/firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { cattleTypes } from '@/data/sampleData';
import { vaccineTypes } from '@/data/sampleData';

export const seedCattleTypes = async () => {
  try {
    const batch = writeBatch(db);
    
    for (const type of cattleTypes) {
      const docRef = doc(collection(db, 'cattleTypes'), type.id);
      batch.set(docRef, {
        name: type.name,
        category: type.category,
        description: type.description,
        averageWeight: type.averageWeight,
        dailyFeedNeed: type.dailyFeedNeed,
        growthRate: type.growthRate
      });
    }

    await batch.commit();
    console.log('Cattle types seeded successfully');
  } catch (error) {
    console.error('Error seeding cattle types:', error);
  }
};

export const seedVaccineTypes = async () => {
  try {
    const batch = writeBatch(db);
    
    for (const vaccine of vaccineTypes) {
      const docRef = doc(collection(db, 'vaccineTypes'));
      batch.set(docRef, {
        ...vaccine,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    await batch.commit();
    console.log('Aşı türleri başarıyla eklendi');
  } catch (error) {
    console.error('Aşı türleri eklenirken hata:', error);
    throw error;
  }
}; 