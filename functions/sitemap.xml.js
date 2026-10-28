// public pages that aren't generated from the database
const staticPages = [
    "/",
    "/lists",
    "/lists/rankings-single",
    "/lists/rankings-average",
    "/lists/wr-history-single",
    "/lists/wr-history-average",
    "/map",
    "/top-reconstructors",
    "/reconstruct",
    "/contact",
];

export async function onRequest(context) {
    const origin = "https://clockdb.net";

    const recons = await context.env.db.prepare('SELECT num FROM reconstructions ORDER BY num').all();
    const persons = await context.env.db.prepare('SELECT DISTINCT wcaid FROM reconstructions WHERE wcaid IS NOT NULL AND wcaid != "" ORDER BY wcaid').all();

    let paths = [...staticPages];
    for (const row of recons.results) {
        paths.push(`/r/${row.num}`);
    }
    for (const row of persons.results) {
        paths.push(`/persons/${encodeURIComponent(row.wcaid.toUpperCase())}`);
    }

    let urls = "";
    for (const path of paths) {
        urls += `    <url><loc>${origin}${path}</loc></url>\n`;
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}</urlset>`;

    return new Response(xml, {
        headers: {
            "content-type": "application/xml;charset=UTF-8",
            "cache-control": "public, max-age=86400",
        },
    });
}
