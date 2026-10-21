import type { Metadata } from 'next';

import { ProjectsExplorer } from '@/components/projects/ProjectsExplorer';
import { CtaPanel } from '@/components/shared/CtaPanel';
import { PageHead } from '@/components/shared/PageHead';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'پروژه‌ها | مهندسین مشاور ناجی سازان امین',
  description: 'نمونه پروژه‌های شرکت مهندسین مشاور ناجی سازان امین.',
  path: '/projects',
});

export default function ProjectsPage() {
  return (
    <main>
      <PageHead
        title="نمونه پروژه‌های شاخص"
        lead="گزیده‌ای از پروژه‌های شاخص شرکت در حوزه‌های مختلف طراحی، نظارت و مدیریت طرح در سراسر کشور."
      />
      <ProjectsExplorer />
      <CtaPanel
        title="ایده‌ای در ذهن دارید؟"
        description="برای مشاوره و برآورد اولیه پروژه با ما در تماس باشید. تیم ما در ۲۴ ساعت پاسخگوی شما خواهد بود."
        primary={{ label: 'شروع همکاری', href: '/contact' }}
      />
    </main>
  );
}
