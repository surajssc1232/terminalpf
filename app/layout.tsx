import { Roboto_Mono } from 'next/font/google';
import './globals.css';

const robotoMono = Roboto_Mono({ subsets: ['latin'] });

export const metadata = {
  title: 'Blue Terminal Portfolio',
  description: 'A terminal-style portfolio with a blue theme',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={robotoMono.className}>{children}</body>
    </html>
  );
}

