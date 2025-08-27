import { getNavigationForSitemap } from '@/lib/docs-navigation'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: 'https://docs.onboardjs.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...getNavigationForSitemap().map((link) => ({
      url: `https://docs.onboardjs.com${link.href}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
