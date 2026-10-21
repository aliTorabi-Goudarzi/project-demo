import type { Metadata } from 'next';

import { PageHead } from '@/components/shared/PageHead';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'مهندسین مشاور ناجی سازان امین',
  description:
    'شرکت مهندسین مشاور ناجی سازان امین. طراحی، نظارت، مدیریت طرح و مشاوره مهندسی — از سال ۱۳۸۳.',
  path: '/',
});

export default function HomePage() {
  return (
    <main>
      <PageHead
        title="مهندسین مشاور ناجی سازان امین"
        lead="شرکت مهندسین مشاور ناجی سازان امین. طراحی، نظارت، مدیریت طرح و مشاوره مهندسی — از سال ۱۳۸۳."
      />
    </main>
  );
}
