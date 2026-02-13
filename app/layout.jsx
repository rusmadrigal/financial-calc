import "./globals.css";
import { Providers } from "./Providers";
import { ShellOrEmbed } from "@/components/ShellOrEmbed";

export const metadata = {
  title: "Financial Calculators Website Design",
  description: "SmartCalcLab – Financial calculators, built for clarity.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <ShellOrEmbed>{children}</ShellOrEmbed>
        </Providers>
      </body>
    </html>
  );
}
