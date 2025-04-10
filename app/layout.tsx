import './globals.css';
import type { Metadata } from 'next';
import { VT323, Press_Start_2P } from 'next/font/google';

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
});

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start',
});

export const metadata: Metadata = {
  title: 'Chibi Todo - Y2K Task Manager',
  description: 'A Y2K-themed todo list app with virtual pet companions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${vt323.variable} ${pressStart2P.variable} font-vt323`}>
        {children}
      </body>
    </html>
  );
}
