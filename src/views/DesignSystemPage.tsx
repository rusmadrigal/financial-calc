'use client';

import { useState } from 'react';
import {
  Check,
  X,
  AlertCircle,
  Info,
  CheckCircle2,
  Loader2,
  Search,
  Download,
  Home,
  TrendingUp,
  ChevronRight,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export function DesignSystemPage() {
  const [sliderValue, setSliderValue] = useState([50]);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState('option1');

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-3 text-foreground">SmartCalcLab Design System</h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            A comprehensive design system for building trustworthy financial calculators. Built with
            Tailwind CSS, shadcn/ui, and Radix UI primitives.
          </p>
        </div>

        <div className="space-y-16">
          {/* Design Tokens Section */}
          <Section id="tokens" title="Design Tokens">
            <p className="mb-8 text-muted-foreground">
              Core design tokens that define the visual language of SmartCalcLab.
            </p>

            {/* Color Palette */}
            <Subsection title="Color Palette">
              <p className="mb-6 text-sm text-muted-foreground">
                Professional fintech palette with blue/teal accent. Optimized for trust and readability.
              </p>

              <div className="space-y-8">
                {/* Primary & Accent Colors */}
                <div>
                  <h4 className="mb-4 text-sm font-semibold text-foreground">
                    Primary & Accent
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <ColorSwatch
                      name="Primary"
                      variable="--primary"
                      lightColor="#0c4a6e"
                      darkColor="#38bdf8"
                      description="Main brand color for CTAs"
                    />
                    <ColorSwatch
                      name="Primary Foreground"
                      variable="--primary-foreground"
                      lightColor="#ffffff"
                      darkColor="#0f172a"
                      description="Text on primary background"
                    />
                    <ColorSwatch
                      name="Accent"
                      variable="--accent"
                      lightColor="#0891b2"
                      darkColor="#06b6d4"
                      description="Highlight & interactive elements"
                    />
                  </div>
                </div>

                {/* Neutral Colors */}
                <div>
                  <h4 className="mb-4 text-sm font-semibold text-foreground">Neutrals</h4>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <ColorSwatch
                      name="Background"
                      variable="--background"
                      lightColor="#ffffff"
                      darkColor="#0f172a"
                      description="Page background"
                    />
                    <ColorSwatch
                      name="Foreground"
                      variable="--foreground"
                      lightColor="#0f172a"
                      darkColor="#f8fafc"
                      description="Primary text"
                    />
                    <ColorSwatch
                      name="Muted"
                      variable="--muted"
                      lightColor="#f8fafc"
                      darkColor="#1e293b"
                      description="Subtle backgrounds"
                    />
                    <ColorSwatch
                      name="Muted Foreground"
                      variable="--muted-foreground"
                      lightColor="#64748b"
                      darkColor="#94a3b8"
                      description="Secondary text"
                    />
                  </div>
                </div>

                {/* Semantic Colors */}
                <div>
                  <h4 className="mb-4 text-sm font-semibold text-foreground">
                    Semantic Colors
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <ColorSwatch
                      name="Success"
                      variable="--success"
                      lightColor="#059669"
                      darkColor="#10b981"
                      description="Success states"
                    />
                    <ColorSwatch
                      name="Destructive"
                      variable="--destructive"
                      lightColor="#dc2626"
                      darkColor="#ef4444"
                      description="Error states & warnings"
                    />
                    <ColorSwatch
                      name="Border"
                      variable="--border"
                      lightColor="#e2e8f0"
                      darkColor="#334155"
                      description="Borders & dividers"
                    />
                  </div>
                </div>

                {/* Chart Colors */}
                <div>
                  <h4 className="mb-4 text-sm font-semibold text-foreground">
                    Chart Colors
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <ColorSwatch
                      name="Chart 1"
                      variable="--chart-1"
                      lightColor="#0891b2"
                      darkColor="#06b6d4"
                      description="Primary data"
                    />
                    <ColorSwatch
                      name="Chart 2"
                      variable="--chart-2"
                      lightColor="#0c4a6e"
                      darkColor="#38bdf8"
                      description="Secondary data"
                    />
                    <ColorSwatch
                      name="Chart 3"
                      variable="--chart-3"
                      lightColor="#06b6d4"
                      darkColor="#22d3ee"
                      description="Tertiary data"
                    />
                    <ColorSwatch
                      name="Chart 4"
                      variable="--chart-4"
                      lightColor="#64748b"
                      darkColor="#94a3b8"
                      description="Neutral data"
                    />
                    <ColorSwatch
                      name="Chart 5"
                      variable="--chart-5"
                      lightColor="#10b981"
                      darkColor="#34d399"
                      description="Positive data"
                    />
                  </div>
                </div>
              </div>
            </Subsection>

            {/* Typography */}
            <Subsection title="Typography">
              <p className="mb-6 text-sm text-muted-foreground">
                Clear hierarchy with Inter-style system fonts. Optimized for financial data readability.
              </p>

              <div className="space-y-6">
                <div className="space-y-4 rounded-lg border border-border p-6">
                  <div className="border-b border-border pb-4">
                    <h1>Heading 1 - 36px / 2.25rem</h1>
                    <code className="mt-2 block text-xs text-muted-foreground">
                      font-size: 2.25rem; font-weight: 600; line-height: 1.2; letter-spacing:
                      -0.025em;
                    </code>
                  </div>
                  <div className="border-b border-border pb-4">
                    <h2>Heading 2 - 30px / 1.875rem</h2>
                    <code className="mt-2 block text-xs text-muted-foreground">
                      font-size: 1.875rem; font-weight: 600; line-height: 1.25; letter-spacing:
                      -0.02em;
                    </code>
                  </div>
                  <div className="border-b border-border pb-4">
                    <h3>Heading 3 - 24px / 1.5rem</h3>
                    <code className="mt-2 block text-xs text-muted-foreground">
                      font-size: 1.5rem; font-weight: 600; line-height: 1.3; letter-spacing:
                      -0.015em;
                    </code>
                  </div>
                  <div className="border-b border-border pb-4">
                    <h4>Heading 4 - 20px / 1.25rem</h4>
                    <code className="mt-2 block text-xs text-muted-foreground">
                      font-size: 1.25rem; font-weight: 600; line-height: 1.4;
                    </code>
                  </div>
                  <div className="border-b border-border pb-4">
                    <p>Body text - 16px / 1rem</p>
                    <code className="mt-2 block text-xs text-muted-foreground">
                      font-size: 1rem; line-height: 1.625; color: muted-foreground;
                    </code>
                  </div>
                  <div>
                    <p className="text-sm">Small text - 14px / 0.875rem</p>
                    <code className="mt-2 block text-xs text-muted-foreground">
                      font-size: 0.875rem; line-height: 1.5;
                    </code>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Card>
                    <CardContent className="p-6">
                      <p className="mb-2 text-sm font-medium text-muted-foreground">
                        Font Weights
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="font-normal">Normal - 400</div>
                        <div className="font-medium">Medium - 500</div>
                        <div className="font-semibold">Semibold - 600</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <p className="mb-2 text-sm font-medium text-muted-foreground">
                        Line Heights
                      </p>
                      <div className="space-y-2 text-sm">
                        <div>Tight - 1.2 (headings)</div>
                        <div>Normal - 1.5 (UI)</div>
                        <div>Relaxed - 1.625 (body)</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <p className="mb-2 text-sm font-medium text-muted-foreground">
                        Letter Spacing
                      </p>
                      <div className="space-y-2 text-sm">
                        <div>H1 - -0.025em</div>
                        <div>H2 - -0.02em</div>
                        <div>H3 - -0.015em</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </Subsection>

            {/* Spacing & Sizing */}
            <Subsection title="Spacing & Sizing">
              <p className="mb-6 text-sm text-muted-foreground">
                8px base grid for consistent spacing throughout the application.
              </p>

              <div className="grid gap-6 sm:grid-cols-2">
                <Card>
                  <CardContent className="p-6">
                    <h4 className="mb-4 text-sm font-semibold">Spacing Scale (8px grid)</h4>
                    <div className="space-y-3">
                      {[
                        { name: '1', px: '4px', rem: '0.25rem' },
                        { name: '2', px: '8px', rem: '0.5rem' },
                        { name: '3', px: '12px', rem: '0.75rem' },
                        { name: '4', px: '16px', rem: '1rem' },
                        { name: '6', px: '24px', rem: '1.5rem' },
                        { name: '8', px: '32px', rem: '2rem' },
                        { name: '12', px: '48px', rem: '3rem' },
                        { name: '16', px: '64px', rem: '4rem' },
                      ].map((space) => (
                        <div key={space.name} className="flex items-center gap-4">
                          <div
                            className="h-6 bg-primary"
                            style={{ width: space.px }}
                          />
                          <code className="text-xs">
                            {space.name} = {space.px} = {space.rem}
                          </code>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h4 className="mb-4 text-sm font-semibold">Border Radius</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-sm bg-primary" />
                        <div>
                          <code className="text-xs font-medium">sm - 0.125rem (2px)</code>
                          <p className="text-xs text-muted-foreground">Small elements</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-md bg-primary" />
                        <div>
                          <code className="text-xs font-medium">md - 0.375rem (6px)</code>
                          <p className="text-xs text-muted-foreground">Medium elements</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-primary" />
                        <div>
                          <code className="text-xs font-medium">lg - 0.5rem (8px)</code>
                          <p className="text-xs text-muted-foreground">Cards, panels</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-xl bg-primary" />
                        <div>
                          <code className="text-xs font-medium">xl - 0.75rem (12px)</code>
                          <p className="text-xs text-muted-foreground">Featured elements</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-full bg-primary" />
                        <div>
                          <code className="text-xs font-medium">full - 9999px</code>
                          <p className="text-xs text-muted-foreground">Pills, avatars</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Subsection>

            {/* Shadows & Elevation */}
            <Subsection title="Shadows & Elevation">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium">Shadow SM</p>
                    <code className="mt-2 block text-xs text-muted-foreground">
                      shadow-sm
                    </code>
                  </CardContent>
                </Card>
                <Card className="shadow">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium">Shadow Default</p>
                    <code className="mt-2 block text-xs text-muted-foreground">shadow</code>
                  </CardContent>
                </Card>
                <Card className="shadow-md">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium">Shadow MD</p>
                    <code className="mt-2 block text-xs text-muted-foreground">
                      shadow-md
                    </code>
                  </CardContent>
                </Card>
                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium">Shadow LG</p>
                    <code className="mt-2 block text-xs text-muted-foreground">
                      shadow-lg
                    </code>
                  </CardContent>
                </Card>
              </div>
            </Subsection>
          </Section>

          {/* Components Section */}
          <Section id="components" title="Components">
            {/* Buttons */}
            <Subsection title="Buttons">
              <p className="mb-6 text-sm text-muted-foreground">
                Buttons with clear visual hierarchy and accessible focus states.
              </p>

              <div className="space-y-8">
                <div>
                  <h4 className="mb-4 text-sm font-semibold">Variants</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button>Primary Button</Button>
                    <Button variant="secondary">Secondary Button</Button>
                    <Button variant="outline">Outline Button</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button variant="destructive">Destructive Button</Button>
                  </div>
                </div>

                <div>
                  <h4 className="mb-4 text-sm font-semibold">Sizes</h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button>Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon">
                      <Download className="size-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="mb-4 text-sm font-semibold">States</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button>Normal</Button>
                    <Button disabled>Disabled</Button>
                    <Button>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Loading
                    </Button>
                    <Button>
                      <Download className="mr-2 size-4" />
                      With Icon
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="mb-4 text-sm font-semibold">Full Width</h4>
                  <Button className="w-full">Full Width Button</Button>
                </div>
              </div>
            </Subsection>

            {/* Form Inputs */}
            <Subsection title="Form Inputs">
              <p className="mb-6 text-sm text-muted-foreground">
                Form elements with clear labels, helper text, and validation states.
              </p>

              <div className="grid gap-8 lg:grid-cols-2">
                {/* Text Input */}
                <div className="space-y-2">
                  <Label htmlFor="text-input">Text Input</Label>
                  <Input id="text-input" placeholder="Enter text..." />
                  <p className="text-xs text-muted-foreground">Helper text goes here</p>
                </div>

                {/* Number Input */}
                <div className="space-y-2">
                  <Label htmlFor="number-input">Number Input</Label>
                  <Input id="number-input" type="number" placeholder="0" />
                </div>

                {/* Currency Input */}
                <div className="space-y-2">
                  <Label htmlFor="currency-input">Currency Input</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="currency-input"
                      type="number"
                      placeholder="0.00"
                      className="pl-7"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Enter amount in dollars</p>
                </div>

                {/* Percentage Input */}
                <div className="space-y-2">
                  <Label htmlFor="percent-input">Percentage Input</Label>
                  <div className="relative">
                    <Input
                      id="percent-input"
                      type="number"
                      placeholder="0"
                      className="pr-7"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      %
                    </span>
                  </div>
                </div>

                {/* Success State */}
                <div className="space-y-2">
                  <Label htmlFor="success-input">Success State</Label>
                  <Input
                    id="success-input"
                    defaultValue="john@example.com"
                    className="border-success"
                  />
                  <p className="flex items-center gap-1 text-xs text-success">
                    <CheckCircle2 className="size-3" />
                    Email is valid
                  </p>
                </div>

                {/* Error State */}
                <div className="space-y-2">
                  <Label htmlFor="error-input">Error State</Label>
                  <Input
                    id="error-input"
                    defaultValue="invalid-email"
                    className="border-destructive focus-visible:ring-destructive"
                  />
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="size-3" />
                    Please enter a valid email
                  </p>
                </div>

                {/* Disabled State */}
                <div className="space-y-2">
                  <Label htmlFor="disabled-input">Disabled Input</Label>
                  <Input id="disabled-input" disabled placeholder="Disabled input" />
                </div>

                {/* Search Input */}
                <div className="space-y-2">
                  <Label htmlFor="search-input">Search Input</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="search-input" placeholder="Search..." className="pl-9" />
                  </div>
                </div>
              </div>
            </Subsection>

            {/* Select, Checkbox, Radio */}
            <Subsection title="Selection Controls">
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Select */}
                <div className="space-y-2">
                  <Label htmlFor="select-demo">Select Dropdown</Label>
                  <Select>
                    <SelectTrigger id="select-demo">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Checkboxes */}
                <div className="space-y-4">
                  <Label>Checkboxes</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="check1" defaultChecked />
                      <Label htmlFor="check1" className="font-normal">
                        Accept terms and conditions
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="check2" />
                      <Label htmlFor="check2" className="font-normal">
                        Subscribe to newsletter
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="check3" disabled />
                      <Label htmlFor="check3" className="font-normal">
                        Disabled checkbox
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Radio Group */}
                <div className="space-y-4">
                  <Label>Radio Group</Label>
                  <RadioGroup value={selectedRadio} onValueChange={setSelectedRadio}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option1" id="radio1" />
                      <Label htmlFor="radio1" className="font-normal">
                        15-year term
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option2" id="radio2" />
                      <Label htmlFor="radio2" className="font-normal">
                        30-year term
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option3" id="radio3" disabled />
                      <Label htmlFor="radio3" className="font-normal">
                        Disabled option
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Switch */}
                <div className="space-y-4">
                  <Label>Toggle Switch</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <p className="text-sm font-medium">Email notifications</p>
                        <p className="text-xs text-muted-foreground">
                          Receive updates via email
                        </p>
                      </div>
                      <Switch checked={switchChecked} onCheckedChange={setSwitchChecked} />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <p className="text-sm font-medium">Marketing emails</p>
                        <p className="text-xs text-muted-foreground">Promotional content</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                {/* Slider */}
                <div className="space-y-4">
                  <Label>Slider</Label>
                  <div className="space-y-3 pt-2">
                    <Slider
                      value={sliderValue}
                      onValueChange={setSliderValue}
                      max={100}
                      step={1}
                    />
                    <p className="text-sm text-muted-foreground">Value: {sliderValue[0]}%</p>
                  </div>
                </div>
              </div>
            </Subsection>

            {/* Cards */}
            <Subsection title="Cards">
              <p className="mb-6 text-sm text-muted-foreground">
                Card variants for different content types and importance levels.
              </p>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Standard Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Standard Card</CardTitle>
                    <CardDescription>
                      Basic card with header and content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Used for general content organization and grouping related information.
                    </p>
                  </CardContent>
                </Card>

                {/* Featured Card */}
                <Card className="border-2 border-accent/50 bg-accent/5">
                  <CardHeader>
                    <CardTitle>Featured Card</CardTitle>
                    <CardDescription>Highlighted with accent color</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Used to draw attention to important content or call-to-actions.
                    </p>
                  </CardContent>
                </Card>

                {/* Result Summary Card */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Result Summary</CardTitle>
                    <CardDescription>Calculator output</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Monthly Payment</p>
                        <p className="text-2xl font-semibold text-foreground">$2,212</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total Interest</p>
                        <p className="text-2xl font-semibold text-foreground">$446,682</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Subsection>

            {/* Badges & Tags */}
            <Subsection title="Badges & Tags">
              <p className="mb-6 text-sm text-muted-foreground">
                Labels for categorization and status indication.
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="mb-3 text-sm font-semibold">Variants</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge className="bg-success text-success-foreground">Success</Badge>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 text-sm font-semibold">Use Cases</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Export PDF</Badge>
                    <Badge variant="secondary">Amortization Table</Badge>
                    <Badge variant="outline">Simple</Badge>
                    <Badge variant="outline">Advanced</Badge>
                    <Badge>New</Badge>
                    <Badge>Popular</Badge>
                  </div>
                </div>
              </div>
            </Subsection>

            {/* Tabs & Accordion */}
            <Subsection title="Tabs & Accordion">
              <div className="space-y-8">
                {/* Tabs */}
                <div>
                  <h4 className="mb-4 text-sm font-semibold">Tabs</h4>
                  <Tabs defaultValue="tab1">
                    <TabsList>
                      <TabsTrigger value="tab1">How It Works</TabsTrigger>
                      <TabsTrigger value="tab2">Assumptions</TabsTrigger>
                      <TabsTrigger value="tab3">FAQs</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1" className="mt-4">
                      <Card>
                        <CardContent className="p-6">
                          <p className="text-sm text-muted-foreground">
                            Content for "How It Works" tab. Tabs provide a way to organize related
                            content into separate views.
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="tab2" className="mt-4">
                      <Card>
                        <CardContent className="p-6">
                          <p className="text-sm text-muted-foreground">
                            Content for "Assumptions" tab.
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="tab3" className="mt-4">
                      <Card>
                        <CardContent className="p-6">
                          <p className="text-sm text-muted-foreground">Content for "FAQs" tab.</p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Accordion */}
                <div>
                  <h4 className="mb-4 text-sm font-semibold">Accordion (for FAQs)</h4>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>What is included in the monthly payment?</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        The monthly payment includes principal and interest. Additional costs like
                        property taxes, insurance, and HOA fees are not included in this
                        calculation.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>How is interest calculated?</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Interest is calculated using the standard mortgage formula with monthly
                        compounding. The annual rate is divided by 12 for monthly calculations.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Can I make extra payments?</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Yes, most mortgages allow extra payments toward principal, which can
                        significantly reduce total interest paid and shorten the loan term.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </Subsection>

            {/* Alerts & Toasts */}
            <Subsection title="Alerts & Toasts">
              <p className="mb-6 text-sm text-muted-foreground">
                Feedback components for important messages and notifications.
              </p>

              <div className="space-y-6">
                {/* Alerts */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold">Alerts</h4>
                  
                  <Alert>
                    <Info className="size-4" />
                    <AlertTitle>Information</AlertTitle>
                    <AlertDescription>
                      This is an informational alert for general notices and helpful tips.
                    </AlertDescription>
                  </Alert>

                  <Alert className="border-success/50 bg-success/5">
                    <CheckCircle2 className="size-4 text-success" />
                    <AlertTitle className="text-success">Success</AlertTitle>
                    <AlertDescription>
                      Your calculation has been saved successfully.
                    </AlertDescription>
                  </Alert>

                  <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      Please enter a valid loan amount to continue with the calculation.
                    </AlertDescription>
                  </Alert>

                  <Alert className="border-2 border-destructive/50 bg-destructive/5">
                    <AlertCircle className="size-4" />
                    <AlertDescription>
                      <strong>Disclaimer:</strong> This calculator is for educational purposes
                      only. Results should not be considered financial advice. Always consult with
                      qualified professionals.
                    </AlertDescription>
                  </Alert>
                </div>

                {/* Toast Examples */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold">Toast Notifications</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      onClick={() => toast.success('Calculation saved successfully!')}
                    >
                      Success Toast
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => toast.error('Please enter a valid amount')}
                    >
                      Error Toast
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => toast.info('Calculator has been reset')}
                    >
                      Info Toast
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => toast('Simple message', { description: 'With description' })}
                    >
                      Default Toast
                    </Button>
                  </div>
                </div>
              </div>
            </Subsection>

            {/* Tables */}
            <Subsection title="Tables">
              <p className="mb-6 text-sm text-muted-foreground">
                Data tables with sticky headers and alternating row colors for readability.
              </p>

              <div className="space-y-6">
                {/* Standard Table */}
                <div className="overflow-hidden rounded-lg border border-border">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead className="text-right">Payment</TableHead>
                        <TableHead className="text-right">Principal</TableHead>
                        <TableHead className="text-right">Interest</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[1, 2, 3, 4, 5].map((month) => (
                        <TableRow key={month}>
                          <TableCell className="font-medium">{month}</TableCell>
                          <TableCell className="text-right">$2,212.45</TableCell>
                          <TableCell className="text-right">$733.45</TableCell>
                          <TableCell className="text-right">$1,479.00</TableCell>
                          <TableCell className="text-right font-medium">
                            ${(280000 - month * 733.45).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Empty State */}
                <Card className="border-2 border-dashed">
                  <CardContent className="py-12 text-center">
                    <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                      <AlertCircle className="size-6 text-muted-foreground" />
                    </div>
                    <p className="mb-2 font-medium text-foreground">No data available</p>
                    <p className="text-sm text-muted-foreground">
                      Enter your loan details to generate an amortization schedule
                    </p>
                  </CardContent>
                </Card>
              </div>
            </Subsection>

            {/* Modal & Dialog */}
            <Subsection title="Modal & Dialog">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open Modal</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Export Results</DialogTitle>
                    <DialogDescription>
                      Choose your preferred export format for the calculation results.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Button className="w-full justify-start" variant="outline">
                      <Download className="mr-2 size-4" />
                      Export as PDF
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Download className="mr-2 size-4" />
                      Export as Excel
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Copy className="mr-2 size-4" />
                      Copy to Clipboard
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </Subsection>

            {/* Breadcrumbs & Navigation */}
            <Subsection title="Breadcrumbs & Navigation">
              <div className="space-y-8">
                <div>
                  <h4 className="mb-4 text-sm font-semibold">Breadcrumbs</h4>
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Home</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator>
                        <ChevronRight className="size-4" />
                      </BreadcrumbSeparator>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Calculators</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator>
                        <ChevronRight className="size-4" />
                      </BreadcrumbSeparator>
                      <BreadcrumbItem>
                        <BreadcrumbPage>Mortgage Calculator</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>

                <div>
                  <h4 className="mb-4 text-sm font-semibold">Pagination</h4>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">10</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            </Subsection>

            {/* Skeleton Loaders */}
            <Subsection title="Loading States">
              <p className="mb-6 text-sm text-muted-foreground">
                Skeleton loaders for async content and better perceived performance.
              </p>

              <div className="grid gap-6 sm:grid-cols-2">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Skeleton className="size-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Subsection>
          </Section>

          {/* Icons Section */}
          <Section id="icons" title="Icons">
            <p className="mb-6 text-muted-foreground">
              Simple line icons from Lucide React with consistent 2px stroke width. Icons should be
              clear and recognizable at all sizes.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="flex flex-col items-center gap-3 p-6">
                  <Home className="size-8 text-primary" />
                  <p className="text-sm">Home</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center gap-3 p-6">
                  <TrendingUp className="size-8 text-primary" />
                  <p className="text-sm">TrendingUp</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center gap-3 p-6">
                  <Download className="size-8 text-primary" />
                  <p className="text-sm">Download</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center gap-3 p-6">
                  <CheckCircle2 className="size-8 text-success" />
                  <p className="text-sm">CheckCircle2</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center gap-3 p-6">
                  <AlertCircle className="size-8 text-destructive" />
                  <p className="text-sm">AlertCircle</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center gap-3 p-6">
                  <Info className="size-8 text-accent" />
                  <p className="text-sm">Info</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center gap-3 p-6">
                  <Search className="size-8 text-muted-foreground" />
                  <p className="text-sm">Search</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center gap-3 p-6">
                  <X className="size-8 text-muted-foreground" />
                  <p className="text-sm">X</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <h4 className="mb-4 text-sm font-semibold">Icon Sizes</h4>
              <div className="flex flex-wrap items-end gap-6">
                <div className="text-center">
                  <Home className="size-4" />
                  <p className="mt-2 text-xs text-muted-foreground">size-4 (16px)</p>
                </div>
                <div className="text-center">
                  <Home className="size-5" />
                  <p className="mt-2 text-xs text-muted-foreground">size-5 (20px)</p>
                </div>
                <div className="text-center">
                  <Home className="size-6" />
                  <p className="mt-2 text-xs text-muted-foreground">size-6 (24px)</p>
                </div>
                <div className="text-center">
                  <Home className="size-8" />
                  <p className="mt-2 text-xs text-muted-foreground">size-8 (32px)</p>
                </div>
                <div className="text-center">
                  <Home className="size-12" />
                  <p className="mt-2 text-xs text-muted-foreground">size-12 (48px)</p>
                </div>
              </div>
            </div>
          </Section>

          {/* Accessibility */}
          <Section id="accessibility" title="Accessibility">
            <p className="mb-6 text-muted-foreground">
              Built with accessibility in mind: WCAG 2.1 AA compliant colors, clear focus states, and
              semantic HTML.
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Focus States</CardTitle>
                  <CardDescription>Visible keyboard navigation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full">Tab to focus this button</Button>
                  <Input placeholder="Focus shows ring indicator" />
                  <p className="text-xs text-muted-foreground">
                    All interactive elements have visible focus rings with 2px offset for clarity.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Color Contrast</CardTitle>
                  <CardDescription>WCAG AA compliant</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-primary p-3 text-primary-foreground">
                    <span className="text-sm font-medium">Primary on Primary BG</span>
                    <Badge className="bg-primary-foreground text-primary">4.5:1</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      Muted Foreground
                    </span>
                    <Badge variant="secondary">4.5:1</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    All text meets minimum contrast ratio requirements.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Semantic HTML</CardTitle>
                  <CardDescription>Proper markup structure</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-success" />
                      Proper heading hierarchy (h1-h6)
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-success" />
                      ARIA labels where needed
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-success" />
                      Descriptive button text
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-success" />
                      Form labels properly associated
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Screen Reader Support</CardTitle>
                  <CardDescription>Accessible to assistive tech</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-success" />
                      Alt text for images
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-success" />
                      Live regions for dynamic content
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-success" />
                      Skip links for navigation
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="size-4 text-success" />
                      Proper role attributes
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="mb-8 text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <h3 className="mb-6 text-foreground">{title}</h3>
      {children}
    </div>
  );
}

function ColorSwatch({
  name,
  variable,
  lightColor,
  darkColor,
  description,
}: {
  name: string;
  variable: string;
  lightColor: string;
  darkColor: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-3 flex gap-2">
          <div
            className="size-12 rounded-lg border border-border"
            style={{ backgroundColor: `var(${variable})` }}
          />
          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium text-foreground">{name}</p>
            <code className="text-xs text-muted-foreground">{variable}</code>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <Separator className="my-3" />
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Light:</span>
            <code>{lightColor}</code>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Dark:</span>
            <code>{darkColor}</code>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
