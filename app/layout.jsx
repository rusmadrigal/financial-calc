import "./globals.css";
import { headers } from "next/headers";
import { Providers } from "./Providers";
import { ShellOrEmbed } from "@/components/ShellOrEmbed";
import { CANONICAL_BASE, getCanonicalUrl } from "@/lib/seo/canonical";

const defaultMetadata = {
  title: "Financial Calculators Website Design",
  description: "SmartCalcLab – Financial calculators, built for clarity.",
};

export async function generateMetadata() {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/";
  const canonical = getCanonicalUrl(pathname);

  return {
    ...defaultMetadata,
    metadataBase: new URL(CANONICAL_BASE),
    alternates: {
      canonical,
    },
  };
}

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
