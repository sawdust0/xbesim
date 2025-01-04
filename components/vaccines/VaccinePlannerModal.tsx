'use client';

import React from 'react';
import { useState, useCallback, useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { FormField, Select, Input, Textarea } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import type { VaccineType, UserCattle, VaccinationRecord } from '@/types';

interface VaccinePlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<VaccinationRecord, 'id'>) => Promise<void>;
  cattle: UserCattle;
  vaccineTypes: VaccineType[];
}

export function VaccinePlannerModal({
  isOpen,
  onClose,
  onSubmit,
  cattle,
  vaccineTypes
}: VaccinePlannerModalProps) {
  const [formData, setFormData] = useState({
    vaccineTypeId: '',
    date: '',
    veterinarian: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Memoize compatible vaccines
  const compatibleVaccines = useMemo(() => 
    vaccineTypes.filter(vaccine => vaccine.cattleTypes.includes(cattle.type)),
    [vaccineTypes, cattle.type]
  );

  // Form field update handler
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.vaccineTypeId || !formData.date) {
        throw new Error('Lütfen gerekli alanları doldurun');
      }

      const selectedVaccine = vaccineTypes.find(
        vaccine => vaccine.id === formData.vaccineTypeId
      );
      if (!selectedVaccine) throw new Error('Aşı türü bulunamadı');

      const nextDueDate = new Date(formData.date);
      nextDueDate.setDate(nextDueDate.getDate() + selectedVaccine.frequency.repeatInterval);

      const data: VaccinationRecord = {
        id: crypto.randomUUID(),
        cattleId: cattle.id,
        vaccineTypeId: formData.vaccineTypeId,
        date: formData.date,
        nextDueDate: nextDueDate.toISOString(),
        status: 'scheduled',
        veterinarian: formData.veterinarian,
        notes: formData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Form gönderim hatası:', error);
      setError(error instanceof Error ? error.message : 'Aşı planlanırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Memoize selected vaccine info
  const selectedVaccineInfo = useMemo(() => {
    if (!formData.vaccineTypeId) return null;
    return vaccineTypes.find(v => v.id === formData.vaccineTypeId);
  }, [formData.vaccineTypeId, vaccineTypes]);

  // Memoize form fields
  const FormFields = useMemo(() => (
    <>
      <FormField label="Aşı Türü">
        <Select
          required
          value={formData.vaccineTypeId}
          onChange={(e) => handleInputChange('vaccineTypeId', e.target.value)}
          className="w-full"
        >
          <option value="">Seçiniz</option>
          {compatibleVaccines.map((vaccine) => (
            <option key={vaccine.id} value={vaccine.id}>
              {vaccine.name} {vaccine.frequency.isRequired ? '(Zorunlu)' : '(Opsiyonel)'}
            </option>
          ))}
        </Select>
        {selectedVaccineInfo && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              {selectedVaccineInfo.description}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {selectedVaccineInfo.notes}
            </p>
          </div>
        )}
      </FormField>

      <FormField label="Planlanan Tarih">
        <Input
          type="date"
          required
          value={formData.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
        />
      </FormField>

      <FormField label="Veteriner">
        <Input
          value={formData.veterinarian}
          onChange={(e) => handleInputChange('veterinarian', e.target.value)}
        />
      </FormField>

      <FormField label="Notlar">
        <Textarea
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          rows={3}
        />
      </FormField>
    </>
  ), [formData, compatibleVaccines, selectedVaccineInfo, handleInputChange]);

  // Memoize form actions
  const FormActions = useMemo(() => (
    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
      <Button
        type="submit"
        disabled={loading}
        className="w-full sm:col-start-2"
      >
        {loading ? 'Planlanıyor...' : 'Planla'}
      </Button>
      <Button
        type="button"
        variant="secondary"
        onClick={onClose}
        className="mt-3 w-full sm:col-start-1 sm:mt-0"
      >
        İptal
      </Button>
    </div>
  ), [loading, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Aşı Planla - ${cattle.name}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {FormFields}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {FormActions}
      </form>
    </Modal>
  );
} 