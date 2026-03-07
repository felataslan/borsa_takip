export const BIST_SECTORS: Record<string, string[]> = {
  'Bankacılık': [
    'AKBNK.IS', 'GARAN.IS', 'ISCTR.IS', 'YKBNK.IS', 'VAKBN.IS',
    'HALKB.IS', 'ALBRK.IS', 'SKBNK.IS', 'TSKB.IS', 'QNBFB.IS'
  ],
  'Holding & Yatırım': [
    'KCHOL.IS', 'SAHOL.IS', 'SISE.IS', 'ENKAI.IS', 'DOHOL.IS',
    'TKFEN.IS', 'AGHOL.IS', 'ALARK.IS', 'NTHOL.IS', 'GLYHO.IS',
    'INVEO.IS', 'GOZDE.IS'
  ],
  'Otomotiv & Yan Sanayi': [
    'FROTO.IS', 'TOASO.IS', 'DOAS.IS', 'TTRAK.IS', 'OTKAR.IS',
    'KARSAN.IS', 'ASUZU.IS', 'BRISA.IS', 'GOODY.IS', 'JANTS.IS'
  ],
  'Enerji': [
    'TUPRS.IS', 'ASTOR.IS', 'ENJSA.IS', 'AKSEN.IS', 'GWIND.IS',
    'ODAS.IS', 'ZOREN.IS', 'CANTE.IS', 'AYDEM.IS', 'ALFAS.IS',
    'EUPWR.IS', 'SMRTG.IS', 'GESAN.IS', 'NATEN.IS', 'MAGEN.IS'
  ],
  'Havacılık & Ulaştırma': [
    'THYAO.IS', 'PGSUS.IS', 'TAVHL.IS', 'CLEBI.IS', 'DOCO.IS'
  ],
  'Perakende & Ticaret': [
    'BIMAS.IS', 'MGROS.IS', 'SOKM.IS', 'CRFSA.IS', 'TKNSA.IS',
    'VAKKO.IS', 'MAVI.IS', 'SUWEN.IS'
  ],
  'Gıda & İçecek': [
    'CCOLA.IS', 'AEFES.IS', 'ULKER.IS', 'TATGD.IS', 'PETUN.IS',
    'PINSU.IS', 'PNSUT.IS', 'BANVT.IS', 'TUKAS.IS', 'YAYLA.IS',
    'KTSKR.IS', 'ALMAD.IS', 'FADE.IS'
  ],
  'Demir, Çelik & Metal': [
    'EREGL.IS', 'KRDMD.IS', 'ISDMR.IS', 'CEMTS.IS', 'IZMDC.IS',
    'TUKAS.IS', 'KOCAER.IS', 'YUKON.IS', 'DITAS.IS', 'BURCE.IS'
  ],
  'Bilişim & Yazılım': [
    'ASELS.IS', 'MIATK.IS', 'KONTK.IS', 'ARDYZ.IS', 'VBTYZ.IS',
    'LOGOS.IS', 'FONET.IS', 'INDES.IS', 'LINK.IS', 'PKART.IS',
    'SMART.IS', 'ESCOM.IS'
  ],
  'Çimento & İnşaat': [
    'AKCNS.IS', 'CIMSA.IS', 'OYAKC.IS', 'BUCIM.IS', 'BTCIM.IS',
    'ENKAI.IS', 'TKFEN.IS', 'NIBAS.IS', 'AFYON.IS'
  ],
  'Telekomünikasyon': [
    'TCELL.IS', 'TTKOM.IS'
  ],
  'Kimya, Plastik & Maden': [
    'SASA.IS', 'PETKM.IS', 'HEKTS.IS', 'KORDS.IS', 'BAGFS.IS',
    'GUBRF.IS', 'EGEEN.IS', 'ALKA.IS', 'KOZAL.IS', 'KOZAA.IS',
    'IPEKE.IS', 'PRKAB.IS'
  ],
  'Sağlık & İlaç': [
    'MPARK.IS', 'LKMNH.IS', 'SELEC.IS', 'DEVA.IS', 'GENIL.IS',
    'ANGEN.IS', 'TNZTP.IS', 'TRILC.IS'
  ],
  'Gayrimenkul (GYO)': [
    'EKGYO.IS', 'ISGYO.IS', 'TRGYO.IS', 'ZRGYO.IS', 'HLGYO.IS',
    'VKGYO.IS', 'KLGYO.IS', 'SNGYO.IS', 'OZKGY.IS', 'RYGYO.IS'
  ],
  'Savunma': [
    'ASELS.IS', 'OTKAR.IS', 'SDTTR.IS'
  ],
  'Diğer İmalat': [
    'VESBE.IS', 'ARCLK.IS', 'KORDS.IS', 'BRSAN.IS', 'ERBOS.IS',
    'YATAS.IS'
  ]
};

// Bu liste, tüm sembolleri tek bir dizi olarak almak için yardımcı fonksiyondur
export const getAllBistSymbols = (): string[] => {
  const symbolsSet = new Set<string>();
  Object.values(BIST_SECTORS).forEach(symbols => {
    symbols.forEach(symbol => symbolsSet.add(symbol));
  });
  return Array.from(symbolsSet);
};
