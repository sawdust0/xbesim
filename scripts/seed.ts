import { seedDatabase } from './seedDatabase';

// Script'i çalıştır
seedDatabase()
  .then(() => {
    console.log('Veritabanı başarıyla dolduruldu');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Hata:', error);
    process.exit(1);
  }); 