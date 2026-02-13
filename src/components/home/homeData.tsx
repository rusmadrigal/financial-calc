import type { LucideIcon } from "lucide-react";
import {
  TrendingUp,
  Home,
  CreditCard,
  PiggyBank,
  DollarSign,
  Shield,
  Eye,
  Lock,
  FileDown,
  CheckCircle2,
  Smartphone,
  Printer,
} from "lucide-react";

export interface FeaturedCalculatorItem {
  title: string;
  description: string;
  icon: LucideIcon;
  badges: string[];
  /** Slug for navigation (e.g. mortgage-calculator). */
  slug?: string;
}

export interface CategoryItem {
  name: string;
  icon: LucideIcon;
  count: number;
  color: string;
}

export interface BenefitItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface TrustIndicatorItem {
  label: string;
  icon: LucideIcon;
}

export interface TestimonialItem {
  name: string;
  role: string;
  rating: number;
  text: string;
}

export const categories: CategoryItem[] = [
  { name: "Investing", icon: TrendingUp, count: 12, color: "text-chart-1" },
  { name: "Debt", icon: CreditCard, count: 8, color: "text-chart-2" },
  { name: "Loans", icon: Home, count: 15, color: "text-chart-3" },
  { name: "Retirement", icon: PiggyBank, count: 10, color: "text-chart-5" },
  { name: "Taxes", icon: DollarSign, count: 6, color: "text-chart-4" },
];

export const benefits: BenefitItem[] = [
  {
    title: "Built for Accuracy",
    description:
      "Every calculation is based on standard US financial formulas and regularly validated.",
    icon: CheckCircle2,
  },
  {
    title: "Complete Transparency",
    description:
      "See exactly how results are calculated with detailed breakdowns and assumptions.",
    icon: Eye,
  },
  {
    title: "Privacy First",
    description:
      "No tracking, no data collection. Your financial information stays on your device.",
    icon: Lock,
  },
  {
    title: "Export & Share",
    description:
      "Download results as PDF or Excel, or share calculations with your advisor.",
    icon: FileDown,
  },
];

export const trustIndicators: TrustIndicatorItem[] = [
  { label: "Free Forever", icon: DollarSign },
  { label: "No Signup Required", icon: Shield },
  { label: "Mobile Friendly", icon: Smartphone },
  { label: "Printable Results", icon: Printer },
];

export const testimonials: TestimonialItem[] = [
  {
    name: "Sarah M.",
    role: "First-time Homebuyer",
    rating: 5,
    text: "The mortgage calculator helped me understand exactly what I could afford. Clear, detailed, and trustworthy.",
  },
  {
    name: "James T.",
    role: "Retirement Planning",
    rating: 5,
    text: "Finally, a 401(k) calculator that breaks down employer matching and tax advantages in plain English.",
  },
  {
    name: "Maria L.",
    role: "Debt Management",
    rating: 5,
    text: "Used the credit card payoff calculator to create a plan. Saved hundreds in interest!",
  },
];
