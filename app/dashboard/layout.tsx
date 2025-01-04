'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  HomeIcon,
  ChartBarIcon,
  BeakerIcon,
  CogIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const navigation = [
  { 
    name: 'Genel Bakış',
    href: '/dashboard',
    icon: HomeIcon,
    description: 'Dashboard ve istatistikler'
  },
  {
    name: 'Hayvan Yönetimi',
    href: '/dashboard/animals',
    icon: ChartBarIcon,
    description: 'Hayvan kayıtları ve takibi'
  },
  {
    name: 'Yem Yönetimi',
    href: '/dashboard/feeds',
    icon: BeakerIcon,
    description: 'Yem stok ve maliyetleri'
  },
  {
    name: 'Yem Kombinasyonları',
    href: '/dashboard/combinations',
    icon: CogIcon,
    description: 'Optimum yem karışımları'
  },
  {
    name: 'Aşı Takvimi',
    href: '/dashboard/vaccines',
    icon: ShieldCheckIcon,
    description: 'Aşı planlaması ve takibi'
  },
  {
    name: 'Hastalık Rehberi',
    href: '/dashboard/diseases',
    icon: ClipboardDocumentListIcon,
    description: 'Hastalık bilgileri ve tedaviler'
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, userData, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      const currentPath = window.location.pathname;
      router.replace(`/login?from=${encodeURIComponent(currentPath)}`);
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Çıkış hatası:', error);
    }
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-shrink-0 h-16 px-4 flex items-center justify-between border-b border-gray-200 relative">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute right-0 top-[52px] z-10 w-6 h-6 -mr-3 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50 focus:outline-none"
        >
          {isSidebarOpen ? (
            <ChevronDoubleLeftIcon className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronDoubleRightIcon className="h-4 w-4 text-gray-600" />
          )}
        </button>

        <div className={clsx(
          "flex items-center",
          isSidebarOpen ? "w-full gap-2" : "w-full justify-center"
        )}>
          <div className="flex-shrink-0 relative w-12 h-12">
            <Image
              src="/besicim-logo.png"
              alt="Besicim Logo"
              fill
              className="object-contain w-12 h-12 shrink-0"
              priority
              quality={100}

            />
          </div>
          {isSidebarOpen && (
            <span className="text-2xl font-semibold text-gray-900 whitespace-nowrap">
              Besicim
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  isActive
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center text-sm font-medium border-l-4 rounded-r-lg transition-colors duration-200',
                  isSidebarOpen 
                    ? 'px-3 py-3 justify-start' 
                    : 'px-0 py-3 justify-center'
                )}
                title={item.description}
              >
                <item.icon
                  className={clsx(
                    isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500',
                    'flex-shrink-0 h-6 w-6',
                    isSidebarOpen ? '' : 'mx-auto'
                  )}
                  aria-hidden="true"
                />
                {isSidebarOpen && (
                  <span className="ml-3 text-sm">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex-shrink-0 border-t border-gray-200">
        <div className={clsx(
          "flex items-center",
          isSidebarOpen ? "p-4" : "p-2 justify-center"
        )}>
          {isSidebarOpen ? (
            <div className="flex items-center w-full bg-gray-50/50 p-3 rounded-xl border border-gray-100">
              <div className="flex items-center flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm">
                    <Image
                      src="/default_logo.png"
                      alt="User Avatar"
                      width={32}
                      height={32}
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
                <p className="ml-3 text-sm font-semibold text-gray-900 truncate">
                  {userData?.username}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center justify-center gap-2 ml-3 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-md transition-all duration-200"
              >
                <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                <span>Çıkış</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignOut}
              className="flex flex-col items-center p-2 text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-lg transition-all duration-200 w-full mx-2"
              title="Çıkış Yap"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              <span className="text-xs font-medium mt-1">Çıkış</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 rounded-md bg-white shadow-lg hover:bg-gray-50"
        >
          {isMobileSidebarOpen ? (
            <XMarkIcon className="h-6 w-6 text-gray-600" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>

      <div className="flex h-screen overflow-hidden">
        <div className={clsx(
          "fixed inset-0 z-40 md:hidden transition-transform transform",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="relative flex h-full max-w-xs w-full">
            <div className="flex-1 flex flex-col">
              <SidebarContent />
            </div>
            <div className="opacity-75 fixed inset-0 bg-gray-600" onClick={() => setIsMobileSidebarOpen(false)} />
          </div>
        </div>

        <div className={clsx(
          "hidden md:flex relative",
          isSidebarOpen ? "w-64" : "w-16"
        )}>
          <div className="flex flex-col flex-1 border-r border-gray-200">
            <SidebarContent />
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 