import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHead } from '@/components/shared/PageHead';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'صفحه یافت نشد | مهندسین مشاور ناجی سازان امین',
  description: 'صفحه‌ای که به دنبال آن هستید در دسترس نیست.',
  path: '/404',
});

export default function NotFound() {
  return (
    <main>
      <PageHead title="صفحه یافت نشد" lead="صفحه‌ای که به دنبال آن هستید در دسترس نیست." />
      <section className="section">
        <div className="container text-center">
          <Link className="btn btn--primary btn--lg" href="/">
            بازگشت به خانه
          </Link>
        </div>
      </section>
    </main>
  );
}
