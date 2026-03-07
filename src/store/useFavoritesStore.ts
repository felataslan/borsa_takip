import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Stock } from '@/types/stock.types';

interface FavoritesState {
  favorites: Stock[];
  addFavorite: (stock: Stock) => void;
  removeFavorite: (symbol: string) => void;
  isFavorite: (symbol: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (stock) =>
        set((state) => {
          if (!state.favorites.find((f) => f.symbol === stock.symbol)) {
            return { favorites: [...state.favorites, stock] };
          }
          return state;
        }),
      removeFavorite: (symbol) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.symbol !== symbol),
        })),
      isFavorite: (symbol) => {
        return !!get().favorites.find((f) => f.symbol === symbol);
      },
    }),
    {
      name: 'borsa-favorites-storage', // key in localStorage
    }
  )
);
