'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userCattleServices } from '@/services/firebase/userCattleServices';
import { feedServices } from '@/services/firebase/feedServices';
import { cattleTypeServices } from '@/services/firebase/cattleTypeServices';
import React from 'react';
import Link from 'next/link';
import { 
  ChartBarIcon, 
  BeakerIcon, 
  CogIcon, 
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  UsersIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { user, userProfile } = useAuth();
  const [stats, setStats] = useState({
    cattleCount: 0,
    feedCount: 0,
    combinationCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;

      try {
        const [cattle, feeds, cattleTypes] = await Promise.all([
          userCattleServices.getAll(user.uid),
          feedServices.getAll(),
          cattleTypeServices.getAll()
        ]);

        setStats({
          cattleCount: cattle.length,
          feedCount: feeds.length,
          combinationCount: cattleTypes.length
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user]);

  const menuItems = [
    {
      title: 'Hayvanlarım',
      description: `${stats.cattleCount} Kayıtlı Hayvan`,
      icon: ChartBarIcon,
      href: '/dashboard/animals',
      color: 'bg-blue-500',
      stats: `${stats.cattleCount} Aktif`,
    },
    {
      title: 'Yem Yönetimi',
      description: 'Yem Türleri ve Fiyatları',
      icon: BeakerIcon,
      href: '/dashboard/feeds',
      color: 'bg-green-500',
      stats: 'Güncel Fiyatlar',
    },
    {
      title: 'Yem Kombinasyonları',
      description: 'Optimum Yem Karışımları',
      icon: CogIcon,
      href: '/dashboard/combinations',
      color: 'bg-purple-500',
      stats: 'Maliyet Optimizasyonu',
    },
    {
      title: 'Aşı Takvimi',
      description: 'Aşı Takibi',
      icon: ShieldCheckIcon,
      href: '/dashboard/vaccines',
      color: 'bg-red-500',
      stats: 'Zamanı Gelen Aşılar',
    },
    {
      title: 'Hastalık Rehberi',
      description: 'Hastalık ve Tedaviler',
      icon: ClipboardDocumentListIcon,
      href: '/dashboard/diseases',
      color: 'bg-yellow-500',
      stats: 'Bilgi Bankası',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 opacity-10" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Hoş Geldiniz, {userProfile?.username || user?.displayName || 'Kullanıcı'}
              </h1>
              <p className="mt-2 text-base text-gray-600 max-w-2xl">
                Besi yönetim sisteminizde bugün neler yapmak istersiniz?
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm">
                <CalendarIcon className="h-5 w-5 text-indigo-500" />
                <span>{new Date().toLocaleDateString('tr-TR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Toplam Hayvan</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.cattleCount}</p>
                <p className="text-xs text-blue-600 mt-1">Aktif Kayıt</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <BeakerIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Yem Çeşidi</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.feedCount}</p>
                <p className="text-xs text-green-600 mt-1">Güncel Veri</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <CogIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Kombinasyon</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.combinationCount}</p>
                <p className="text-xs text-purple-600 mt-1">Optimize Edilmiş</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <ShieldCheckIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Planlı Aşı</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
                <p className="text-xs text-yellow-600 mt-1">Bu Hafta</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Main Menu Items */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group transform transition-all duration-200 hover:scale-102"
              >
                <div className="relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color} bg-opacity-10`}>
                        <item.icon className={`h-6 w-6 ${item.color.replace('bg-', 'text-')}`} aria-hidden="true" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          {item.stats}
                        </span>
                        <span className="text-sm text-indigo-600 group-hover:translate-x-1 transition-transform">
                          Detaylar →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Additional Content */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent Activity */}
            <div className="rounded-xl bg-white shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Son Aktiviteler</h3>
                  <button className="text-sm text-indigo-600 hover:text-indigo-700">
                    Tümünü Gör →
                  </button>
                </div>
                <div className="mt-6 flow-root">
                  {loading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <CalendarIcon className="h-8 w-8 text-gray-400" />
                        <p className="ml-4 text-sm text-gray-600">
                          Henüz aktivite bulunmuyor.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl bg-white shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Hızlı İşlemler</h3>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <Link
                    href="/dashboard/animals"
                    className="flex items-center justify-center space-x-2 rounded-xl bg-blue-50 p-4 text-center hover:bg-blue-100 transition-colors"
                  >
                    <PlusIcon className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">
                      Yeni Hayvan Ekle
                    </span>
                  </Link>
                  <Link
                    href="/dashboard/vaccines"
                    className="flex items-center justify-center space-x-2 rounded-xl bg-green-50 p-4 text-center hover:bg-green-100 transition-colors"
                  >
                    <CalendarIcon className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      Aşı Planla
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 