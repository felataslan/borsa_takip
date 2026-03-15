import { IPOStock } from '@/types/stock.types';

/**
 * Transforms raw API stock data (which may have partial IPO fields) into the
 * strongly-typed IPOStock shape used by the Halka Arz page and its components.
 */
export function toIPOStock(stock: Record<string, unknown>): IPOStock {
  const currentPrice =
    (stock.regularMarketPrice as number) ||
    (stock.price as number) ||
    (stock.ipoPrice as number) ||
    0;
  const ipoPrice = (stock.ipoPrice as number) || 0;
  const totalReturnPercent = ipoPrice > 0 ? ((currentPrice - ipoPrice) / ipoPrice) * 100 : 0;

  return {
    symbol: stock.symbol as string,
    shortName: (stock.shortName as string) || (stock.ipoName as string) || (stock.symbol as string),
    regularMarketPrice: currentPrice,
    regularMarketChangePercent: (stock.regularMarketChangePercent as number) || 0,
    regularMarketChange: 0,
    currency: 'TRY',
    ipoPrice,
    ipoDate: (stock.ipoDate as string) || 'Bilinmiyor',
    ipoName: (stock.ipoName as string) || (stock.shortName as string) || (stock.symbol as string),
    totalReturnPercent,
  };
}
