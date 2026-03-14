import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import NodeCache from 'node-cache';

// Cache historical data for 5 minutes (300 TTL) to avoid hitting Yahoo Finance repeatedly for the same charts
const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '1d'; // 1d, 2w, 1m, 3m, 6m, 1y
    const { symbol } = await params;

    if (!symbol) {
      return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }

    const cacheKey = `history_${symbol}_${period}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    if (period === '1d') {
      // Fetch the last 3 days to ensure we get data even on Mondays
      const period1 = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const result = await yahooFinance.chart(symbol, { period1, interval: '15m' });
      const allValid = result.quotes.filter((q) => q.close !== null && q.close !== undefined);
      if (allValid.length === 0) return NextResponse.json([]);

      // Filter to only include the most recent trading day's data points
      const lastDate = allValid[allValid.length - 1].date;
      const lastDayStr = lastDate.toISOString().split('T')[0];

      const formattedData = allValid
        .filter((item) => item.date.toISOString().startsWith(lastDayStr))
        .map((item) => ({
          date: item.date.toISOString(),
          price: item.close,
          open: item.open,
          high: item.high,
          low: item.low,
          volume: item.volume,
        }));
      
      cache.set(cacheKey, formattedData);
      return NextResponse.json(formattedData);
    }

    const endDate = new Date();
    const startDate = new Date();

    // Calculate start date based on period
    switch (period) {
      case '2w':
        startDate.setDate(endDate.getDate() - 14);
        break;
      case '1m':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case '3m':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case '6m':
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(endDate.getMonth() - 1);
    }

    const queryOptions = {
      period1: startDate,
      period2: endDate,
      interval: period === '1y' || period === '6m' ? '1d' : '1d' as '1d' | '1wk' | '1mo', // use daily for smoother charts except possibly for longer periods later
    };

    const result = await yahooFinance.historical(symbol, queryOptions);

    // Format the result for Recharts
    const formattedData = result.map((item) => ({
      date: item.date.toISOString(),
      price: item.close, // Using close price
      open: item.open,
      high: item.high,
      low: item.low,
      volume: item.volume,
    }));

    cache.set(cacheKey, formattedData);
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error(`Error fetching historical data for symbol:`, error);
    return NextResponse.json({ error: 'Failed to fetch historical data' }, { status: 500 });
  }
}
