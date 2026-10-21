import type { Metadata } from 'next';

import { ContactForm } from '@/components/contact/ContactForm';
import { ContactInfo } from '@/components/contact/ContactInfo';
import { PageHead } from '@/components/shared/PageHead';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'تماس | مهندسین مشاور ناجی سازان امین',
  description:
    'تماس با شرکت مهندسین مشاور ناجی سازان امین — آدرس، تلفن، ایمیل و فرم درخواست مشاوره.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <main>
      <PageHead
        title="تماس با ما"
        lead="برای دریافت مشاوره، برآورد اولیه یا هرگونه همکاری، از طریق فرم زیر یا اطلاعات تماس با ما در ارتباط باشید."
      />
      <section className="section">
        <div className="container">
          <div className="contact-hub-grid">
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
