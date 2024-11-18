import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';
import Header from 'app/pages/components/Header'

import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from 'next-themes'
import { SearchProvider } from './home/components/search'
import { AuthProvider } from './Auth/auth'
import { CartProvider } from 'app/contexts/cart_context'
import { ErrorBoundary } from 'app/contexts/error_context'
import { CheckoutProvider } from 'app/contexts/checkout_context'
import { SelectedListingProvider } from './contexts/SelectedListingContext'

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
  title: "Reserve page",
  description: "Una plataforma para escuchar disco.",
};

export default function RootLayout({ children }) {
  return (
  <html lang="es" suppressHydrationWarning>
    <body className={cn('antialiased', fontHeading.variable, fontBody.variable)}>
      <ErrorBoundary>
        <SelectedListingProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <LanguageProvider>
              <AuthProvider>
                <CartProvider>
                  <CheckoutProvider>
                  <SearchProvider>
                    <main className="pt-16"> {/* Add padding-top to account for fixed header */}
                      {children}
                    </main>
                  </SearchProvider>
                  </CheckoutProvider>
                </CartProvider>
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </SelectedListingProvider>
      </ErrorBoundary>
    </body>
  </html>
  )
}