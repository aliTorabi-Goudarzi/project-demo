import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import '@/styles/fonts.css';
import '@/styles/tokens.css';
import '@/styles/main.css';

import { ProjectModalProvider } from '@/components/layout/ProjectModalProvider';
import { SiteEffects } from '@/components/layout/SiteEffects';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { rootMetadata } from '@/lib/metadata';

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const themeScript =
  "try{var t=localStorage.getItem('nsa-theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t);}else if(window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.setAttribute('data-theme','dark');}}catch(e){}";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" data-theme="light" suppressHydrationWarning>
      <head>
        {/* Preload the arabic (Persian) variable subset — Next only auto-preloads
            static-weight @font-face, so this is manual; postbuild rewrites the
            path to the content-hashed file and it must stay a single tag. */}
        <link
          rel="preload"
          href="/assets/fonts/vazirmatn-0.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ProjectModalProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </ProjectModalProvider>
        <SiteEffects />
      </body>
    </html>
  );
}
