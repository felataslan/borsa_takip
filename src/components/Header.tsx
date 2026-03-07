"use client";

import React from 'react';
import Link from 'next/link';
import { Activity, Star } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur supports-[backdrop-filter]:bg-gray-950/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-white">
          <Activity className="h-6 w-6 text-green-500" />
          <span className="font-bold text-xl tracking-tight">Borsa<span className="text-green-500">Takip</span></span>
        </Link>
        <nav className="flex items-center space-x-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-white ${
              pathname === '/' ? 'text-white' : 'text-gray-400'
            }`}
          >
            Piyasalar
          </Link>
          <Link
            href="/favorites"
            className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-white ${
              pathname === '/favorites' ? 'text-white' : 'text-gray-400'
            }`}
          >
            <Star className="h-4 w-4" />
            <span>Favoriler</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
