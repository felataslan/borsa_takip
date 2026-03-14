import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import { BIST_100 } from '@/data/bist-indexes';
import { TopGainerStock } from '@/types/stock.types';

// Her 12 saatte bir yenile (ISR Cache)
export const revalidate = 43200;

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey', 'ripHistorical'] });

export async function GET() {
  try {
    const symbols = BIST_100;
    const now = new Date();
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(now.getFullYear() - 5);
    const period1 = fiveYearsAgo.toISOString().split('T')[0];

    const results: Record<string, TopGainerStock[]> = {
      '3m': [],
      '6m': [],
      '1y': [],
      '5y': [],
    };

    // Bellekte tutulan sonuçlar
    const stockStats: Array<{
      symbol: string;
      shortName: string;
      currentPrice: number;
      p3m?: number | null;
      p6m?: number | null;
      p1y?: number | null;
      p5y?: number | null;
    }> = [];

    // Chunk'lar halinde işlem yap (API limitlerine takılmamak için)
    const chunkSize = 20;
    for (let i = 0; i < symbols.length; i += chunkSize) {
      const chunk = symbols.slice(i, i + chunkSize);
      
      const promises = chunk.map(async (symbol) => {
        try {
          const period2 = now.toISOString().split('T')[0];
          const params = { period1, period2, interval: '1mo' as const };
          const data = await yahooFinance.historical(symbol, params);
          if (!data || data.length === 0) return null;

          // En son veri bugünkü/yakın zamanki fiyatı temsil eder
          const currentData = data[data.length - 1];
          const currentPrice = currentData.close;
          
          if (!currentPrice) return null;

          // Ay farkına göre geçmiş fiyatları bul (yaklaşık)
          const getPriceMonthsAgo = (months: number) => {
            if (data.length <= months) return null;
            return data[data.length - 1 - months].close;
          };

          const p3m = getPriceMonthsAgo(3);
          const p6m = getPriceMonthsAgo(6);
          const p1y = getPriceMonthsAgo(12);
          // 5 yıl (60 ay) verisi tam olmayabilir, elimizdeki en eski veriyi alıp eğer min 55 ay varsa kabul edebiliriz
          const p5y = data.length >= 55 ? data[0].close : null;

          // Sembol bilgisi (kısa ad için yahoo finance name lazım ama historical dönmez, symbol'den çıkarabiliriz veya quote atabiliriz. Optimizasyon için symbol kullanıyoruz.)
          const shortName = symbol.replace('.IS', '');

          return { symbol, shortName, currentPrice, p3m, p6m, p1y, p5y };
        } catch {
          // Bazı hisseler bulunamayabilir (silinmiş, yeni halka arz vb.)
          return null;
        }
      });

      const chunkResults = await Promise.all(promises);
      for (const res of chunkResults) {
        if (res) stockStats.push(res);
      }
    }

    // Her periyot için kazançları hesaplayıp sıralama yap
    const calculateTopGainers = (
      periodName: '3m' | '6m' | '1y' | '5y',
      priceKey: 'p3m' | 'p6m' | 'p1y' | 'p5y'
    ) => {
      const validStocks = stockStats.filter((s) => s[priceKey] !== null && s[priceKey] !== undefined);
      
      const gainers: TopGainerStock[] = validStocks.map((s) => {
        const startPrice = s[priceKey]!;
        const gainPercent = ((s.currentPrice - startPrice) / startPrice) * 100;
        return {
          symbol: s.symbol,
          shortName: s.shortName,
          currentPrice: s.currentPrice,
          gainPercent,
          periodStartPrice: startPrice,
          period: periodName,
        };
      });

      // En yüksek kazançtan en düşüğe sırala ve top 20'yi al
      return gainers.sort((a, b) => b.gainPercent - a.gainPercent).slice(0, 20);
    };

    results['3m'] = calculateTopGainers('3m', 'p3m');
    results['6m'] = calculateTopGainers('6m', 'p6m');
    results['1y'] = calculateTopGainers('1y', 'p1y');
    results['5y'] = calculateTopGainers('5y', 'p5y');

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching top gainers:', error);
    return NextResponse.json({ error: 'Failed to fetch top gainers data' }, { status: 500 });
  }
}
