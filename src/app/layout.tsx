import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import ErrorBoundary from '@/components/ErrorBoundary';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Borsa Takip Uygulaması',
  description: 'BIST Hisseleri Fiyat Takip Platformu',
};

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import ThemeProviderWrapper from '@/theme/ThemeProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased selection:bg-green-500/30`}
      >
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProviderWrapper>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">
                <ErrorBoundary>{children}</ErrorBoundary>
              </main>
            </div>
          </ThemeProviderWrapper>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
