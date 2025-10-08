import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const pages = ['/', '/resume', '/projekte', '/kontakt'];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
		.map(
			(page) => `
  <url>
    <loc>https://janburzinski.de${page}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  `
		)
		.join('')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
