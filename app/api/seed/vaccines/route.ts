import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { vaccineTypes } from '@/data/sampleData';

export async function GET() {
  // Sadece development ortamında çalışsın
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Bu endpoint sadece development ortamında kullanılabilir' },
      { status: 403 }
    );
  }

  try {
    const batch = writeBatch(db);

    // Aşı türlerini ekle
    for (const vaccine of vaccineTypes) {
      const docRef = doc(collection(db, 'vaccineTypes'));
      batch.set(docRef, {
        ...vaccine,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    await batch.commit();
    
    return NextResponse.json({ 
      success: true,
      message: 'Aşı türleri başarıyla eklendi',
      count: vaccineTypes.length
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Aşı türleri eklenirken hata oluştu',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    );
  }
} 