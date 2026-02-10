"use client";

import { useParams } from "next/navigation";
import { CalculatorDetailPage } from "@/views/CalculatorDetailPage";
import { slugToName } from "@/lib/slugs";

export default function CalculatorPage() {
  const params = useParams();
  const slug = params?.slug ?? "";
  const calculatorName = slugToName(Array.isArray(slug) ? slug[0] : slug);
  return <CalculatorDetailPage calculatorName={calculatorName} />;
}
