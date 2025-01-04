'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { FormField, Input, Select, Textarea } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import type { CattleType, UserCattle } from '@/types';

interface AnimalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  cattleTypes?: CattleType[];
  initialData: UserCattle | null | undefined;
}

export function AnimalForm({
  isOpen,
  onClose,
  onSubmit,
  cattleTypes,
  initialData
}: AnimalFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || '',
    birthDate: initialData?.birthDate || '',
    weight: initialData?.weight || '',
    purchaseDate: initialData?.purchaseDate || '',
    purchasePrice: initialData?.purchasePrice || '',
    notes: initialData?.notes || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form field update handlers
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit({
        ...formData,
        weight: Number(formData.weight),
        purchasePrice: Number(formData.purchasePrice),
        userId: 'current-user-id'
      });
      onClose();
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [formData, onSubmit, onClose]);

  // Memoize form fields
  const FormFields = useMemo(() => (
    <>
      <FormField label="Küpe No / İsim">
        <Input
          required
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
        />
      </FormField>

      <FormField label="Tür">
        <Select
          required
          value={formData.type}
          onChange={(e) => handleInputChange('type', e.target.value)}
        >
          <option value="">Seçiniz</option>
          {cattleTypes?.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name} - {type.category}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Doğum Tarihi">
        <Input
          type="date"
          required
          value={formData.birthDate}
          onChange={(e) => handleInputChange('birthDate', e.target.value)}
        />
      </FormField>

      <FormField label="Ağırlık (kg)">
        <Input
          type="number"
          required
          value={formData.weight}
          onChange={(e) => handleInputChange('weight', e.target.value)}
        />
      </FormField>

      <FormField label="Alım Tarihi">
        <Input
          type="date"
          required
          value={formData.purchaseDate}
          onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
        />
      </FormField>

      <FormField label="Alım Fiyatı (TL)">
        <Input
          type="number"
          required
          value={formData.purchasePrice}
          onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
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
  ), [formData, cattleTypes, handleInputChange]);

  // Memoize form actions
  const FormActions = useMemo(() => (
    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
      <Button
        type="submit"
        disabled={loading}
        className="w-full sm:col-start-2"
      >
        {loading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Kaydediliyor...
          </span>
        ) : (
          initialData ? 'Güncelle' : 'Kaydet'
        )}
      </Button>
      <Button
        type="button"
        variant="secondary"
        onClick={onClose}
        disabled={loading}
        className="mt-3 w-full sm:col-start-1 sm:mt-0"
      >
        İptal
      </Button>
    </div>
  ), [loading, initialData, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Hayvan Düzenle' : 'Yeni Hayvan Ekle'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {FormFields}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {FormActions}
      </form>
    </Modal>
  );
} 