import type {  Disease,  VaccineType } from '@/types';

// Yem türleri veri seti
export const feedTypes = [
  {
    id: 'f1',
    name: 'Arpa',
    category: 'Kesif Yem',
    unit: 'kg',
    nutritionalValue: {
      protein: 11.5,
      energy: 2.9,
      fiber: 5.0
    },
    currentPrice: 9.5,
    lastUpdated: '2024-01-15'
  },
  {
    id: 'f2',
    name: 'Mısır Silajı',
    category: 'Kaba Yem',
    unit: 'kg',
    nutritionalValue: {
      protein: 8.0,
      energy: 2.6,
      fiber: 21.0
    },
    currentPrice: 3.2,
    lastUpdated: '2024-01-15'
  },
  {
    id: 'f3',
    name: 'Yonca Kuru Otu',
    category: 'Kaba Yem',
    unit: 'kg',
    nutritionalValue: {
      protein: 17.0,
      energy: 2.2,
      fiber: 25.0
    },
    currentPrice: 8.5,
    lastUpdated: '2024-01-15'
  },
  {
    id: 'f4',
    name: 'Mısır',
    category: 'Kesif Yem',
    unit: 'kg',
    nutritionalValue: {
      protein: 9.0,
      energy: 3.3,
      fiber: 2.8
    },
    currentPrice: 13.75,
    lastUpdated: '2024-01-15'
  },
  {
    id: 'f5',
    name: 'Buğday Kepeği',
    category: 'Kesif Yem',
    unit: 'kg',
    nutritionalValue: {
      protein: 15.0,
      energy: 2.4,
      fiber: 11.0
    },
    currentPrice: 7.5,
    lastUpdated: '2024-01-15'
  },
  // Diğer yemler...
];

// Büyükbaş türleri veri seti
export const cattleTypes = [
  {
    id: 'ct1',
    name: 'Simental',
    category: 'Kombine',
    description: 'Hem et hem süt verimi yüksek ırk',
    averageWeight: {
      min: 600,
      max: 1200
    },
    dailyFeedNeed: {
      min: 12,
      max: 25
    },
    growthRate: 1.2, // kg/gün
    optimalNutrition: {
      protein: {
        min: 12,
        max: 16
      },
      energy: {
        min: 2.4,
        max: 3.2
      },
      fiber: {
        min: 17,
        max: 22
      }
    }
  },
  {
    id: 'ct2',
    name: 'Holstein',
    category: 'Sütçü',
    description: 'Yüksek süt verimi ile tanınan ırk',
    averageWeight: {
      min: 550,
      max: 750
    },
    dailyFeedNeed: {
      min: 10,
      max: 20
    },
    growthRate: 0.9,
    optimalNutrition: {
      protein: {
        min: 15,
        max: 18
      },
      energy: {
        min: 2.6,
        max: 3.4
      },
      fiber: {
        min: 16,
        max: 20
      }
    }
  },
  {
    id: 'ct3',
    name: 'Angus',
    category: 'Etçi',
    description: 'Et kalitesi ve verimi yüksek ırk',
    averageWeight: {
      min: 650,
      max: 850
    },
    dailyFeedNeed: {
      min: 14,
      max: 28
    },
    growthRate: 1.4,
    optimalNutrition: {
      protein: {
        min: 14,
        max: 17
      },
      energy: {
        min: 2.8,
        max: 3.6
      },
      fiber: {
        min: 15,
        max: 19
      }
    }
  },
  // Diğer türler...
];

