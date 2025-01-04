import { diseases } from '@/data/sampleData';
import type { Disease } from '@/types';

export const diseaseServices = {
  // Tüm hastalıkları getir
  getAll: async (): Promise<Disease[]> => {
    return diseases;
  },

  // Kategoriye göre hastalıkları getir
  getByCategory: async (category: string): Promise<Disease[]> => {
    return diseases.filter(disease => disease.category === category);
  },

  // Risk seviyesine göre hastalıkları getir
  getBySeverity: async (severity: 'low' | 'medium' | 'high'): Promise<Disease[]> => {
    return diseases.filter(disease => disease.severity === severity);
  },

  // Hastalık ara
  search: async (query: string): Promise<Disease[]> => {
    const searchTerm = query.toLowerCase();
    return diseases.filter(disease => 
      disease.name.toLowerCase().includes(searchTerm) ||
      disease.description.toLowerCase().includes(searchTerm) ||
      disease.symptoms.some((symptom: string) => 
        symptom.toLowerCase().includes(searchTerm)
      )
    );
  },

  // Bulaşıcı hastalıkları getir
  getContagious: async (): Promise<Disease[]> => {
    return diseases.filter(disease => disease.contagious);
  },

  // Yaş grubuna göre hastalıkları getir
  getByAgeGroup: async (ageGroup: string): Promise<Disease[]> => {
    return diseases.filter(disease => 
      disease.commonAge.toLowerCase().includes(ageGroup.toLowerCase())
    );
  }
}; 