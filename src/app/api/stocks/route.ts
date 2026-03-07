import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import { Stock } from '@/types/stock.types';

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

import { BIST_SECTORS, getAllBistSymbols } from '@/data/bist-sectors';

export async function GET() {
  try {
    const allSymbols = getAllBistSymbols();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results = await yahooFinance.quote(allSymbols) as any[];
    
    // Create a lookup for fast sector mapping
    const symbolToSector: Record<string, string> = {};
    for (const [sector, symbols] of Object.entries(BIST_SECTORS)) {
      for (const sym of symbols) {
        if (!symbolToSector[sym]) {
          symbolToSector[sym] = sector;
        }
      }
    }

    // Map the raw yahoo-finance data to our Stock type
    const stocks: Stock[] = results.map((result) => ({
      symbol: result.symbol,
      shortName: result.shortName || result.longName || result.symbol,
      regularMarketPrice: result.regularMarketPrice || 0,
      regularMarketChangePercent: result.regularMarketChangePercent || 0,
      regularMarketChange: result.regularMarketChange || 0,
      currency: result.currency || 'TRY',
      sector: symbolToSector[result.symbol] || 'Diğer',
    }));

    return NextResponse.json(stocks);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
  }
}
