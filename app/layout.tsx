import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ClientThemeProvider from '../components/ClientThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Trajectory Admin',
  description: 'Admin panel for Trajectory college fest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientThemeProvider>{children}</ClientThemeProvider>
      </body>
    </html>
  );
}
