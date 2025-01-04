import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";
import React from 'react';

const exo2 = Exo_2({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-exo2',
});

export const metadata: Metadata = {
  title: "Besicim - Büyükbaş hayvan yönetimi ve optimizasyonu için kapsamlı çözüm",
  description: "Büyükbaş hayvan yönetimi ve optimizasyonu için kapsamlı çözüm",
  icons: {
    icon: [
      {
        url: "/default_logo.png",
        href: "/default_logo.png",
      }
    ]
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Besicim",
  },
  openGraph: {
    images: [
      {
        url: "/default_logo.png",
        width: 512,
        height: 512,
        alt: "Besicim Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" type="image/png" href="/default_logo.png" />
        <link rel="apple-touch-icon" href="/default_logo.png" />
      </head>
      <body className={`${exo2.variable} font-exo2 antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
