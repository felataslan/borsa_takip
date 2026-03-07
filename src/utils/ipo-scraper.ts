import * as cheerio from 'cheerio';

export interface IPOData {
  symbol: string;
  ipoPrice: number;
  ipoDate: string;
  name: string;
}

// In-memory cache
let cachedIPOs: IPOData[] | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours

export async function getDynamicIPOs(): Promise<IPOData[]> {
  const now = Date.now();
  if (cachedIPOs && (now - lastFetchTime < CACHE_DURATION_MS)) {
    return cachedIPOs;
  }

  try {
    const response = await fetch('https://halkarz.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 3600 } // Next.js cache revalidation
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from halkarz.com: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const allLinks: string[] = [];
    $('a').each((_, el) => {
      const href = $(el).attr('href');
      if (href) allLinks.push(href);
    });

    // Filter to valid company links and get the first 15 unique
    const validLinkFilter = (l: string) => l.startsWith('https://halkarz.com/') && l.endsWith('-a-s/');
    const uniqueLinks = [...new Set(allLinks.filter(validLinkFilter))].slice(0, 15);
    
    // Now fetch details for each link concurrently
    const ipoDetailsPromises = uniqueLinks.map(async (url) => {
      try {
        const detailRes = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0'
          }
        });
        if (!detailRes.ok) return null;
        const detailHtml = await detailRes.text();
        const _$ = cheerio.load(detailHtml);
        
        let name = _$('h1').first().text().replace('A.Ş.', '').trim();
        if (name.length > 20) {
            name = name.split(' O')[0].split(' S')[0].trim();
        }

        let symbol = '';
        const titleText = _$('title').text() || '';
        const titleMatch = titleText.match(/\(([^)]+)\)/);
        if (titleMatch && titleMatch[1]) {
           symbol = titleMatch[1].trim() + '.IS';
        }

        let price = 0;
        let date = 'Bilinmiyor';

        _$('table tr').each((_, row) => {
           const rowText = _$(row).text();
           if (rowText.includes('Fiyat')) {
             const pStr = _$(row).find('td').last().text().replace(',', '.').replace(/[^0-9.]/g, '');
             if (pStr) price = parseFloat(pStr);
           }
           if (rowText.includes('İşlem Tarihi')) {
             date = _$(row).find('td').last().text().trim();
           }
        });

        // If no symbol or price found, it might not be a valid completed IPO
        if (!symbol || !price) return null;

        return {
          symbol,
          ipoPrice: price,
          ipoDate: date,
          name
        };
      } catch (err) {
        console.error("Error fetching detail:", url, err);
        return null;
      }
    });

    const results = await Promise.all(ipoDetailsPromises);
    const validIPOs = results.filter((ipo): ipo is IPOData => ipo !== null);

    if (validIPOs.length > 0) {
      cachedIPOs = validIPOs;
      lastFetchTime = now;
      return validIPOs;
    }

    return [];

  } catch (error) {
    console.error('Error fetching dynamic IPOs:', error);
    if (cachedIPOs) return cachedIPOs;
    return [];
  }
}
