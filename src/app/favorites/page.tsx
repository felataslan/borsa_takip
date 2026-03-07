'use client';

import React from 'react';
import StockCard from '@/components/StockCard';
import { Star } from 'lucide-react';
import { useFavoritesStore } from '@/store/useFavoritesStore';

export default function FavoritesPage() {
  const { favorites } = useFavoritesStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 relative z-10">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
          Favori Hisselerim
        </h1>
        <p className="mt-2 text-gray-400 max-w-2xl">
          Takip ettiğiniz BİST hisselerinin güncel performansları.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-2xl bg-gray-900/50 p-12 border border-gray-800 text-center max-w-2xl mx-auto mt-12 backdrop-blur">
          <Star className="h-12 w-12 text-gray-700 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-white">Henüz favori hisseniz yok</h2>
          <p className="text-gray-400">
            Piyasalar ekranından incelediğiniz hisseleri yıldız ikonuna tıklayarak favorilerinize ekleyebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 relative z-10">
          {favorites.map((stock, idx) => (
            <StockCard key={stock.symbol} stock={stock} index={idx} />
          ))}
        </div>
      )}
      
      {/* Background decoration elements */}
      <div className="fixed top-20 left-0 -z-10 h-64 w-64 rounded-full bg-yellow-500/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 -z-10 h-96 w-96 rounded-full bg-orange-500/5 blur-[150px] pointer-events-none" />
    </div>
  );
}
