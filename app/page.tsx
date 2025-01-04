import React from 'react';
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center">
             
              <h1 className="text-2xl font-bold text-indigo-600">Besicim</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Giriş Yap
              </Link>
              <Link
                href="/register"
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Kayıt Ol
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="py-20">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Modern Besi Yönetimi</span>
              <span className="block text-indigo-600">Tek Platformda</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Büyükbaş hayvan besiciliğinde verimi artırın, maliyetleri düşürün.
              Yem kombinasyonları, sağlık takibi ve daha fazlası için BesiAPP'i
              kullanın.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Hemen Başla
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Daha Fazla Bilgi
              </Link>
            </div>
          </div>
        </main>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              title="Hayvan Takibi"
              description="Büyükbaş hayvanlarınızın detaylı kayıtlarını tutun, gelişimlerini takip edin."
              icon="🐮"
            />
            <Feature
              title="Yem Optimizasyonu"
              description="En uygun yem kombinasyonlarını oluşturun, maliyetlerinizi minimize edin."
              icon="🌾"
            />
            <Feature
              title="Sağlık Yönetimi"
              description="Aşı takvimleri ve hastalık kayıtları ile sağlık yönetimini kolaylaştırın."
              icon="💉"
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-gray-200">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2024 BesiAPP. Tüm hakları saklıdır.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Feature({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-500">{description}</p>
    </div>
  );
}
