'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CalculatorsPage } from '@/app/pages/CalculatorsPage';

function CalculatorsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') ?? undefined;
  return <CalculatorsPage initialCategory={initialCategory} />;
}

export default function CalculatorsRoutePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <CalculatorsContent />
    </Suspense>
  );
}
