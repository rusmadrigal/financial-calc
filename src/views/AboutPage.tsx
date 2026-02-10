import { Shield, Eye, Target, Award, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'Accuracy First',
      description: 'Every calculator is built using industry-standard formulas and regularly validated against authoritative sources.',
    },
    {
      icon: Eye,
      title: 'Complete Transparency',
      description: 'We show our work. Every calculation includes detailed explanations, assumptions, and the methodology behind the numbers.',
    },
    {
      icon: Shield,
      title: 'Privacy Protected',
      description: 'No tracking, no data collection, no advertising. Your financial information never leaves your device.',
    },
    {
      icon: Award,
      title: 'User-Focused Design',
      description: 'Clean, accessible interfaces that work seamlessly across all devices. Financial tools should be easy to use.',
    },
  ];

  const timeline = [
    {
      year: '2024',
      title: 'SmartCalcLab Launched',
      description: 'Started with 6 core calculators focused on mortgages, loans, and retirement planning.',
    },
    {
      year: '2025',
      title: 'Expanded Coverage',
      description: 'Added comprehensive investment, debt management, and tax calculation tools.',
    },
    {
      year: '2026',
      title: 'Mobile-First Redesign',
      description: 'Complete UI overhaul with enhanced mobile experience and dark mode support.',
    },
  ];

  const stats = [
    { value: '50K+', label: 'Monthly Users' },
    { value: '12+', label: 'Calculators' },
    { value: '100%', label: 'Free Access' },
    { value: '0', label: 'Ads or Tracking' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
          <h1 className="text-foreground">About SmartCalcLab</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            We believe financial planning tools should be accurate, transparent, and accessible to
            everyone. SmartCalcLab provides professional-grade calculators without the noise.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-semibold text-foreground">{stat.value}</div>
                <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="border-b border-border py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
                <Target className="size-8 text-primary" />
              </div>
            </div>
            <h2 className="text-foreground">Our Mission</h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              SmartCalcLab exists to democratize access to high-quality financial planning tools.
              Too often, these calculators are hidden behind paywalls, cluttered with ads, or
              designed to capture your data. We're building something different: a trusted resource
              that respects your privacy and delivers accurate, actionable insights.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="border-b border-border bg-muted/30 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-foreground">Our Values</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              What guides everything we build
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} className="border-2">
                  <CardContent className="p-8">
                    <div className="mb-4 flex size-14 items-center justify-center rounded-xl bg-accent/10">
                      <Icon className="size-7 text-accent" />
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-foreground">{value.title}</h3>
                    <p className="leading-relaxed text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="border-b border-border py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
                <TrendingUp className="size-8 text-primary" />
              </div>
            </div>
            <h2 className="text-foreground">Our Methodology</h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              Every calculator on SmartCalcLab is built using established financial formulas and
              standards. We reference authoritative sources including the IRS, Consumer Financial
              Protection Bureau, Federal Reserve, and major financial institutions. Our calculations
              are regularly reviewed and updated to reflect current regulations and best practices.
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              We're transparent about our assumptions and limitations. Each calculator includes
              detailed explanations of the methodology, key assumptions, and sources. If a
              calculation has limitations or requires professional guidance, we clearly state that.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-b border-border bg-muted/30 py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-foreground">Our Journey</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Building better financial tools, one calculator at a time
            </p>
          </div>

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <span className="text-sm font-semibold">{item.year}</span>
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="mt-2 h-full w-0.5 bg-border" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="mb-2 text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Commitment */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-accent/20 bg-accent/5">
            <CardContent className="p-8 text-center sm:p-12">
              <div className="mb-6 flex justify-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-accent/20">
                  <Shield className="size-8 text-accent" />
                </div>
              </div>
              <h2 className="mb-4 text-foreground">Privacy Commitment</h2>
              <p className="mx-auto max-w-2xl leading-relaxed text-muted-foreground">
                Your financial information is sensitive. SmartCalcLab performs all calculations
                directly in your browser—nothing is sent to our servers. We don't use analytics,
                tracking pixels, or third-party scripts. We don't collect email addresses or require
                accounts. Your privacy isn't a feature; it's our foundation.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact/Community */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
              <Users className="size-8 text-primary" />
            </div>
          </div>
          <h2 className="mb-4 text-foreground">Questions or Feedback?</h2>
          <p className="mx-auto mb-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            We're constantly improving our calculators based on user feedback. If you have
            suggestions, find an error, or want to request a new calculator, we'd love to hear from
            you.
          </p>
          <a
            href="mailto:hello@smartcalclab.com"
            className="inline-flex items-center gap-2 text-lg font-medium text-accent hover:underline"
          >
            hello@smartcalclab.com
          </a>
        </div>
      </section>
    </div>
  );
}
