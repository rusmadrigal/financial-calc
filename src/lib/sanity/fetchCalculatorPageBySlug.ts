import { sanityClientWithToken } from "./client";
import { calculatorPageBySlugQuery } from "./queries";
import type { CalculatorPage } from "./types";

export async function fetchCalculatorPageBySlug(
  slug: string,
): Promise<CalculatorPage | null> {
  const result = await sanityClientWithToken.fetch<CalculatorPage | null>(
    calculatorPageBySlugQuery,
    { slug },
  );
  return result ?? null;
}
