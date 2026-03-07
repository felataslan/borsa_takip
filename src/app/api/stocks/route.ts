import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import { BIST_SECTORS, getAllBistSymbols } from '@/data/bist-sectors';
import { BIST_100 } from '@/data/bist-indexes';
import { getDynamicIPOs, IPOData } from '@/utils/ipo-scraper';

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const index = searchParams.get('index');

    let allSymbols: string[] = [];
    let dynamicIPOs: IPOData[] = [];
    
    if (index === 'HALKAARZ') {
       dynamicIPOs = await getDynamicIPOs();
       allSymbols = dynamicIPOs.map(ipo => ipo.symbol);
    } else {
       // Global fetch for other pages
       dynamicIPOs = await getDynamicIPOs();
       const ipoSymbols = dynamicIPOs.map(ipo => ipo.symbol);
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

    return NextResponse.json(stocks);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
  }
}
