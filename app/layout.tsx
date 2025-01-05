import type { Metadata } from 'next';
import { Roboto_Mono } from 'next/font/google';
import './globals.css';

const robotoMono = Roboto_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Blue Terminal Portfolio',
  description: 'A terminal-style portfolio with a blue theme',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={robotoMono.className}>
        <main className="min-h-screen flex items-center justify-center bg-[#001933]">
          {children}
        </main>
      </body>
    </html>
  );
}

