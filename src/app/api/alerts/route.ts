import { NextResponse } from 'next/server';
import { alertStorage } from '@/utils/alert-storage';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contact, symbols } = body;

    if (!contact || (!contact.email && !contact.phone) || !symbols || !symbols.length) {
      return NextResponse.json({ error: 'Geçersiz veri. İletişim bilgisi ve en az bir hisse gereklidir.' }, { status: 400 });
    }

    await alertStorage.addOrUpdate({
      contact,
      symbols
    });

    return NextResponse.json({ success: true, message: 'Bildirim isteği başarıyla kaydedildi.' });
  } catch (err) {
    console.error('Error saving alert:', err);
    return NextResponse.json({ error: 'Uyarı kaydedilirken bir hata oluştu.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const alerts = await alertStorage.getAll();
    return NextResponse.json(alerts);
  } catch (err) {
    console.error('Error fetching alerts:', err);
    return NextResponse.json({ error: 'Alınamadı' }, { status: 500 });
  }
}
