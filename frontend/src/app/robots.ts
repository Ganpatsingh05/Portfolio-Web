import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/private/',
        '/uploads/',
        '/api/',
      ],
    },
    sitemap: 'https://ganpatsingh.tech/sitemap.xml',
    host: 'https://ganpatsingh.tech',
  }
}
