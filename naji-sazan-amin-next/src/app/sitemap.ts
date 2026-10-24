import type { MetadataRoute } from 'next';

// Static export: the env var is read once at build time.
export const dynamic = 'force-static';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:8080').replace(/\/$/, '');

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ['', '/about/', '/projects/', '/contact/'].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.8,
  }));
}
