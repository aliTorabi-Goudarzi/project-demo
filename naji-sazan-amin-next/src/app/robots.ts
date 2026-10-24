import type { MetadataRoute } from 'next';

// Static export: the env var is read once at build time.
export const dynamic = 'force-static';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:8080';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteUrl.replace(/\/$/, '')}/sitemap.xml`,
  };
}
