"use client";

import { useState, useMemo, useEffect } from "react";
import { Copy, Check, Code2, Palette, Settings } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { getCalculatorsList } from "@/lib/calculators/calculatorDataset";

export function EmbedPage({ baseUrl = "https://smartcalclab.com" }) {
  const list = useMemo(() => getCalculatorsList(), []);
  const calculators = useMemo(
    () => list.map((c) => ({ value: c.slug, label: c.title })),
    [list],
  );
  const defaultSlug = calculators[0]?.value ?? "mortgage-calculator";

  const [selectedCalculator, setSelectedCalculator] = useState(defaultSlug);
  const [theme, setTheme] = useState("light");
  const [width, setWidth] = useState("100%");
  const [height, setHeight] = useState("800px");
  const [showBranding, setShowBranding] = useState(true);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState(baseUrl);
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const selectedLabel =
    calculators.find((c) => c.value === selectedCalculator)?.label ??
    selectedCalculator;

  const previewSrc = `${origin}/embed?${new URLSearchParams({
    calc: selectedCalculator,
    theme,
    branding: showBranding ? "1" : "0",
  }).toString()}`;

  const generateEmbedCode = () => {
    const params = new URLSearchParams({
      calc: selectedCalculator,
      theme,
      branding: showBranding ? "1" : "0",
    });

    return `<iframe
  src="${baseUrl}/embed?${params.toString()}"
  width="${width}"
  height="${height}"
  frameborder="0"
  style="border: 1px solid #e2e8f0; border-radius: 8px; max-width: 100%;"
  title="${selectedLabel}"
></iframe>`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateEmbedCode());
    setCopied(true);
    toast.success("Embed code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-foreground">Embed a Calculator</h1>
          <p className="text-lg text-muted-foreground">
            Add SmartCalcLab calculators to your website or blog with a simple
            iframe embed.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>Customize your embed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Calculator Selection */}
                <div className="space-y-2">
                  <Label htmlFor="calculator">Calculator</Label>
                  <Select
                    value={selectedCalculator}
                    onValueChange={setSelectedCalculator}
                  >
                    <SelectTrigger id="calculator">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {calculators.map((calc) => (
                        <SelectItem key={calc.value} value={calc.value}>
                          {calc.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Theme Selection */}
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger id="theme">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">
                        Auto (matches user preference)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Width */}
                <div className="space-y-2">
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="e.g., 100%, 800px"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use % for responsive or px for fixed
                  </p>
                </div>

                {/* Height */}
                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g., 800px"
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 800px minimum
                  </p>
                </div>

                {/* Show Branding */}
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="branding" className="text-sm">
                      Show SmartCalcLab Branding
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Display our logo and attribution
                    </p>
                  </div>
                  <Switch
                    id="branding"
                    checked={showBranding}
                    onCheckedChange={setShowBranding}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview & Code Panel */}
          <div className="space-y-6 lg:col-span-2">
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">
                  <Palette className="mr-2 size-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="code">
                  <Code2 className="mr-2 size-4" />
                  Embed Code
                </TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Live Preview</CardTitle>
                    <CardDescription>
                      See how the calculator will look on your site
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted/30 p-4"
                      style={{ minHeight: "600px" }}
                    >
                      <iframe
                        src={previewSrc}
                        title={`Preview: ${selectedLabel}`}
                        className="h-full min-h-[560px] w-full rounded-lg border-0 bg-background"
                        style={{
                          width: width === "100%" ? "100%" : width,
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="code" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Embed Code</CardTitle>
                    <CardDescription>
                      Copy and paste this code into your website
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <pre className="overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm">
                        <code className="font-mono text-foreground">
                          {generateEmbedCode()}
                        </code>
                      </pre>
                      <Button
                        size="sm"
                        onClick={handleCopy}
                        className="absolute right-2 top-2"
                        variant="secondary"
                      >
                        {copied ? (
                          <>
                            <Check className="mr-2 size-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 size-4" />
                            Copy Code
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="mt-6 space-y-3 rounded-lg border border-border bg-card p-4">
                      <div className="flex items-start gap-2">
                        <Settings className="mt-0.5 size-4 shrink-0 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Implementation Notes
                          </p>
                          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                            <li>
                              • The iframe is fully responsive when width is set
                              to 100%
                            </li>
                            <li>
                              • All calculations happen client-side for privacy
                            </li>
                            <li>
                              • No external scripts or tracking on your site
                            </li>
                            <li>
                              • Automatically updates with our improvements
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Benefits */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Why Embed SmartCalcLab?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">
                      Always Up-to-Date
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Embedded calculators automatically receive updates,
                      improvements, and bug fixes without any action on your
                      part.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">
                      Privacy Protected
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      We don't track your users. All calculations happen in the
                      browser with no data sent to our servers.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">
                      Free Forever
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      No registration, no API keys, no usage limits. Embed as
                      many calculators as you need on any site.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">
                      Professional Quality
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Built with accurate formulas, clean design, and full
                      mobile responsiveness that matches your brand.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms */}
            <Card>
              <CardHeader>
                <CardTitle>Embedding Terms</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                <p className="text-sm text-muted-foreground">
                  You're free to embed SmartCalcLab calculators on any website,
                  including commercial sites, under the following conditions:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>
                    If you remove our branding, please add a text attribution
                    like "Calculator powered by SmartCalcLab" with a link back
                    to smartcalclab.com
                  </li>
                  <li>
                    Don't modify the iframe contents or present the calculators
                    as your own creation
                  </li>
                  <li>
                    Don't use our calculators in apps or contexts that provide
                    illegal, misleading, or predatory financial advice
                  </li>
                </ul>
                <p className="mt-4 text-sm text-muted-foreground">
                  Questions about embedding? Contact us at{" "}
                  <a
                    href="mailto:hello@smartcalclab.com"
                    className="text-accent hover:underline"
                  >
                    hello@smartcalclab.com
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
