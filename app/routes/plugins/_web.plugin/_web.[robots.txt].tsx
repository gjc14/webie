/**
 * @see https://developers.google.com/search/docs/crawling-indexing/robots/create-robots-txt?hl=zh-tw
 */

export const loader = () => {
    const robotText = `
        User-agent: Googlebot
        Disallow: /nogooglebot/

        User-agent: *
        Allow: /

        Sitemap: https://${process.env.BASE_URL}/sitemap.xml`
        .replace(/^[ \t]+(?=\S)/gm, '')
        .trim()

    return new Response(robotText, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
        },
    })
}
