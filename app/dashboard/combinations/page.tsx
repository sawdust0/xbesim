'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { combinationServices } from '@/services/firebase/combinationServices';
import { BeakerIcon, ScaleIcon, SparklesIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import type { FeedCombination } from '@/types';

export default function CombinationsPage() {
  const { user } = useAuth();
  const [combinations, setCombinations] = useState<FeedCombination[]>([]);

  const loadCombinations = useCallback(async () => {
    if (!user) return;
    
    try {
      const combinationsData = await combinationServices.getAllForUser(user.uid);
      setCombinations(combinationsData);
    } catch (error) {
      console.error('Error loading combinations:', error);
    }
  }, [user]);

  useEffect(() => {
    loadCombinations();
  }, [loadCombinations]);

  // Memoize calculated values
  const stats = useMemo(() => {
    const averageCost = combinations.length
      ? (combinations.reduce((acc, comb) => acc + comb.totalCost, 0) / combinations.length).toFixed(2)
      : '0';

    return {
      totalCount: combinations.length,
      averageCost: `${averageCost} ₺`
    };
  }, [combinations]);

  // Memoize the combinations list
  const CombinationsList = useMemo(() => {
    if (combinations.length === 0) {
      return (
        <div className="text-center py-12">
          <BeakerIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Kombinasyon bulunamadı
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Yeni bir yem kombinasyonu oluşturarak başlayın.
          </p>
        </div>
      );
    }

    return (
      <ul role="list" className="divide-y divide-gray-200">
        {combinations.map((combination) => (
          <li key={combination.id}>
            <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BeakerIcon className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">
                      {combination.cattleName} için Optimum Karışım
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Günlük maliyet: {combination.totalCost} ₺ • Verimlilik Skoru: {combination.efficiencyScore}/100
                    </p>
                  </div>
                </div>
                <div className="text-sm text-green-600 font-medium">
                  En Verimli Kombinasyon
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <div className="flex-1">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <span className="font-medium">Protein:</span>{' '}
                        {combination.nutritionalValues.totalProtein}%
                      </div>
                      <div>
                        <span className="font-medium">Enerji:</span>{' '}
                        {combination.nutritionalValues.totalEnergy} Mcal
                      </div>
                      <div>
                        <span className="font-medium">Lif:</span>{' '}
                        {combination.nutritionalValues.totalFiber}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }, [combinations]);

  const Header = useMemo(() => (
    <div className="relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl opacity-10" />
      
      <div className="relative px-6 py-8 sm:px-8 rounded-2xl border border-gray-100 bg-white/50 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Yem Kombinasyonları
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-2xl">
              Hayvanlarınız için optimize edilmiş, maliyet-etkin yem karışımları
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm">
              <BeakerIcon className="h-5 w-5 text-indigo-500" />
              <span>Toplam {combinations.length} Kombinasyon</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm">
              <SparklesIcon className="h-5 w-5 text-green-500" />
              <span>Optimizasyon Aktif</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <BeakerIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Aktif Kombinasyonlar</p>
              <p className="text-lg font-semibold text-gray-900">
                {stats.totalCount} Adet
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <ScaleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ortalama Maliyet</p>
              <p className="text-lg font-semibold text-gray-900">
                {stats.averageCost}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Verimlilik Skoru</p>
              <p className="text-lg font-semibold text-gray-900">
                {combinations.length > 0 
                  ? `${(combinations.reduce((acc, c) => acc + c.efficiencyScore, 0) / combinations.length).toFixed(1)}/100`
                  : '0/100'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ), [combinations, stats]);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {Header}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {CombinationsList}
        </div>
      </div>
    </div>
  );
} 