// Hastalıklar veri seti
export const diseases: Disease[] = [
  {
    id: 'd1',
    name: 'Şap Hastalığı',
    description: 'Viral bir hastalıktır ve hızla yayılır.',
    symptoms: [
      'Yüksek ateş (40°C üzeri)',
      'Ağız ve ayaklarda yaralar',
      'Aşırı salya akıntısı',
      'Topallık',
      'İştahsızlık'
    ],
    treatment: {
      immediate: [
        'Hasta hayvanı izole edin',
        'Veterinere haber verin',
        'Dezenfeksiyon önlemleri alın'
      ],
      veterinary: [
        'Klinik muayene',
        'Laboratuvar testleri',
        'Antiviral tedavi'
      ],
      medication: [
        'Ağrı kesiciler',
        'Yara tedavisi',
        'Destekleyici tedavi'
      ],
      prevention: [
        'Düzenli aşılama',
        'Karantina önlemleri',
        'Hijyen kurallarına uyma'
      ]
    },
    severity: 'high' as const,
    category: 'Viral',
    commonAge: 'Tüm yaşlar',
    contagious: true,
    incubationPeriod: '2-14 gün',
    recoveryTime: '2-3 hafta',
    references: [
      'Dünya Hayvan Sağlığı Örgütü (OIE)',
      'Gıda ve Tarım Örgütü (FAO)'
    ]
  },
  {
    id: 'd2',
    name: 'Mastitis',
    description: 'Meme dokusunun iltihaplanmasıdır. Süt verimini ve kalitesini etkiler.',
    symptoms: [
      'Memede şişlik ve kızarıklık',
      'Sütte pıhtılaşma ve renk değişimi',
      'Ateş',
      'İştahsızlık',
      'Süt veriminde düşüş'
    ],
    treatment: {
      immediate: [
        'Enfekte memeyi tamamen sağın',
        'Veterinere haber verin',
        'Sağım hijyenine dikkat edin'
      ],
      veterinary: [
        'Antibiyotik tedavisi',
        'Meme içi ilaç uygulaması',
        'Destekleyici tedavi'
      ],
      medication: [
        'Antibiyotikler',
        'Antienflamatuar ilaçlar',
        'Ağrı kesiciler'
      ],
      prevention: [
        'Düzenli meme kontrolü',
        'Sağım hijyeni',
        'Düzenli ekipman dezenfeksiyonu',
        'Stres faktörlerinin azaltılması'
      ]
    },
    severity: 'medium' as const,
    category: 'Bakteriyel',
    commonAge: 'Süt veren inekler',
    contagious: true,
    incubationPeriod: '24-48 saat',
    recoveryTime: '5-7 gün',
    references: [
      'Amerikan Veteriner Hekimler Birliği',
      'Avrupa Süt Federasyonu'
    ]
  },
  {
    id: 'd3',
    name: 'Solunum Yolu Enfeksiyonu (BRD)',
    description: 'Sığırların solunum sistemini etkileyen kompleks hastalık.',
    symptoms: [
      'Öksürük',
      'Burun akıntısı',
      'Hızlı nefes alıp verme',
      'Yüksek ateş',
      'Durgunluk ve iştahsızlık'
    ],
    treatment: {
      immediate: [
        'Hayvanı izole edin',
        'Veterinere haber verin',
        'Ortam havalandırmasını iyileştirin'
      ],
      veterinary: [
        'Klinik muayene',
        'Akciğer oskültasyonu',
        'Antibiyotik tedavisi'
      ],
      medication: [
        'Antibiyotikler',
        'Antienflamatuar ilaçlar',
        'Mukolitik ilaçlar'
      ],
      prevention: [
        'Aşılama programı',
        'İyi havalandırma',
        'Stres yönetimi',
        'Kalabalık barındırmadan kaçınma'
      ]
    },
    severity: 'high' as const,
    category: 'Viral/Bakteriyel',
    commonAge: 'Genç hayvanlar',
    contagious: true,
    incubationPeriod: '3-7 gün',
    recoveryTime: '7-14 gün',
    references: [
      'Dünya Hayvan Sağlığı Örgütü (OIE)',
      'Amerikan Sığır Veteriner Hekimleri Derneği'
    ]
  }
];

