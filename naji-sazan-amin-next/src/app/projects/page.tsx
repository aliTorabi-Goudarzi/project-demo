import type { Metadata } from 'next';

import { ProjectsExplorer } from '@/components/projects/ProjectsExplorer';
import { CtaPanel } from '@/components/shared/CtaPanel';
import { PageHead } from '@/components/shared/PageHead';
import { pageMetadata } from '@/lib/metadata';
import { PROJECT_CATEGORIES } from '@/lib/projects';

export const metadata: Metadata = pageMetadata({
  title: 'پروژه‌ها | مهندسین مشاور ناجی سازان امین',
  description: 'نمونه پروژه‌های شرکت مهندسین مشاور ناجی سازان امین.',
  path: '/projects',
});

// Runs before the cards paint so the category chosen in the header submenu is
// applied without a flash of the full grid.
const CAT_BOOTSTRAP = `try{var p=new URLSearchParams(location.search).get('cat');var cats=${JSON.stringify(
  PROJECT_CATEGORIES.map((category) => category.slug),
)};document.documentElement.setAttribute('data-cat',cats.indexOf(p)>-1?p:cats[0])}catch(e){}`;

export default function ProjectsPage() {
  return (
    <main>
      <script dangerouslySetInnerHTML={{ __html: CAT_BOOTSTRAP }} />
      {PROJECT_CATEGORIES.map((category) => (
        <div key={category.slug} data-cat-head={category.slug}>
          <PageHead title={category.title} lead={category.lead} />
        </div>
      ))}
      <ProjectsExplorer />
      <CtaPanel
        title="ایده‌ای در ذهن دارید؟"
        description="برای مشاوره و برآورد اولیه پروژه با ما در تماس باشید. تیم ما در ۲۴ ساعت پاسخگوی شما خواهد بود."
        primary={{ label: 'شروع همکاری', href: '/contact' }}
      />
    </main>
  );
}
