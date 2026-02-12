import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalculatorSlot } from "../registry/calculatorRegistry";
import { PortableTextRenderer } from "@/components/shared/PortableTextRenderer";
import type { CalculatorPageFaq, PortableTextBlock } from "@/lib/sanity/types";

export interface CalculatorDetailShellProps {
  title: string;
  shortDescription?: string | null;
  calculatorType: string;
  howItWorks?: PortableTextBlock[] | null;
  sources?: PortableTextBlock[] | null;
  faqs?: CalculatorPageFaq[] | null;
}

function hasHowItWorks(
  howItWorks: PortableTextBlock[] | null | undefined,
): boolean {
  return Array.isArray(howItWorks) && howItWorks.length > 0;
}

function hasSources(sources: PortableTextBlock[] | null | undefined): boolean {
  return Array.isArray(sources) && sources.length > 0;
}

function hasFaqs(faqs: CalculatorPageFaq[] | null | undefined): boolean {
  return Array.isArray(faqs) && faqs.length > 0;
}

export function CalculatorDetailShell({
  title,
  shortDescription,
  calculatorType,
  howItWorks,
  sources,
  faqs,
}: CalculatorDetailShellProps) {
  const showHowItWorks = hasHowItWorks(howItWorks);
  const showSources = hasSources(sources);
  const showFaqs = hasFaqs(faqs);

  const hasAnySection = showHowItWorks || showSources || showFaqs;
  const defaultTab = showHowItWorks
    ? "how-it-works"
    : showFaqs
      ? "faqs"
      : "sources";

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

        {hasAnySection && (
          <section className="mb-8">
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                {showHowItWorks && (
                  <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
                )}
                {showFaqs && (
                  <TabsTrigger value="faqs">
                    Frequently Asked Questions
                  </TabsTrigger>
                )}
                {showSources && (
                  <TabsTrigger value="sources">Sources</TabsTrigger>
                )}
              </TabsList>

              {showHowItWorks && (
                <TabsContent value="how-it-works" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>How It Works</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PortableTextRenderer value={howItWorks} />
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {showFaqs && (
                <TabsContent value="faqs" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Frequently Asked Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {faqs!.map((faq, i) => (
                          <AccordionItem key={i} value={`faq-${i}`}>
                            <AccordionTrigger>{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                              <PortableTextRenderer value={faq.answer} />
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {showSources && (
                <TabsContent value="sources" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PortableTextRenderer value={sources} />
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </section>
        )}
      </div>
    </div>
  );
}
