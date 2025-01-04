'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { diseaseServices } from '@/services/firebase/diseaseServices';
import type { Disease } from '@/types';

import { 
  MagnifyingGlassIcon, 
  ExclamationTriangleIcon,
  HeartIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

export default function DiseasesPage() {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const loadDiseases = useCallback(async () => {
    try {
      const diseasesData = await diseaseServices.getAll();
      setDiseases(diseasesData);
    } catch (error) {
      console.error('Error loading diseases:', error);
    }
  }, []);

  useEffect(() => {
    loadDiseases();
  }, [loadDiseases]);

  const categories = useMemo(() => ['Viral', 'Bakteriyel', 'Paraziter', 'Metabolik'], []);

  const filteredDiseases = useMemo(() => {
    return diseases.filter(disease => {
      const matchesSearch = disease.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || disease.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [diseases, searchTerm, selectedCategory]);

  const getSeverityColor = useCallback((severity: Disease['severity']) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const statsData = useMemo(() => ({
    totalDiseases: diseases.length,
    highRiskCount: diseases.filter(d => d.severity === 'high').length
  }), [diseases]);

  const Header = useMemo(() => (
    <div className="relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl opacity-10" />
      
      <div className="relative px-6 py-8 sm:px-8 rounded-2xl border border-gray-100 bg-white/50 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Hastalık Rehberi
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-2xl">
              Büyükbaş hayvanlarda görülen hastalıklar, belirtileri ve tedavi yöntemleri hakkında kapsamlı bilgi bankası
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm">
              <ClipboardDocumentListIcon className="h-5 w-5 text-indigo-500" />
              <span>Toplam {statsData.totalDiseases} Hastalık</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              <span>{statsData.highRiskCount} Yüksek Risk</span>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                placeholder="Hastalık ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-64">
            <select
              className="block w-full pl-3 pr-10 py-2.5 text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Tüm Kategoriler</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  ), [categories, searchTerm, selectedCategory, statsData]);

  const DiseasesList = useMemo(() => (
    <div className="mt-8 space-y-6">
      {filteredDiseases.map((disease) => (
        <div key={disease.id} className="bg-white shadow-lg sm:rounded-xl overflow-hidden transition-all duration-200 hover:shadow-xl border border-gray-100">
          <div className="px-6 py-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className={`flex-shrink-0 p-3 rounded-lg ${
                  disease.severity === 'high' ? 'bg-red-50' :
                  disease.severity === 'medium' ? 'bg-yellow-50' :
                  'bg-green-50'
                }`}>
                  <ExclamationTriangleIcon className={`h-6 w-6 ${
                    disease.severity === 'high' ? 'text-red-600' :
                    disease.severity === 'medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`} />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {disease.name}
                  </h3>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{disease.category}</span>
                    <span className="text-gray-300">•</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(disease.severity)}`}>
                      {disease.severity === 'high' ? 'Yüksek Risk' : 
                       disease.severity === 'medium' ? 'Orta Risk' : 'Düşük Risk'}
                    </span>
                  </div>
                </div>
              </div>

              {disease.contagious && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Bulaşıcı Hastalık
                </span>
              )}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 flex items-center">
                  <HeartIcon className="h-4 w-4 mr-2 text-red-500" />
                  Belirtiler
                </h4>
                <ul className="mt-2 space-y-1">
                  {disease.symptoms.map((symptom, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="mr-2">•</span>
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 flex items-center">
                  <ClipboardDocumentListIcon className="h-4 w-4 mr-2 text-blue-500" />
                  Tedavi Yöntemi
                </h4>
                <div className="mt-2 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500">Acil Müdahale</p>
                    <p className="mt-1 text-sm text-gray-600">{disease.treatment.immediate.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Veteriner Tedavisi</p>
                    <p className="mt-1 text-sm text-gray-600">{disease.treatment.veterinary.join(', ')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 sm:col-span-2 lg:col-span-1">
             
                <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <QuestionMarkCircleIcon className="h-4 w-4 mr-2 text-green-500" />Detaylı Bilgi</h4>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Yaygın Görüldüğü Yaş:</span>
                    <span className="text-gray-900">{disease.commonAge}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Kuluçka Süresi:</span>
                    <span className="text-gray-900">{disease.incubationPeriod}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">İyileşme Süresi:</span>
                    <span className="text-gray-900">{disease.recoveryTime}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 sm:col-span-2 lg:col-span-3">
                <h4 className="text-sm font-medium text-gray-900 flex items-center">
                  <ShieldCheckIcon className="h-4 w-4 mr-2 text-green-500" />
                  Korunma Yöntemleri
                </h4>
                <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {disease.treatment.prevention.map((method, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                      {method}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ), [filteredDiseases, getSeverityColor]);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {Header}
        {DiseasesList}
      </div>
    </div>
  );
} 