import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PortfolioItem {
  symbol: string;
  lots: number;
  averageCost?: number; // Optional: user could input their buying price
}

interface PortfolioState {
  items: PortfolioItem[];
  addOrUpdateStock: (symbol: string, lots: number, averageCost?: number) => void;
  removeStock: (symbol: string) => void;
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      items: [],
      addOrUpdateStock: (symbol, lots, averageCost) =>
        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.symbol === symbol);
          if (existingIndex >= 0) {
            // Update existing
            const newItems = [...state.items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              lots,
              ...(averageCost !== undefined && { averageCost }),
            };
            return { items: newItems };
          }
          // Add new
          return { items: [...state.items, { symbol, lots, averageCost }] };
        }),
      removeStock: (symbol) =>
        set((state) => ({
          items: state.items.filter((item) => item.symbol !== symbol),
        })),
    }),
    {
      name: 'portfolio-storage', // key in localStorage
    }
  )
);
