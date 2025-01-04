'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

import { userCattleServices, cattleTypeServices } from '@/services/firebase';
import { PlusIcon, PencilIcon, TrashIcon, CalendarIcon, UserGroupIcon, ChartBarIcon, HeartIcon } from '@heroicons/react/24/outline';
import { AnimalForm } from '@/components/animals/AnimalForm';
import type { UserCattle, CattleType } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export default function AnimalsPage() {
  const { user } = useAuth();
  const [animals, setAnimals] = useState<UserCattle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<UserCattle | null>(null);
  const [cattleTypes, setCattleTypes] = useState<CattleType[]>([]);

  const loadData = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [animalsData, cattleTypesData] = await Promise.all([
        userCattleServices.getAll(user.uid),
        cattleTypeServices.getAll()
      ]);
      setAnimals(animalsData);
      setCattleTypes(cattleTypesData);
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEdit = useCallback((animal: UserCattle) => {
    setSelectedAnimal(animal);
    setIsFormOpen(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Bu hayvanı silmek istediğinizden emin misiniz?')) {
      try {
        await userCattleServices.delete(id);
        setAnimals(prev => prev.filter(animal => animal.id !== id));
      } catch (error) {
        console.error('Silme hatası:', error);
      }
    }
  }, []);

  const handleAddNew = useCallback(() => {
    setSelectedAnimal(null);
    setIsFormOpen(true);
  }, []);

  const handleFormSubmit = useCallback(async (data: Partial<UserCattle>) => {
    if (!user) return;
    
    try {
      const optimisticAnimal: UserCattle = {
        id: selectedAnimal?.id || Date.now().toString(),
        ...(data as Omit<UserCattle, 'id'>),
        userId: user.uid,
        vaccinations: [],
        healthRecords: []
      };

      if (selectedAnimal) {
        setAnimals(prev => prev.map(animal => 
          animal.id === selectedAnimal.id ? optimisticAnimal : animal
        ));
      } else {
        setAnimals(prev => [...prev, optimisticAnimal]);
      }

      setIsFormOpen(false);
      setSelectedAnimal(null);

      if (selectedAnimal) {
        await userCattleServices.update(selectedAnimal.id, data);
      } else {
        const id = await userCattleServices.add({
          ...(data as Omit<UserCattle, 'id'>),
          userId: user.uid,
          vaccinations: [],
          healthRecords: []
        });
        
        const savedAnimal: UserCattle = {
          id,
          userId: user.uid,
          name: data.name || '',
          type: data.type || '',
          birthDate: data.birthDate || '',
          weight: data.weight || 0,
          purchaseDate: data.purchaseDate || '',
          purchasePrice: data.purchasePrice || 0,
          notes: data.notes || '',
          vaccinations: [],
          healthRecords: []
        };
        
        setAnimals(prev => prev.map(animal => 
          animal.id === optimisticAnimal.id ? savedAnimal : animal
        ));
      }
    } catch (error) {
      console.error('Kayıt hatası:', error);
      if (selectedAnimal) {
        loadData();
      } else {
        setAnimals(prev => prev.filter(animal => animal.id !== Date.now().toString()));
      }
    }
  }, [selectedAnimal, user, loadData]);

  const cattleTypeMap = useMemo(() => {
    return cattleTypes.reduce((acc, type) => {
      acc[type.id] = type.name;
      return acc;
    }, {} as Record<string, string>);
  }, [cattleTypes]);

  const renderContent = useMemo(() => {
    if (loading) {
      return (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      );
    }

    if (animals.length === 0) {
      return (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <PlusIcon className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Kayıtlı hayvan bulunmuyor</h3>
          <p className="mt-2 text-sm text-gray-500">Yeni hayvan ekleyerek başlayın.</p>
        </div>
      );
    }

    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul role="list" className="divide-y divide-gray-200">
          {animals.map((animal) => (
            <li key={animal.id} className="transition duration-150 ease-in-out">
              <div className="px-6 py-6 hover:bg-gray-50">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="relative h-20 w-20">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10 px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 whitespace-nowrap">
                        {cattleTypeMap[animal.type] || 'Bilinmeyen'}
                      </div>
                      
                      <div className="h-full w-full rounded-lg border-2 border-indigo-200 bg-indigo-50 flex items-center justify-center overflow-hidden">
                        <Image
                          src="/default_logo.png"
                          alt={animal.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {animal.name}
                      </h3>
                      <div className="text-sm text-gray-500">
                        ID: {animal.id.slice(0, 8)}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ağırlık
                          </div>
                          <p className="mt-1 text-sm text-gray-900">
                            {animal.weight} kg
                          </p>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Doğum Tarihi
                          </div>
                          <p className="mt-1 text-sm text-gray-900">
                            {new Date(animal.birthDate).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Aşı Durumu
                          </div>
                          <p className="mt-1 text-sm text-gray-900">
                            {animal.vaccinations.length} Aşı Kaydı
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Alış Tarihi
                          </div>
                          <p className="mt-1 text-sm text-gray-900">
                            {new Date(animal.purchaseDate).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Alış Fiyatı
                          </div>
                          <p className="mt-1 text-sm text-gray-900">
                            {animal.purchasePrice.toLocaleString('tr-TR')} ₺
                          </p>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sağlık Durumu
                          </div>
                          <p className="mt-1 text-sm text-gray-900">
                            {animal.healthRecords.length} Sağlık Kaydı
                          </p>
                        </div>
                      </div>
                    </div>

                    {animal.notes && (
                      <div className="mt-4">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Notlar
                        </div>
                        <p className="mt-1 text-sm text-gray-900">
                          {animal.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 flex flex-col space-y-3">
                    <button
                      onClick={() => handleEdit(animal)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                    >
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Düzenle
                    </button>
                    <Link
                      href={`/dashboard/vaccines?cattleId=${animal.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
                    >
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Aşı Takibi
                    </Link>
                    <button
                      onClick={() => handleDelete(animal.id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
                    >
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }, [animals, cattleTypeMap, handleDelete, handleEdit, loading]);

  const Header = useMemo(() => (
    <div className="relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl opacity-10" />
      
      <div className="relative px-6 py-8 sm:px-8 rounded-2xl border border-gray-100 bg-white/50 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Hayvan Yönetimi
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-2xl">
              Büyükbaş hayvanlarınızın kayıtları, sağlık durumları ve aşı takipleri
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm">
              <UserGroupIcon className="h-5 w-5 text-indigo-500" />
              <span>Toplam {animals.length} Hayvan</span>
            </div>
            <button
              onClick={handleAddNew}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Yeni Hayvan Ekle
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ortalama Ağırlık</p>
              <p className="text-lg font-semibold text-gray-900">
                {animals.length > 0 
                  ? `${(animals.reduce((acc, animal) => acc + animal.weight, 0) / animals.length).toFixed(1)} kg`
                  : '0 kg'
                }
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Planlı Aşılar</p>
              <p className="text-lg font-semibold text-gray-900">
                {animals.reduce((acc, animal) => acc + animal.vaccinations.length, 0)} Aşı
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <HeartIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Sağlık Kayıtları</p>
              <p className="text-lg font-semibold text-gray-900">
                {animals.reduce((acc, animal) => acc + animal.healthRecords.length, 0)} Kayıt
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ), [animals, handleAddNew]);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {Header}
        {renderContent}

        <AnimalForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedAnimal(null);
          }}
          onSubmit={handleFormSubmit}
          initialData={selectedAnimal || undefined}
          cattleTypes={cattleTypes}
        />
      </div>
    </div>
  );
} 