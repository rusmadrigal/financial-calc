import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculatorSlot } from "../registry/calculatorRegistry";
import { PortableTextRenderer } from "@/components/shared/PortableTextRenderer";
import type { CalculatorPageFaq } from "@/lib/sanity/types";

export interface CalculatorDetailShellProps {
  title: string;
  shortDescription?: string | null;
  content?: unknown[] | null;
  faqs?: CalculatorPageFaq[] | null;
  calculatorType: string;
}

export function CalculatorDetailShell({
  title,
  shortDescription,
  content,
  faqs,
  calculatorType,
}: CalculatorDetailShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="mb-2 text-foreground">{title}</h1>
          {shortDescription && (
            <p className="text-muted-foreground">{shortDescription}</p>
          )}
        </header>

        <section className="mb-8" aria-label="Calculator">
          <CalculatorSlot calculatorType={calculatorType} />
        </section>

        {content && content.length > 0 && (
          <section className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>More information</CardTitle>
              </CardHeader>
              <CardContent>
                <PortableTextRenderer value={content} />
              </CardContent>
            </Card>
          </section>
        )}

        {faqs && faqs.length > 0 && (
          <section className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </div>
  );
}
