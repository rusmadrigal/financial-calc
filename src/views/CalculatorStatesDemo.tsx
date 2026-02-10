import { AlertCircle, FileX, Loader2, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function CalculatorStatesDemo() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-foreground">Calculator States Demo</h1>
          <p className="text-lg text-muted-foreground">
            Examples of loading, empty, and error states for calculators
          </p>
        </div>

        <Tabs defaultValue="loading" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="loading">Loading State</TabsTrigger>
            <TabsTrigger value="empty">Empty State</TabsTrigger>
            <TabsTrigger value="error">Error State</TabsTrigger>
          </TabsList>

          {/* Loading State */}
          <TabsContent value="loading" className="mt-6">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left: Input Skeleton */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    ))}
                    <div className="flex gap-3 pt-4">
                      <Skeleton className="h-10 flex-1" />
                      <Skeleton className="h-10 w-20" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right: Results Skeleton */}
              <div className="space-y-6 lg:col-span-2">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Loader2 className="size-5 animate-spin text-primary" />
                      Calculating...
                    </CardTitle>
                    <CardDescription>Please wait while we process your inputs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 sm:grid-cols-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i}>
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="mt-2 h-10 w-28" />
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                      <Skeleton className="h-9 w-24" />
                      <Skeleton className="h-9 w-32" />
                      <Skeleton className="h-9 w-36" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-36" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] animate-pulse rounded-lg bg-muted" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-56" />
                    <Skeleton className="h-4 w-64" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Empty State */}
          <TabsContent value="empty" className="mt-6">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left: Inputs with placeholder values */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Calculator Inputs</CardTitle>
                    <CardDescription>Enter your loan details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Alert>
                      <AlertCircle className="size-4" />
                      <AlertDescription className="text-sm">
                        Fill out all required fields to see your results
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>

              {/* Right: Empty State Cards */}
              <div className="space-y-6 lg:col-span-2">
                <Card className="border-2 border-dashed">
                  <CardContent className="py-16 text-center">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                      <TrendingUp className="size-8 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 font-semibold text-foreground">No Results Yet</h3>
                    <p className="mb-6 text-sm text-muted-foreground">
                      Enter your loan amount, interest rate, and term to calculate your monthly
                      payment
                    </p>
                    <Button>Start Calculating</Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-dashed">
                  <CardHeader>
                    <CardTitle>Payment Breakdown</CardTitle>
                    <CardDescription>Chart will appear after calculation</CardDescription>
                  </CardHeader>
                  <CardContent className="py-16 text-center">
                    <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                      <AlertCircle className="size-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      No data to display. Complete the form to generate your chart.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-dashed">
                  <CardHeader>
                    <CardTitle>Amortization Schedule</CardTitle>
                    <CardDescription>Payment schedule will appear here</CardDescription>
                  </CardHeader>
                  <CardContent className="py-16 text-center">
                    <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                      <FileX className="size-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enter loan details to generate a detailed amortization table
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Error State */}
          <TabsContent value="error" className="mt-6">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left: Inputs with validation errors */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Calculator Inputs</CardTitle>
                    <CardDescription>Please correct the errors below</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Validation errors shown */}
                    <Alert variant="destructive">
                      <AlertCircle className="size-4" />
                      <AlertTitle>Validation Error</AlertTitle>
                      <AlertDescription className="text-sm">
                        Please fix the following errors:
                        <ul className="mt-2 list-inside list-disc space-y-1">
                          <li>Loan amount must be greater than $0</li>
                          <li>Interest rate must be between 0% and 30%</li>
                          <li>Loan term must be a positive number</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>

              {/* Right: Error State */}
              <div className="space-y-6 lg:col-span-2">
                <Card className="border-2 border-destructive/50 bg-destructive/5">
                  <CardContent className="py-16 text-center">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10">
                      <AlertCircle className="size-8 text-destructive" />
                    </div>
                    <h3 className="mb-2 font-semibold text-foreground">
                      Unable to Calculate Results
                    </h3>
                    <p className="mb-2 text-sm text-muted-foreground">
                      We encountered an error processing your inputs. Please check the following:
                    </p>
                    <ul className="mx-auto mb-6 max-w-md space-y-2 text-left text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                        <span>All required fields must be filled out</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                        <span>Values must be within valid ranges</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                        <span>Check for any formatting errors</span>
                      </li>
                    </ul>
                    <div className="flex flex-wrap justify-center gap-3">
                      <Button variant="outline">Review Inputs</Button>
                      <Button>Try Again</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Individual field errors */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="border-destructive/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <AlertCircle className="size-4 text-destructive" />
                        Invalid Input
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Loan amount cannot be negative or zero. Please enter a valid amount.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-destructive/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <AlertCircle className="size-4 text-destructive" />
                        Out of Range
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Interest rate of 45% exceeds maximum allowed rate of 30%.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-destructive/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <AlertCircle className="size-4 text-destructive" />
                        Missing Required Field
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Loan term is required. Please specify the length of your loan.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-destructive/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <AlertCircle className="size-4 text-destructive" />
                        Invalid Format
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Please enter a numeric value. Special characters are not allowed.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* General error alert */}
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertTitle>Calculation Error</AlertTitle>
                  <AlertDescription>
                    The values you entered result in a calculation that exceeds system limits. Try
                    adjusting your loan amount or term to more typical values. If you continue to
                    experience issues, please contact support.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Usage Guidelines */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>State Management Guidelines</CardTitle>
            <CardDescription>When to use each state</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <h4 className="mb-2 font-semibold text-foreground">Loading State</h4>
                <p className="text-sm text-muted-foreground">
                  Show skeleton loaders or spinner when:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• Fetching data from server</li>
                  <li>• Processing complex calculations</li>
                  <li>• Initial page load</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-foreground">Empty State</h4>
                <p className="text-sm text-muted-foreground">
                  Display empty state when:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• No data has been entered yet</li>
                  <li>• User hasn't triggered calculation</li>
                  <li>• Results are cleared/reset</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-foreground">Error State</h4>
                <p className="text-sm text-muted-foreground">
                  Show error messages when:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• Invalid input values</li>
                  <li>• Validation fails</li>
                  <li>• Calculation errors occur</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
