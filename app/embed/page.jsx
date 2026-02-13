import { EmbedPage } from "@/views/EmbedPage";
import { EmbedViewer } from "@/components/embed/EmbedViewer";

const EMBED_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://smartcalclab.com";

export default async function Page({ searchParams }) {
  const resolved = await searchParams;
  const calc = resolved?.calc;
  if (calc && typeof calc === "string") {
    return (
      <EmbedViewer
        slug={calc}
        theme={resolved?.theme || "light"}
        branding={resolved?.branding !== "0"}
      />
    );
  }
  return <EmbedPage baseUrl={EMBED_BASE_URL} />;
}
