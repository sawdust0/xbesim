import { NextResponse } from 'next/server';
import { seedDatabase } from '@/scripts/seedDatabase';

export async function GET() {
  // Sadece development ortamında çalışsın
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Bu endpoint sadece development ortamında kullanılabilir' },
      { status: 403 }
    );
  }

  try {
    await seedDatabase();
    return NextResponse.json({ 
      success: true,
      message: 'Veritabanı başarıyla dolduruldu'
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Veritabanı doldurulurken hata oluştu',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    );
  }
} 