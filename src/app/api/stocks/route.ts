import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import { BIST_SECTORS, getAllBistSymbols } from '@/data/bist-sectors';
import { BIST_100 } from '@/data/bist-indexes';
import { getDynamicIPOs, IPOData } from '@/utils/ipo-scraper';
import NodeCache from 'node-cache';

// Initialize a cache instance 
// stdTTL: 120 seconds (2 mins) caching to match the general 15min delay from Yahoo Finance but avoid rate limits on concurrent page reloads
const cache = new NodeCache({ stdTTL: 120, checkperiod: 150 });

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const index = searchParams.get('index') || 'ALL';

    // 1. Check if we have a cached response for this specific index query
    const cacheKey = `stocks_${index}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    let allSymbols: string[] = [];
    let dynamicIPOs: IPOData[] = [];

    if (index === 'HALKAARZ') {
      dynamicIPOs = await getDynamicIPOs();
      allSymbols = dynamicIPOs.map((ipo) => ipo.symbol);
    } else if (index === 'BIST30') {
      const { BIST_30 } = await import('@/data/bist-indexes');
      allSymbols = BIST_30;
    } else if (index === 'BIST100') {
      allSymbols = BIST_100;
    } else {
      // Global fetch for other pages (Ana sayfa — sektörlere göre)
      dynamicIPOs = await getDynamicIPOs();
      const ipoSymbols = dynamicIPOs.map((ipo) => ipo.symbol);
      allSymbols = Array.from(new Set([...getAllBistSymbols(), ...BIST_100, ...ipoSymbols]));
    }
    
    const results = await yahooFinance.quote(allSymbols) as Record<string, unknown>[];
    
    // Create a lookup for fast sector mapping
    const symbolToSector: Record<string, string> = {};
    for (const [sector, symbols] of Object.entries(BIST_SECTORS)) {
      for (const sym of symbols) {
        if (!symbolToSector[sym]) {
          symbolToSector[sym] = sector;
        }
      }
    }

    // Map the raw yahoo-finance data
    const stocks = results.map((result) => {
      const baseObj: Record<string, unknown> = {
        symbol: result.symbol,
        shortName: result.shortName || result.longName || result.symbol,
        regularMarketPrice: result.regularMarketPrice || 0,
        regularMarketChangePercent: result.regularMarketChangePercent || 0,
        regularMarketChange: result.regularMarketChange || 0,
        currency: result.currency || 'TRY',
        sector: symbolToSector[result.symbol as string] || 'Diğer',
      };
      
      const ipoMatch = dynamicIPOs.find(i => i.symbol === result.symbol);
      if (ipoMatch) {
         baseObj.ipoPrice = ipoMatch.ipoPrice;
         baseObj.ipoDate = ipoMatch.ipoDate;
         baseObj.ipoName = ipoMatch.name;
      }
      return baseObj;
    });

    // 2. Save the result to cache before responding
    cache.set(cacheKey, stocks);

    return NextResponse.json(stocks);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
  }
}
