'use client';

import { useTheme } from 'next-themes';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { Toaster } from './ui/sonner';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { setTheme, resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  const toggleDarkMode = () => setTheme(isDarkMode ? 'light' : 'dark');

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster />
    </div>
  );
}
