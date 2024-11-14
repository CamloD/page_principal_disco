import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';

import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from 'next-themes'

const fontHeading = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
});

const fontBody = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: '--font-body',
});

export const metadata = {
  title: "Page",
  description: "Una plataforma para escuchar disco.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn('antialiased', fontHeading.variable, fontBody.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}