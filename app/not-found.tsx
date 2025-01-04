'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function NotFoundContent() {
  try {
    const searchParams = useSearchParams();
    const returnUrl = searchParams?.get('from') || '/';

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Sayfa Bulunamadı
          </h2>
          <p className="text-gray-600">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
          <div className="mt-6">
            <Link
              href={returnUrl}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    // Fallback içeriği
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Sayfa Bulunamadı
          </h2>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default function NotFound() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md text-center">
            <h2 className="text-3xl font-bold text-gray-900">Yükleniyor...</h2>
          </div>
        </div>
      }
    >
      <NotFoundContent />
    </Suspense>
  );
} 