'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

import { 
  CalendarIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  ClockIcon,
  PlusIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { VaccinePlannerModal } from '@/components/vaccines/VaccinePlannerModal';
import { userCattleServices, vaccineTypeServices, vaccinationServices } from '@/services/firebase';
import type { VaccinationRecord, UserCattle, VaccineType } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { cattleTypes } from '@/data/sampleData';

export default function VaccinesPage() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<VaccinationRecord[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [animals, setAnimals] = useState<UserCattle[]>([]);
  const [vaccineTypes, setVaccineTypes] = useState<VaccineType[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<UserCattle | null>(null);
  const [isAnimalSelectOpen, setIsAnimalSelectOpen] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const [userAnimals, vaccineTypesData] = await Promise.all([
        userCattleServices.getAll(user.uid),
        vaccineTypeServices.getAll()
      ]);

      setAnimals(userAnimals);
      setVaccineTypes(vaccineTypesData);

      // Tüm aşı kayıtlarını paralel olarak yükle
      const vaccinationPromises = userAnimals.map(animal => 
        vaccinationServices.getAll(animal.id)
      );
      const animalVaccinations = await Promise.all(vaccinationPromises);
      const allVaccinations = animalVaccinations.flat();

      // Aşı durumlarını güncelle
      const today = new Date();
      const updatedVaccinations = allVaccinations.map(vaccination => {
        const dueDate = new Date(vaccination.nextDueDate);
        let status = vaccination.status;

        if (status === 'scheduled' && dueDate < today) {
          status = 'overdue';
          // Veritabanında durumu güncelle
          vaccinationServices.update(vaccination.id, { status: 'overdue' });
        }

        return { ...vaccination, status };
      });

      setSchedules(updatedVaccinations);
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddVaccination = useCallback(async (data: Omit<VaccinationRecord, 'id'>) => {
    try {
      // Backend'e kaydet ve ID al
      const savedId = await vaccinationServices.add(data);
      
      // Yeni aşı kaydını oluştur
      const newVaccination: VaccinationRecord = {
        ...data,
        id: savedId
      };

      // State'i güncelle
      setSchedules(prev => [...prev, newVaccination]);
      setIsFormOpen(false);
      setSelectedAnimal(null);
    } catch (error) {
      console.error('Aşı planlama hatası:', error);
    }
  }, []);

  const handleStatusUpdate = useCallback(async (vaccinationId: string, newStatus: 'completed' | 'scheduled' | 'overdue') => {
    try {
      // Optimistic update
      setSchedules(prev => prev.map(schedule => 
        schedule.id === vaccinationId 
          ? { ...schedule, status: newStatus }
          : schedule
      ));

      // Backend güncelleme
      await vaccinationServices.update(vaccinationId, { status: newStatus });
    } catch (error) {
      console.error('Durum güncelleme hatası:', error);
      // Hata durumunda orijinal duruma geri dön
      await loadData();
    }
  }, [loadData]);

  const getAnimalName = useCallback((cattleId: string) => {
    return animals.find(animal => animal.id === cattleId)?.name || 'Bilinmeyen Hayvan';
  }, [animals]);

  const getVaccineName = useCallback((vaccineTypeId: string) => {
    return vaccineTypes.find(type => type.id === vaccineTypeId)?.name || 'Bilinmeyen Aşı';
  }, [vaccineTypes]);

  const getAnimalType = useCallback((typeId: string) => {
    const cattleType = cattleTypes.find(type => type.id === typeId);
    return cattleType ? cattleType.name : 'Bilinmeyen tür';
  }, []);

  const handleAnimalSelect = useCallback((animal: UserCattle) => {
    setSelectedAnimal(animal);
    setIsAnimalSelectOpen(false);
    setIsFormOpen(true);
  }, []);

  // Memoize computed values
  const filteredSchedules = useMemo(() => 
    schedules.filter(schedule => 
      selectedStatus === 'all' || schedule.status === selectedStatus
    ),
    [schedules, selectedStatus]
  );

  const stats = useMemo(() => ({
    total: schedules.length,
    completed: schedules.filter(s => s.status === 'completed').length,
    scheduled: schedules.filter(s => s.status === 'scheduled').length,
    overdue: schedules.filter(s => s.status === 'overdue').length,
  }), [schedules]);

  // Memoize UI Components
  const Header = useMemo(() => (
    <div className="relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl opacity-10" />
      
      <div className="relative px-6 py-8 sm:px-8 rounded-2xl border border-gray-100 bg-white/50 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Aşı Takvimi
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-2xl">
              Hayvanlarınızın aşı takibi ve planlama yönetimi
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm">
              <BeakerIcon className="h-5 w-5 text-indigo-500" />
              <span>Toplam {schedules.length} Aşı</span>
            </div>
            <button
              onClick={() => setIsAnimalSelectOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Yeni Aşı Planla
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Yaklaşan Aşılar</p>
              <p className="text-lg font-semibold text-gray-900">
                {stats.scheduled} Adet
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Geciken Aşılar</p>
              <p className="text-lg font-semibold text-gray-900">
                {stats.overdue} Adet
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tamamlanan</p>
              <p className="text-lg font-semibold text-gray-900">
                {stats.completed} Adet
              </p>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mt-6">
          <select
            className="block w-full sm:w-64 pl-3 pr-10 py-2.5 text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm bg-white"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Tüm Aşılar</option>
            <option value="completed">Tamamlanan</option>
            <option value="scheduled">Yaklaşan</option>
            <option value="overdue">Geciken</option>
          </select>
        </div>
      </div>
    </div>
  ), [schedules, stats, selectedStatus, setSelectedStatus, setIsAnimalSelectOpen]);

  const SchedulesList = useMemo(() => (
    <div className="mt-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {filteredSchedules.length === 0 ? (
          <div className="text-center py-16">
            <CalendarIcon className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Aşı kaydı bulunamadı
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Yeni bir aşı planlaması yaparak başlayın.
            </p>
          </div>
        ) : (
          <ul role="list" className="divide-y divide-gray-200">
            {filteredSchedules.map((schedule) => (
              <li key={schedule.id} className="transition duration-150 ease-in-out">
                <div className="px-6 py-6 hover:bg-gray-50">
                  <div className="flex items-start space-x-6">
                    {/* Sol taraf - İkon ve Durum */}
                    <div className="flex-shrink-0">
                      <div className={`relative h-20 w-20 rounded-lg flex items-center justify-center ${
                        schedule.status === 'completed' ? 'bg-green-50 border-2 border-green-200' :
                        schedule.status === 'scheduled' ? 'bg-blue-50 border-2 border-blue-200' :
                        'bg-red-50 border-2 border-red-200'
                      }`}>
                        {schedule.status === 'completed' ? (
                          <CheckCircleIcon className="h-10 w-10 text-green-600" />
                        ) : schedule.status === 'scheduled' ? (
                          <ClockIcon className="h-10 w-10 text-blue-600" />
                        ) : (
                          <ExclamationCircleIcon className="h-10 w-10 text-red-600" />
                        )}
                        <div className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium ${
                          schedule.status === 'completed' ? 'bg-green-100 text-green-800' :
                          schedule.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {schedule.status === 'completed' ? 'Tamamlandı' :
                           schedule.status === 'scheduled' ? 'Planlandı' :
                           'Gecikmiş'}
                        </div>
                      </div>
                    </div>

                    {/* Orta kısım - Ana Bilgiler */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {getAnimalName(schedule.cattleId)}
                        </h3>
                        <div className="text-sm text-gray-500">
                          ID: {schedule.id.slice(0, 8)}
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Aşı Bilgileri
                            </div>
                            <p className="mt-1 text-sm text-gray-900">
                              {getVaccineName(schedule.vaccineTypeId)}
                            </p>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Planlanan Tarih
                            </div>
                            <p className="mt-1 text-sm text-gray-900">
                              {new Date(schedule.nextDueDate).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Veteriner
                            </div>
                            <p className="mt-1 text-sm text-gray-900">
                              {schedule.veterinarian || 'Belirtilmemiş'}
                            </p>
                          </div>
                          {schedule.status === 'completed' && (
                            <div>
                              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tamamlanma Tarihi
                              </div>
                              <p className="mt-1 text-sm text-gray-900">
                                {new Date(schedule.updatedAt).toLocaleDateString('tr-TR')}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {schedule.notes && (
                        <div className="mt-4">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Notlar
                          </div>
                          <p className="mt-1 text-sm text-gray-900">
                            {schedule.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Sağ taraf - Aksiyonlar */}
                    <div className="flex-shrink-0 flex flex-col space-y-3">
                      {schedule.status !== 'completed' && (
                        <button
                          onClick={() => handleStatusUpdate(schedule.id, 'completed')}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
                        >
                          <CheckCircleIcon className="h-4 w-4 mr-2" />
                          Tamamlandı
                        </button>
                      )}
                      {schedule.status === 'scheduled' && (
                        <button
                          onClick={() => handleStatusUpdate(schedule.id, 'overdue')}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
                        >
                          <ExclamationCircleIcon className="h-4 w-4 mr-2" />
                          Gecikti
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  ), [filteredSchedules, getAnimalName, getVaccineName, handleStatusUpdate]);

  const AnimalSelectModal = useMemo(() => (
    <Modal
      isOpen={isAnimalSelectOpen}
      onClose={() => setIsAnimalSelectOpen(false)}
      title="Aşı Planlanacak Hayvanı Seçin"
    >
      <div className="mt-4 space-y-2">
        {animals.length === 0 ? (
          <p className="text-center text-gray-600">
            Kayıtlı hayvan bulunmuyor. Önce hayvan eklemelisiniz.
          </p>
        ) : (
          animals.map((animal) => (
            <button
              key={animal.id}
              onClick={() => handleAnimalSelect(animal)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-lg font-medium text-indigo-600">
                      {animal.name[0].toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-800">
                    {animal.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {getAnimalType(animal.type)}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </Modal>
  ), [animals, isAnimalSelectOpen, handleAnimalSelect, getAnimalType]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Yükleniyor...</div>;
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {Header}
        {SchedulesList}

        {selectedAnimal && (
          <VaccinePlannerModal
            isOpen={isFormOpen}
            onClose={() => {
              setIsFormOpen(false);
              setSelectedAnimal(null);
            }}
            onSubmit={handleAddVaccination}
            cattle={selectedAnimal}
            vaccineTypes={vaccineTypes}
          />
        )}

        {AnimalSelectModal}
      </div>
    </div>
  );
} 
 