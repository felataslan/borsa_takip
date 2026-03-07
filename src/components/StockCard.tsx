import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingDown, TrendingUp } from 'lucide-react';
import { Stock } from '@/types/stock.types';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for tailwind class merging
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StockCardProps {
  stock: Stock;
  index?: number;
}

export default function StockCard({ stock, index = 0 }: StockCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const favorite = isFavorite(stock.symbol);

  const isPositive = stock.regularMarketChange >= 0;

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (favorite) {
      removeFavorite(stock.symbol);
    } else {
      addFavorite(stock);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-md transition-all hover:border-gray-700 hover:shadow-xl hover:shadow-gray-900/50"
    >
      <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-gray-800/40 to-transparent blur-2xl transition-all group-hover:bg-gradient-to-br group-hover:from-gray-700/40" />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <h3 className="font-bold text-xl text-white tracking-tight">{stock.symbol.replace('.IS', '')}</h3>
          <p className="text-sm text-gray-400 mt-1 max-w-[200px] truncate" title={stock.shortName}>{stock.shortName}</p>
        </div>
        <button
          onClick={toggleFavorite}
          className="rounded-full p-2 transition-colors hover:bg-gray-800 focus:outline-none"
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star
            className={cn(
              'h-5 w-5 transition-all',
              favorite ? 'fill-yellow-500 text-yellow-500' : 'text-gray-500 hover:text-gray-300'
            )}
          />
        </button>
      </div>

      <div className="relative z-10 mt-6 flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-3xl font-bold tracking-tighter text-white">
            {stock.regularMarketPrice.toFixed(2)} <span className="text-lg font-medium text-gray-500">₺</span>
          </span>
        </div>

        <div
          className={cn(
            'flex items-center space-x-1 rounded-full px-3 py-1 text-sm font-semibold backdrop-blur-md',
            isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
          )}
        >
          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span>{stock.regularMarketChangePercent.toFixed(2)}%</span>
        </div>
      </div>
    </motion.div>
  );
}
