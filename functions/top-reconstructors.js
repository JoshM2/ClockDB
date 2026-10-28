export async function onRequest(context) {
    const cache = caches.default;
    const cacheKey = new Request(new URL(context.request.url).toString(), context.request);
    const hit = await cache.match(cacheKey);
    if (hit) {
        return hit;
    }

    // pregenerated once a day by workers/generate-home-grids.js
    const blob = await context.env.KV.get("top-reconstructors", { type: "json" });
    const { html: reconstructorHTML = "", generated = "unknown" } = blob ?? {};

    const emptyNotice = blob ? "" : `<div>This list is being regenerated &mdash; please check back shortly.</div>`;

    const html = `<!DOCTYPE html>
    <!-- generated ${generated} -->
    <html lang="en">
    <head>
        <script defer src="https://analytics.clockdb.net/script.js" data-website-id="c808d079-4a5b-4e4b-8f11-faed3445ceb3"></script>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title>Top Reconstructors - ClockDB</title>
        <link href="/css/style.css" rel="stylesheet" type="text/css"/>
        <link rel="icon" type="image/x-icon" href="/images/clock.ico">
    </head>
    <body>
        <div id="nav">
            <a href="/" id="home"><img src="/images/clock.ico" width="23" height="23"> ClockDB</a>
        </div>

        <h1>Reconstructors</h1>

        <div id="reconstructorList">${emptyNotice}${reconstructorHTML}</div>

        <br><br>
        Note: a reconstructed ao5 counts as 5 reconstructed solves.
        <br><br><br>

        <footer>
            <a href="/contact">Contact</a>
            <a href="/reconstruct">Make Reconstruction</a>
            <a href="https://github.com/JoshM2/ClockDB" target="_blank">GitHub</a>
        </footer>
    </body>
    </html>`

    if (!blob) {
        return new Response(html, {
            status: 503,
            headers: {
                "content-type": "text/html;charset=UTF-8",
                "cache-control": "no-store",
                "retry-after": "3600",
            },
        });
    }

    const response = new Response(html, {
        headers: {
            "content-type": "text/html;charset=UTF-8",
            "cache-control": "public, max-age=0, s-maxage=300",
        },
    });
    context.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
}
