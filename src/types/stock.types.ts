export interface Stock {
  symbol: string;
  shortName: string;
  regularMarketPrice: number;
  regularMarketChangePercent: number;
  regularMarketChange: number;
  currency: string;
  sector?: string;
  // IPO fields (populated only for /halkaarz route)
  ipoPrice?: number;
  ipoDate?: string;
  ipoName?: string;
}

/** A Stock enriched with IPO-specific computed fields */
export interface IPOStock extends Required<Pick<Stock, 'ipoPrice' | 'ipoDate' | 'ipoName'>> {
  symbol: string;
  shortName: string;
  regularMarketPrice: number;
  regularMarketChangePercent: number;
  regularMarketChange: number;
  currency: string;
  totalReturnPercent: number;
}

/** En Çok Yükselenler API'si için özel tip */
export interface TopGainerStock {
  symbol: string;
  shortName: string;
  currentPrice: number;
  gainPercent: number;
  periodStartPrice: number;
  period: '3m' | '6m' | '1y' | '5y';
}
