import type { Metadata } from 'next';
import { Noto_Sans_KR, DM_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const noto = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-noto',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
});

export const metadata: Metadata = {
  title: '대한민국 경제 나침반',
  description: '기준금리·환율·소비자물가지수를 한눈에 보는 경제 대시보드',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${noto.variable} ${dmMono.variable}`}>
      <body className="bg-bg-primary text-slate-900 min-h-screen flex flex-col font-sans">
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(#d7e1f2 1px, transparent 1px), linear-gradient(90deg, #d7e1f2 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <Header />
        <main className="relative z-10 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
