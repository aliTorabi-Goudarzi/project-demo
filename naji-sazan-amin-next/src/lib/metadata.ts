import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const rootMetadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: 'مهندسین مشاور ناجی سازان امین',
  description:
    'شرکت مهندسین مشاور ناجی سازان امین. طراحی، نظارت، مدیریت طرح و مشاوره مهندسی — از سال ۱۳۸۳.',
  icons: {
    icon: '/assets/logo.png',
  },
};

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
};

export function pageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    ...(siteUrl ? { alternates: { canonical: path } } : {}),
  };
}
