import type { Metadata } from 'next';

import { CircularGallery } from '@/components/home/CircularGallery';
import { Credentials } from '@/components/home/Credentials';
import { HomeHero } from '@/components/home/HomeHero';
import { HomePillars } from '@/components/home/HomePillars';
import { Services21 } from '@/components/home/Services21';
import { Team } from '@/components/home/Team';
import { CtaPanel } from '@/components/shared/CtaPanel';
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
      <HomeHero />
      <Services21 />
      <CircularGallery />
      <HomePillars />
      <Credentials />
      <Team />
      <CtaPanel
        title="پروژه بعدی شما"
        description="برای دریافت مشاوره تخصصی و برآورد اولیه با ما در تماس باشید. تیم ما آماده پاسخگویی به نیازهای پروژه شماست."
        primary={{ label: 'تماس با ما', href: '/contact' }}
        secondary={{ label: 'درباره شرکت', href: '/about' }}
      />
    </main>
  );
}
