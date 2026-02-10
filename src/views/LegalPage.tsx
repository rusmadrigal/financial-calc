export function LegalPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-foreground">{title}</h1>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="text-muted-foreground">
            <em>Last updated: February 8, 2026</em>
          </p>

          {title === 'Privacy Policy' ? (
            <>
              <h2 className="mt-8 text-foreground">Our Privacy Commitment</h2>
              <p className="text-muted-foreground">
                SmartCalcLab is committed to protecting your privacy. We&apos;ve designed our calculators
                to perform all computations locally in your browser. This means:
              </p>
              <ul className="text-muted-foreground">
                <li>We do not collect any personal information</li>
                <li>We do not track your calculations or inputs</li>
                <li>We do not use analytics or tracking cookies</li>
                <li>We do not share any data with third parties</li>
                <li>Your financial information never leaves your device</li>
              </ul>

              <h2 className="mt-8 text-foreground">What We Collect</h2>
              <p className="text-muted-foreground">
                We collect minimal technical information necessary to deliver the service:
              </p>
              <ul className="text-muted-foreground">
                <li>
                  <strong>Server Logs:</strong> Basic access logs (IP address, browser type, pages
                  visited) are temporarily stored for security and debugging purposes, then deleted
                  after 7 days.
                </li>
                <li>
                  <strong>No Cookies:</strong> We do not use tracking cookies. We may use essential
                  cookies only for core functionality (like theme preference).
                </li>
              </ul>

              <h2 className="mt-8 text-foreground">Your Rights</h2>
              <p className="text-muted-foreground">
                Since we don&apos;t collect personal data, there&apos;s nothing to request, delete, or
                export. Your calculations are yours alone.
              </p>

              <h2 className="mt-8 text-foreground">Contact</h2>
              <p className="text-muted-foreground">
                Questions about privacy? Email us at hello@smartcalclab.com
              </p>
            </>
          ) : (
            <>
              <h2 className="mt-8 text-foreground">Terms of Use</h2>
              <p className="text-muted-foreground">
                By using SmartCalcLab, you agree to the following terms:
              </p>

              <h3 className="mt-6 text-foreground">1. Educational Purpose</h3>
              <p className="text-muted-foreground">
                All calculators are provided for educational and informational purposes only. They
                are not intended as financial, legal, or tax advice. Always consult qualified
                professionals for guidance specific to your situation.
              </p>

              <h3 className="mt-6 text-foreground">2. Accuracy Disclaimer</h3>
              <p className="text-muted-foreground">
                While we strive for accuracy, we make no warranties about the completeness,
                reliability, or accuracy of the calculations. Use results at your own risk.
              </p>

              <h3 className="mt-6 text-foreground">3. No Liability</h3>
              <p className="text-muted-foreground">
                SmartCalcLab and its operators are not liable for any decisions made or actions
                taken based on information from our calculators.
              </p>

              <h3 className="mt-6 text-foreground">4. Free Service</h3>
              <p className="text-muted-foreground">
                SmartCalcLab is provided free of charge. We reserve the right to modify or
                discontinue the service at any time.
              </p>

              <h3 className="mt-6 text-foreground">5. Acceptable Use</h3>
              <p className="text-muted-foreground">
                You agree not to misuse the service, including attempting to access it through
                automated means that could damage or impair functionality.
              </p>

              <h3 className="mt-6 text-foreground">6. Embedding</h3>
              <p className="text-muted-foreground">
                You may embed our calculators on your website with proper attribution. See our Embed
                page for details.
              </p>

              <h2 className="mt-8 text-foreground">Contact</h2>
              <p className="text-muted-foreground">
                Questions about these terms? Email us at hello@smartcalclab.com
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
