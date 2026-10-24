import type { MetadataRoute } from 'next';

import { SITE } from '@/lib/site';

// Static export: the manifest content is fully static.
export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.legalName,
    short_name: SITE.name,
    description: SITE.description,
    start_url: '/',
    display: 'standalone',
    dir: 'rtl',
    lang: 'fa',
    background_color: '#ffffff',
    theme_color: '#030351',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
