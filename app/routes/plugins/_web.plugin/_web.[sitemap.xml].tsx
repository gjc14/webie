/**
 * @see https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap
 */
import { getPosts } from '~/lib/db/post.server'
import { siteRoutes } from './_web/components/footer'

export const toXmlSitemap = (pages: { url: string; lastmod: Date }[]) => {
    // TODO: Add lastmod
    const urlsAsXml = pages
        .map(
            page =>
                `<url><loc>${page.url}</loc><lastmod>${page.lastmod
                    .toISOString()
                    .replace(/\.\d{3}Z$/, '+00:00')}</lastmod></url>`
        )
        .join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>
      <urlset
        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      >
        ${urlsAsXml}
      </urlset>`
}

export const loader = async () => {
    const BASE_URL = `https://${process.env.BASE_URL}`

    const { posts } = await getPosts({
        status: 'PUBLISHED',
    })

    const sitemap = toXmlSitemap([
        ...siteRoutes.map(to => ({
            url: `${BASE_URL}${to}`,
            lastmod: new Date(),
        })),
        ...posts.map(post => ({
            url: `${BASE_URL}/blog/${post.slug}`,
            lastmod: post.updatedAt,
        })),
    ])

    try {
        return new Response(sitemap, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml',
                'X-Content-Type-Options': 'nosniff',
                'Cache-Control': 'public, max-age=3600',
            },
        })
    } catch (e) {
        throw new Response('Internal Server Error', { status: 500 })
    }
}
