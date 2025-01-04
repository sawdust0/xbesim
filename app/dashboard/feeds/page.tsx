'use client';

import React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';

import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  CalendarIcon, 
  GiftIcon, 
  SparklesIcon, 
  SunIcon, 
  CloudIcon, 
  FireIcon, 
  BeakerIcon, 
  CircleStackIcon, 
  Square3Stack3DIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';

import type { FeedType } from '@/types';
import { feedServices } from '@/services/firebase/feedServices';

// Yem kategorileri için ikon mapping
const categoryIcons: Record<string, React.ElementType> = {
  'Kaba Yem': CircleStackIcon,
  'Kesif Yem': Square3Stack3DIcon,
  'Karma Yem': BeakerIcon,
  'Silaj': CloudIcon,
  'Tahıl': GiftIcon,
  'Vitamin': SparklesIcon,
  'Mineral': FireIcon,
  'Diğer': SunIcon
};

export default function FeedsPage() {
  const [feeds, setFeeds] = useState<FeedType[]>([]);

  const loadFeeds = useCallback(async () => {
    try {
      const feedsData = await feedServices.getAll();
      setFeeds(feedsData);
    } catch (error) {
      console.error('Error loading feeds:', error);
    }
  }, []);

  useEffect(() => {
    loadFeeds();
  }, [loadFeeds]);

  // Memoize calculated values
  const statsData = useMemo(() => {
    const avgProtein = feeds.length > 0
      ? (feeds.reduce((acc, feed) => acc + feed.nutritionalValue.protein, 0) / feeds.length).toFixed(1)
      : '0';

    return {
      totalFeeds: feeds.length,
      averageProtein: `${avgProtein}%`
    };
  }, [feeds]);

  // Memoize feed categories
  const feedsByCategory = useMemo(() => {
    return feeds.reduce((acc, feed) => {
      if (!acc[feed.category]) {
        acc[feed.category] = [];
      }
      acc[feed.category].push(feed);
      return acc;
    }, {} as Record<string, FeedType[]>);
  }, [feeds]);

  // Memoize stats overview component
  const StatsOverview = useMemo(() => (
    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
      <div className="bg-white overflow-hidden shadow-lg rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Toplam Yem Çeşidi
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {statsData.totalFeeds}
                  </div>
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <span className="sr-only">Artış</span>
                    Çeşit
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow-lg rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-green-50 rounded-lg">
                <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Ortalama Protein
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {statsData.averageProtein}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow-lg rounded-lg">
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <CalendarIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Son Güncelleme</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date().toLocaleDateString('tr-TR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ), [statsData]);

  // Memoize feed categories component
  const FeedCategories = useMemo(() => (
    <div className="mt-8 space-y-8">
      {Object.entries(feedsByCategory).map(([category, categoryFeeds]) => (
        <div key={category} className="bg-white shadow sm:rounded-lg overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-indigo-50 to-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                {category}
              </h3>
              <span className="text-sm text-gray-500">
                {categoryFeeds.length} çeşit yem
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yem Adı
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Besin Değerleri
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fiyat Bilgisi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categoryFeeds.map((feed) => (
                  <tr key={feed.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                          {React.createElement(categoryIcons[feed.category] || SunIcon, {
                            className: "h-6 w-6 text-indigo-600"
                          })}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{feed.name}</div>
                          <div className="text-sm text-gray-500">{feed.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <div className="w-20 text-xs text-gray-500">Protein</div>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${feed.nutritionalValue.protein}%` }}
                            />
                          </div>
                          <span className="ml-2 text-sm text-gray-900">{feed.nutritionalValue.protein}%</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-20 text-xs text-gray-500">Enerji</div>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${(feed.nutritionalValue.energy / 3) * 100}%` }}
                            />
                          </div>
                          <span className="ml-2 text-sm text-gray-900">{feed.nutritionalValue.energy} Mcal/kg</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-20 text-xs text-gray-500">Lif</div>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-500 rounded-full"
                              style={{ width: `${feed.nutritionalValue.fiber}%` }}
                            />
                          </div>
                          <span className="ml-2 text-sm text-gray-900">{feed.nutritionalValue.fiber}%</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">
                        {feed.currentPrice.toLocaleString('tr-TR')} ₺/{feed.unit}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Son güncelleme: {new Date(feed.lastUpdated).toLocaleDateString('tr-TR')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {feed.priceChange > 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            ↑ %{feed.priceChange}
                          </span>
                        ) : feed.priceChange < 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ↓ %{Math.abs(feed.priceChange)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Sabit
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  ), [feedsByCategory]);

  // Memoize header component
  const Header = useMemo(() => (
    <div className="relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl opacity-10" />
      
      <div className="relative px-6 py-8 sm:px-8 rounded-2xl border border-gray-100 bg-white/50 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Yem Bilgi Bankası
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-2xl">
              Piyasadaki tüm yemlerin güncel fiyat, besin değerleri ve detaylı analizleri
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm">
              <BeakerIcon className="h-5 w-5 text-indigo-500" />
              <span>Toplam {feeds.length} Yem</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm">
              <ClockIcon className="h-5 w-5 text-green-500" />
              <span>Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ortalama Protein</p>
              <p className="text-lg font-semibold text-gray-900">
                {statsData.averageProtein}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Square3Stack3DIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Kategori Sayısı</p>
              <p className="text-lg font-semibold text-gray-900">
                {Object.keys(feedsByCategory).length} Kategori
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <ArrowTrendingUpIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Fiyat Değişimi</p>
              <p className="text-lg font-semibold text-gray-900">
                {feeds.filter(f => f.priceChange > 0).length} Artış
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ), [feeds, statsData, feedsByCategory]);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {Header}
        {FeedCategories}
      </div>
    </div>
  );
} 