import { defineField, defineType } from "sanity";

export const calculatorPage = defineType({
  name: "calculatorPage",
  title: "Calculator Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "toolCategory" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "calculatorType",
      title: "Calculator Type",
      type: "string",
      description:
        "Must match the registry key. Slug (no leading slash) → calculatorType: mortgage-calculator → mortgage, refinance-calculator → refinance, rent-vs-buy-calculator → rentVsBuy, loan-amortization-calculator → amortization, auto-loan-calculator → autoLoan, car-lease-calculator → carLease, personal-loan-calculator → personalLoan, credit-card-payoff-calculator → creditCardPayoff, debt-snowball-calculator → debtSnowball, debt-avalanche-calculator → debtAvalanche.",
      options: {
        list: [
          { title: "Mortgage", value: "mortgage" },
          { title: "Refinance", value: "refinance" },
          { title: "Rent vs Buy", value: "rentVsBuy" },
          { title: "Loan Amortization", value: "amortization" },
          { title: "Auto Loan", value: "autoLoan" },
          { title: "Car Lease", value: "carLease" },
          { title: "Personal Loan", value: "personalLoan" },
          { title: "Credit Card Payoff", value: "creditCardPayoff" },
          { title: "Debt Snowball", value: "debtSnowball" },
          { title: "Debt Avalanche", value: "debtAvalanche" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
    }),
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
    }),
    defineField({
      name: "noindex",
      title: "No Index",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "blockContent",
    }),
    defineField({
      name: "howItWorks",
      title: "How It Works",
      type: "blockContent",
      description: "Rich text for the “How It Works” tab.",
    }),
    defineField({
      name: "sources",
      title: "Sources",
      type: "blockContent",
      description: "Rich text for the “Sources” tab.",
    }),
    defineField({
      name: "faqs",
      title: "Frequently Asked Questions",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "question",
              title: "Question",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "answer",
              title: "Answer",
              type: "blockContent",
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: { question: "question" },
            prepare: ({ question }: { question?: string }) => ({
              title: question ?? "FAQ",
            }),
          },
        },
      ],
    }),
  ],
});