// Aşı türleri veri seti
export const vaccineTypes: VaccineType[] = [
  {
    id: 'v1',
    name: 'Şap Aşısı',
    description: 'Şap hastalığına karşı koruyucu aşı',
    frequency: {
      initialAge: 60,        // 2 aylık
      repeatInterval: 180,   // 6 ayda bir tekrar
      isRequired: true
    },
    cattleTypes: ['ct1', 'ct2', 'ct3'], // Tüm sığır türleri için
    notes: 'Yılda 2 kez tekrarlanması önerilir'
  },
  {
    id: 'v2',
    name: 'Brusella Aşısı',
    description: 'Brusella hastalığına karşı koruyucu aşı',
    frequency: {
      initialAge: 120,       // 4 aylık
      repeatInterval: 365,   // Yıllık tekrar
      isRequired: true
    },
    cattleTypes: ['ct1', 'ct2', 'ct3'],
    notes: 'Dişi buzağılara uygulanır'
  },
  {
    id: 'v3',
    name: 'IBR/BVD Aşısı',
    description: 'Solunum yolu hastalıklarına karşı koruyucu aşı',
    frequency: {
      initialAge: 90,        // 3 aylık
      repeatInterval: 365,   // Yıllık tekrar
      isRequired: false
    },
    cattleTypes: ['ct1', 'ct2', 'ct3'],
    notes: 'Sürü sağlığı için önemlidir'
  },
  {
    id: 'v4',
    name: 'Pasteurella Aşısı',
    description: 'Akciğer hastalıklarına karşı koruyucu aşı',
    frequency: {
      initialAge: 45,        // 1.5 aylık
      repeatInterval: 180,   // 6 ayda bir tekrar
      isRequired: false
    },
    cattleTypes: ['ct1', 'ct2', 'ct3'],
    notes: 'Özellikle genç hayvanlarda önemlidir'
  },
  {
    id: 'v5',
    name: 'Clostridial Aşı',
    description: 'Enterotoksemi ve diğer clostridial hastalıklara karşı koruyucu aşı',
    frequency: {
      initialAge: 30,        // 1 aylık
      repeatInterval: 180,   // 6 ayda bir tekrar
      isRequired: true
    },
    cattleTypes: ['ct1', 'ct2', 'ct3'],
    notes: 'Temel aşılama programının parçasıdır'
  }
];

// Yem optimizasyon servisi
export const calculateOptimalFeedMix = (
  cattleType: string,
  weight: number,
  availableFeeds: typeof feedTypes
) => {
  // Hayvan türüne göre optimal besin ihtiyaçlarını bul
  const cattleInfo = cattleTypes.find(ct => ct.id === cattleType);
  if (!cattleInfo) return null;

  // Günlük yem ihtiyacını hesapla
  const dailyFeedNeed = Math.min(
    Math.max(
      weight * 0.025, // Vücut ağırlığının %2.5'i
      cattleInfo.dailyFeedNeed.min
    ),
    cattleInfo.dailyFeedNeed.max
  );

  // Linear Programming ile en uygun kombinasyonu hesapla
  // Bu kısım gerçek bir LP çözücü kullanılarak geliştirilmeli
  // Şimdilik basit bir örnek:
  const optimalMix = {
    feeds: availableFeeds.map(feed => ({
      feedId: feed.id,
      ratio: 100 / availableFeeds.length, // Eşit dağılım (geçici)
      amount: dailyFeedNeed / availableFeeds.length
    })),
    totalCost: 0,
    nutritionalValues: {
      totalProtein: 0,
      totalEnergy: 0,
      totalFiber: 0
    },
    efficiencyScore: 85 // Örnek skor
  };

  // Toplam maliyeti ve besin değerlerini hesapla
  optimalMix.feeds.forEach(feedMix => {
    const feed = availableFeeds.find(f => f.id === feedMix.feedId)!;
    optimalMix.totalCost += feed.currentPrice * feedMix.amount;
    optimalMix.nutritionalValues.totalProtein += feed.nutritionalValue.protein * (feedMix.ratio / 100);
    optimalMix.nutritionalValues.totalEnergy += feed.nutritionalValue.energy * (feedMix.ratio / 100);
    optimalMix.nutritionalValues.totalFiber += feed.nutritionalValue.fiber * (feedMix.ratio / 100);
  });

  return optimalMix;
};