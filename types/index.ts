// Büyükbaş Hayvan Türleri
export interface CattleType {
  id: string;
  name: string;          // örn: "Simental", "Holstein", "Angus"
  category: string;      // örn: "Etçi", "Sütçü", "Kombine"
  description: string;
  averageWeight: {
    min: number;
    max: number;
  };
  dailyFeedNeed: {
    min: number;         // kg cinsinden minimum günlük yem ihtiyacı
    max: number;         // kg cinsinden maximum günlük yem ihtiyacı
  };
  growthRate: number;    // Aylık ortalama kilo artışı
}

// Yem Türleri
export interface FeedType {
  id: string;
  name: string;          // örn: "Arpa", "Mısır", "Saman"
  description: string;
  category: string;      // örn: "Kaba Yem", "Kesif Yem", "Karma Yem"
  unit: string;         // örn: "kg", "ton"
  nutritionalValue: {
    protein: number;     // Protein oranı (%)
    energy: number;      // Metabolik enerji (Mcal/kg)
    fiber: number;      // Lif oranı (%)
  };
  currentPrice: number;  // Birim fiyat (TL)
  lastUpdated: string;   // Fiyat güncelleme tarihi
  priceChange: number;
}

// Kullanıcının Hayvanları
export interface UserCattle {
  id: string;
  name: string;
  type: string;
  weight: number;
  userId: string;
  birthDate: string;
  purchaseDate: string;
  purchasePrice: number;
  notes?: string;
  vaccinations: VaccinationRecord[];
  healthRecords: HealthRecord[];
}

// Aşı Kayıtları
export interface VaccinationRecord {
  id: string;
  cattleId: string;
  vaccineTypeId: string;
  date: string;
  nextDueDate: string;
  status: 'completed' | 'scheduled' | 'overdue';
  veterinarian?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Sağlık Kayıtları
export interface HealthRecord {
  id: string;
  cattleId: string;
  condition: string;    // Hastalık/durum adı
  startDate: string;
  endDate?: string;
  treatment?: string;
  veterinarian?: string;
  notes?: string;
}

// Yem Kombinasyonu
export interface FeedCombination {
  id: string;
  userId: string;
  name: string;
  cattleTypeId: string;
  cattleName: string;
  feeds: {
    feedId: string;
    ratio: number;
    amount: number;
  }[];
  totalCost: number;
  nutritionalValues: {
    totalProtein: number;
    totalEnergy: number;
    totalFiber: number;
  };
  efficiencyScore: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Disease {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  treatment: {
    immediate: string[];
    veterinary: string[];
    medication: string[];
    prevention: string[];
  };
  severity: 'low' | 'medium' | 'high';
  category: string;
  commonAge: string;
  contagious: boolean;
  incubationPeriod: string;
  recoveryTime: string;
  references: string[];
  images?: string[];
}

// Aşı türleri için interface ekleyin
export interface VaccineType {
  id: string;
  name: string;
  description: string;
  frequency: {
    initialAge: number;     // İlk uygulama yaşı (gün)
    repeatInterval: number; // Tekrar aralığı (gün)
    isRequired: boolean;    // Zorunlu aşı mı?
  };
  cattleTypes: string[];    // Hangi hayvan türleri için uygun
  notes?: string;
} 