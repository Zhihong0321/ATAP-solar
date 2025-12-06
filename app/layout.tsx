import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Playfair_Display, Inter, Noto_Serif_SC } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap'
});

const notoSerifCn = Noto_Serif_SC({
  subsets: ['latin'],
  variable: '--font-serif-cn',
  display: 'swap'
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Malaysia Solar Atap News',
  description: 'Focused news hub for Malaysia solar rooftop insights.',
  icons: {
    icon: '/logo-v2.png',
    apple: '/logo-v2.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${notoSerifCn.variable}`}>
      <body className="min-h-screen text-text antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
