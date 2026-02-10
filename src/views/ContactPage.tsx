export function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-foreground">Contact Us</h1>
        <div className="space-y-4 text-muted-foreground">
          <p className="text-lg">
            Have a question, suggestion, or found an issue? We&apos;d love to
            hear from you.
          </p>
          <div className="mt-8 rounded-lg border-2 border-border bg-card p-8">
            <h2 className="mb-4 text-foreground">Get in Touch</h2>
            <p className="mb-4">
              Email us at:{" "}
              <a
                href="mailto:hello@smartcalclab.com"
                className="font-medium text-accent hover:underline"
              >
                hello@smartcalclab.com
              </a>
            </p>
            <p className="text-sm">
              We typically respond within 1-2 business days. For calculator
              suggestions, please include the type of calculation you need and
              what information you&apos;d like to see in the results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
