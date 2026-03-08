import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;

    if (!symbol) {
      return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }

    const cleanSymbol = symbol.replace('.IS', '').toUpperCase();
    const tvSymbol = `BIST:${cleanSymbol}`;
    
    const url = `https://news-headlines.tradingview.com/v2/headlines?client=web&lang=tr&symbol=${encodeURIComponent(tvSymbol)}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      next: { revalidate: 300 } // Cache for 5 mins
    });

    if (!response.ok) {
      throw new Error(`TradingView API responded with ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.items) {
      return NextResponse.json([]);
    }

    const threeMonthsAgo = Math.floor(Date.now() / 1000) - (3 * 30 * 24 * 60 * 60);

    const formattedNews = data.items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((item: any) => item.published >= threeMonthsAgo)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => ({
        id: item.id,
        title: item.title,
        source: item.source || item.provider,
        provider: item.provider,
        published: item.published, 
        link: item.storyPath && item.storyPath.startsWith('/') 
          ? `https://tr.tradingview.com${item.storyPath}` 
          : item.link || '',
      }));

    return NextResponse.json(formattedNews);
  } catch (error: unknown) {
    console.error(`Error fetching news for symbol:`, error);
    return NextResponse.json(
      { error: 'Şirket haberleri alınırken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
