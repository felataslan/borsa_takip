import { NextResponse } from 'next/server';
import { alertStorage, UserAlert } from '@/utils/alert-storage';
import { notificationService } from '@/utils/notification-service';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

/**
 * Bu route manuel olarak tetiklenebilir veya bir cron job tarafından çağrılabilir.
 * Halka arz hisselerinin tavan bozup bozmadığını kontrol eder.
 */
export async function GET(request: Request) {
  try {
    // Basic security for Cron Job
    const { searchParams } = new URL(request.url);
    const cronSecret = searchParams.get('cron_secret');
    const envSecret = process.env.CRON_SECRET;

    if (envSecret && cronSecret !== envSecret) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const alerts = await alertStorage.getAll();
    if (alerts.length === 0) {
      return NextResponse.json({ message: 'Aktif uyarı bulunamadı.' });
    }

    // İzlenen tüm sembolleri topla
    const allSymbols = Array.from(new Set(alerts.flatMap(a => a.symbols)));
    if (allSymbols.length === 0) {
      return NextResponse.json({ message: 'İzlenen sembol bulunamadı.' });
    }

    // Fiyatları çek
    const results = await yahooFinance.quote(allSymbols) as Record<string, unknown>[];
    const stockMap = results.reduce((acc, curr) => {
      acc[curr.symbol as string] = curr;
      return acc;
    }, {} as Record<string, Record<string, unknown>>);

    const notificationsSent: string[] = [];
    const updatedAlerts: UserAlert[] = [...alerts];

    for (const alert of updatedAlerts) {
      for (const symbol of alert.symbols) {
        const stock = stockMap[symbol] as Record<string, unknown> | undefined;
        if (!stock) continue;

        const changePercent = (stock.regularMarketChangePercent as number) || 0;
        const isCurrentlyCeiling = changePercent > 9.7; 
        
        // Eğer daha önce tavandaysa ama şimdi %9.0 altına düştüyse (Tavan bozma simülasyonu)
        // NOT: İlk günlerden tavan serisindeyken bozulması durumu.
        if (alert.lastBreakStatus[symbol] !== true && changePercent < 9.0) {
          // BİLDİRİM GÖNDER
          const symbolShort = symbol.replace('.IS', '');
          const message = `${symbolShort} hissesi tavan bozdu! Anlık değişim: %${changePercent.toFixed(2)}. Fiyat: ${stock.regularMarketPrice as number} ₺`;
          
          if (alert.contact.email) {
            await notificationService.sendEmail({
              to: alert.contact.email,
              subject: `Tavan Bozma Uyarısı: ${symbol.replace('.IS', '')}`,
              text: message
            });
          }
          
          if (alert.contact.phone) {
            await notificationService.sendSms({
              phone: alert.contact.phone,
              message
            });
          }

          // Durumu güncelle
          alert.lastBreakStatus[symbol] = true;
          notificationsSent.push(`${alert.id}-${symbol}`);
        } else if (isCurrentlyCeiling) {
          // Hala tavanda veya yeni tavan oldu
          alert.lastBreakStatus[symbol] = false; 
        }
      }
    }

    // Güncellenmiş durumları kaydet
    await alertStorage.save(updatedAlerts);

    return NextResponse.json({ 
      success: true, 
      processedAlerts: alerts.length,
      notificationsSent: notificationsSent.length,
      details: notificationsSent
    });
  } catch (error) {
    console.error('Check alerts failed:', error);
    return NextResponse.json({ error: 'Uyarular kontrol edilemedi.' }, { status: 500 });
  }
}
