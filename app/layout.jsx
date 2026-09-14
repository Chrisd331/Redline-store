import './globals.css';
import { Archivo, Space_Grotesk } from 'next/font/google';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import ChromeGate from './ChromeGate';
import Header from './Header';
import Footer from './Footer';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['800', '900'],
  style: ['italic', 'normal'],
  variable: '--font-archivo',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata = {
  title: 'Redline Supplements',
  description: 'Australian performance supplements for fighters, footy players and serious lifters.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${archivo.variable} ${spaceGrotesk.variable}`}>
      <body>
        <AuthProvider>
          <CartProvider>
            <ChromeGate>
              <Header />
            </ChromeGate>
            {children}
            <ChromeGate>
              <Footer />
            </ChromeGate>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
