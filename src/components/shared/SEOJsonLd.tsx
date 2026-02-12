/**
 * Renders multiple JSON-LD script tags for structured data.
 * Server Component compatible.
 */
export function SEOJsonLd({ data }: { data: unknown[] }) {
  if (!Array.isArray(data) || data.length === 0) return null;
  return (
    <>
      {data.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
