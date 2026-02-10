import './globals.css';
import { Providers } from './Providers';
import { AppShell } from '@/app/components/AppShell';

export const metadata = {
  title: 'Financial Calculators Website Design',
  description: 'SmartCalcLab – Financial calculators, built for clarity.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
