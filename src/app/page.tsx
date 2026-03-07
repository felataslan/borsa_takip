'use client';

import React, { useEffect, useState } from 'react';
import { Stock } from '@/types/stock.types';
import StockCard from '@/components/StockCard';
import { Activity } from 'lucide-react';

export default function Home() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStocks() {
      try {
        const response = await fetch('/api/stocks');
        if (!response.ok) {
          throw new Error('Veriler gelirken bir hata oluştu');
        }
        const data = await response.json();
        setStocks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }
    fetchStocks();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchStocks, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const renderStocks = () => {
    // Group stocks by sector
    const groupedStocks = stocks.reduce((acc, stock) => {
      const sector = stock.sector || 'Diğer';
      if (!acc[sector]) {
        acc[sector] = [];
      }
      acc[sector].push(stock);
      return acc;
    }, {} as Record<string, Stock[]>);

    return (
      <div className="space-y-12 relative z-10">
        {Object.entries(groupedStocks).map(([sector, sectorStocks]) => (
          <div key={sector} className="space-y-4">
            <h2 className="text-xl font-semibold text-white border-b border-gray-800 pb-2">{sector}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {sectorStocks.map((stock, idx) => (
                <StockCard key={stock.symbol} stock={stock} index={idx} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 relative z-10">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <Activity className="h-8 w-8 text-green-500" />
          Borsa İstanbul Piyasaları
        </h1>
        <p className="mt-2 text-gray-400 max-w-2xl">
          En çok işlem gören BİST hisselerinin güncel fiyatları ve değişim oranları. (Veriler Yahoo Finance üzerinden 15 dk gecikmeli sağlanmaktadır)
        </p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-800 border-t-green-500" />
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-red-900/20 p-8 border border-red-500/30 text-center max-w-lg mx-auto mt-12 backdrop-blur">
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      ) : (
        renderStocks()
      )}
      
      {/* Background decoration elements */}
      <div className="fixed top-20 right-0 -z-10 h-64 w-64 rounded-full bg-green-500/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-blue-500/5 blur-[150px] pointer-events-none" />
    </div>
  );
}
