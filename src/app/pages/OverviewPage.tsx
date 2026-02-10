'use client';

import { useRouter } from 'next/navigation';
import { Home, Calculator, FileText, Info, Code, Palette, MonitorSmartphone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
function pageToPath(page: string): string {
  if (page === 'home') return '/';
  if (page === 'calculator') return '/calculators/mortgage-calculator';
  return `/${page}`;
}

export function OverviewPage() {
  const router = useRouter();
  const onNavigate = (page: string) => router.push(pageToPath(page));
  const pages = [
    {
      title: 'Homepage',
      description: 'Hero section with search, featured calculators grid, categories, benefits, testimonials, and footer with disclaimer.',
      icon: Home,
      page: 'home',
      features: [
        'Search bar with autosuggest',
        'Trust indicators row',
        'Featured calculators (6 cards)',
        'Category navigation',
        'Why SmartCalcLab section',
        'Social proof testimonials',
        'Comprehensive footer',
      ],
      responsive: true,
    },
    {
      title: 'Calculators Listing',
      description: 'Browsable catalog with filtering, sorting, and calculator cards. Collapsible sidebar on mobile.',
      icon: Calculator,
      page: 'calculators',
      features: [
        'Filter by category & complexity',
        'Sort by popular/name',
        'Calculator cards with badges',
        'Mobile-friendly filters (sheet)',
        'Active filter chips',
        'Results count',
      ],
      responsive: true,
    },
    {
      title: 'Calculator Detail Template',
      description: 'Complete calculator interface with inputs, results, charts, tables, and educational content.',
      icon: FileText,
      page: 'calculator',
      features: [
        'Grouped input cards (left column)',
        'Results summary card (right)',
        'Export actions (PDF, Excel, Copy)',
        'Interactive charts (Recharts)',
        'Amortization table',
        'Tabs: How it Works / Assumptions / FAQs / Sources',
        'Legal disclaimer block',
        'Sticky mobile CTA bar',
      ],
      responsive: true,
    },
    {
      title: 'About Page',
      description: 'Mission, values, methodology, timeline, and privacy commitment.',
      icon: Info,
      page: 'about',
      features: [
        'Mission statement',
        'Core values cards',
        'Methodology section',
        'Company timeline',
        'Privacy commitment',
        'Contact information',
      ],
      responsive: true,
    },
    {
      title: 'Embed / Share Page',
      description: 'iframe embed code generator with live preview and customization options.',
      icon: Code,
      page: 'embed',
      features: [
        'Calculator selection',
        'Theme customization (light/dark/auto)',
        'Size configuration',
        'Branding toggle',
        'Live preview panel',
        'Copy embed code button',
        'Implementation notes',
      ],
      responsive: true,
    },
    {
      title: 'Design System',
      description: 'Comprehensive UI kit with all components, variants, states, and design tokens.',
      icon: Palette,
      page: 'design-system',
      features: [
        'Color palette (light & dark)',
        'Typography scale',
        'Spacing & sizing system',
        'All component variants',
        'Interactive examples',
        'Accessibility guidelines',
        'Icon library',
      ],
      responsive: true,
    },
    {
      title: 'Calculator States Demo',
      description: 'Examples of loading, empty, and error states for calculators.',
      icon: MonitorSmartphone,
      page: 'states-demo',
      features: [
        'Loading state with skeletons',
        'Empty state patterns',
        'Error state examples',
        'Validation error messages',
        'Usage guidelines',
      ],
      responsive: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-foreground">SmartCalcLab Overview</h1>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
            Complete high-trust financial calculator website with professional fintech design system.
            All pages are fully responsive for desktop (1440px) and mobile (390px) viewports.
          </p>
        </div>

        {/* Key Features */}
        <Card className="mb-12 border-2 border-accent/50 bg-accent/5">
          <CardContent className="p-8">
            <h2 className="mb-6 text-center text-foreground">✨ Key Features</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mb-2 text-2xl font-semibold text-foreground">7</div>
                <p className="text-sm text-muted-foreground">Complete Pages</p>
              </div>
              <div className="text-center">
                <div className="mb-2 text-2xl font-semibold text-foreground">100%</div>
                <p className="text-sm text-muted-foreground">Responsive Design</p>
              </div>
              <div className="text-center">
                <div className="mb-2 text-2xl font-semibold text-foreground">40+</div>
                <p className="text-sm text-muted-foreground">UI Components</p>
              </div>
              <div className="text-center">
                <div className="mb-2 text-2xl font-semibold text-foreground">Light + Dark</div>
                <p className="text-sm text-muted-foreground">Theme Support</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pages Grid */}
        <div className="mb-12">
          <h2 className="mb-6 text-foreground">All Pages</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {pages.map((page) => {
              const Icon = page.icon;
              return (
                <Card key={page.page} className="group transition-all hover:border-accent/50 hover:shadow-md">
                  <CardHeader>
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                        <Icon className="size-6 text-primary" />
                      </div>
                      {page.responsive && (
                        <Badge variant="secondary" className="gap-1">
                          <MonitorSmartphone className="size-3" />
                          Responsive
                        </Badge>
                      )}
                    </div>
                    <CardTitle>{page.title}</CardTitle>
                    <CardDescription>{page.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h4 className="mb-2 text-sm font-semibold text-foreground">Features:</h4>
                      <ul className="space-y-1">
                        {page.features.map((feature, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            • {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button onClick={() => onNavigate(page.page)} className="w-full">
                      View Page
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Technical Details */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Technical Stack</CardTitle>
            <CardDescription>Built with modern, production-ready technologies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <h4 className="mb-2 font-semibold text-foreground">Framework & Styling</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• React 18 with TypeScript</li>
                  <li>• Tailwind CSS v4</li>
                  <li>• shadcn/ui components</li>
                  <li>• Radix UI primitives</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-foreground">UI Components</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Lucide React icons</li>
                  <li>• Recharts for data viz</li>
                  <li>• Motion for animations</li>
                  <li>• Sonner for toasts</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-foreground">Design System</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• 8px spacing grid</li>
                  <li>• WCAG AA accessible</li>
                  <li>• Consistent focus states</li>
                  <li>• Professional fintech palette</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* US Finance Content */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>US Finance Oriented Content</CardTitle>
            <CardDescription>Realistic calculators and terminology</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <h4 className="mb-2 text-sm font-semibold text-foreground">Loans</h4>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>• Mortgage Calculator</li>
                  <li>• Auto Loan Calculator</li>
                  <li>• Personal Loan Calculator</li>
                  <li>• Amortization Schedules</li>
                  <li>• APR Calculations</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold text-foreground">Retirement</h4>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>• 401(k) Calculator</li>
                  <li>• Roth IRA Calculator</li>
                  <li>• Retirement Savings</li>
                  <li>• Employer Matching</li>
                  <li>• Tax-deferred Growth</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold text-foreground">Debt Management</h4>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>• Credit Card Payoff</li>
                  <li>• Debt Consolidation</li>
                  <li>• Student Loan Repayment</li>
                  <li>• Interest Savings</li>
                  <li>• Payoff Strategies</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold text-foreground">Investing</h4>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>• Investment Returns</li>
                  <li>• Compound Interest</li>
                  <li>• ROI Calculations</li>
                  <li>• Future Value</li>
                  <li>• Monthly Contributions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Responsive Design */}
        <Card>
          <CardHeader>
            <CardTitle>Responsive Design Breakpoints</CardTitle>
            <CardDescription>Optimized for all screen sizes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium text-foreground">Mobile</p>
                  <p className="text-sm text-muted-foreground">iPhone, Android phones</p>
                </div>
                <Badge variant="outline">390px</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium text-foreground">Tablet</p>
                  <p className="text-sm text-muted-foreground">iPad, Android tablets</p>
                </div>
                <Badge variant="outline">768px</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium text-foreground">Desktop</p>
                  <p className="text-sm text-muted-foreground">Laptops, desktops</p>
                </div>
                <Badge variant="outline">1440px</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <h3 className="mb-6 text-foreground">Quick Navigation</h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={() => router.push('/')}>View Homepage</Button>
            <Button variant="outline" onClick={() => router.push('/calculators')}>
              Browse Calculators
            </Button>
            <Button variant="outline" onClick={() => router.push('/design-system')}>
              Design System
            </Button>
            <Button variant="outline" onClick={() => router.push('/states-demo')}>
              States Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
