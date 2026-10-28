export async function onRequest(context) {
    // edge cache. cloudflare does not cache pages functions responses by
    // default, so this has to be done explicitly rather than by just setting
    // a cache-control header.
    const cache = caches.default;
    const cacheKey = new Request(new URL(context.request.url).toString(), context.request);
    const hit = await cache.match(cacheKey);
    if (hit) {
        return hit;
    }

    // grids are pregenerated once a day by workers/generate-home-grids.js
    const blob = await context.env.KV.get("home-grids", { type: "json" });
    const { official = "", unofficial = "", generated = "unknown" } = blob ?? {};

    // shown only when the KV key is missing, so the page still says something
    // sensible to a human instead of rendering as an empty grid
    const emptyNotice = blob ? "" : `<h2>Reconstructions are being regenerated &mdash; please check back shortly.</h2><br>`;

    const html = `<!DOCTYPE html>
    <!-- generated ${generated} -->
    <html lang="en">
    <head>
        <script defer src="https://analytics.clockdb.net/script.js" data-website-id="c808d079-4a5b-4e4b-8f11-faed3445ceb3"></script>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <meta name="description" content="Explore ClockDB.net, featuring over 1,500 reconstructions of top Rubik's Clock solves. Experience each solve from the solver's perspective with animations perfectly synchronized with the solve's video!">
        <title>ClockDB - Rubik's Clock Reconstructions</title>
        <link href="/css/style.css" rel="stylesheet" type="text/css"/>
        <link href="/css/home.css" rel="stylesheet" type="text/css"/>
        <link rel="icon" type="image/x-icon" href="/images/clock.ico">
    </head>
    <body>
        <div id="nav">
            <a href="/" id="home"><img src="/images/clock.ico" width="23" height="23"> ClockDB</a>
        </div>
        <a href="/lists">reconstruction lists</a><br><br>
        <br><br>
        ${emptyNotice}
        <input type="text" id="search" placeholder="Search"></input><br>

        <label class="filter grayLabel">
            <input type="checkbox" id="officialBox">Official
        </label>
        <label class="filter grayLabel">
            <input type="checkbox" id="unofficialBox">Unofficial
        </label>
        <label class="filter grayLabel">
            <input type="checkbox" id="singleBox">Single
        </label>
        <label class="filter grayLabel">
            <input type="checkbox" id="averageBox">Average
        </label>
        <label class="filter flipLabel">
            <input type="checkbox" id="flipBox">Flip
        </label>
        <label class="filter simulLabel">
            <input type="checkbox" id="simulBox">7-Simul
        </label>
        <label class="filter sfLabel">
            <input type="checkbox" id="sfBox">7sfndmw4lm
        </label>
        <label class="filter sheerinLabel">
            <input type="checkbox" id="sheerinBox">Sheerin
        </label>
        <label class="filter wrLabel">
            <input type="checkbox" id="wrBox">WR
        </label>
        <label class="filter crLabel">
            <input type="checkbox" id="crBox">CR
        </label>
        <label class="filter nrLabel">
            <input type="checkbox" id="nrBox">NR
        </label>

        <br><br>
        <h2 id="official">Official Solves</h2>
        <div id="grid-container">${official}</div><br>
        <h2 id="unofficial">Unofficial Solves</h2>
        <div id="grid-container">${unofficial}</div><br>
        <div id="badSearch" style="display: none">Sorry, but there aren't any reconstructions that match your search.</div>
        <br><br>

        <a href="/top-reconstructors/"><u>Thanks to everyone who has made a reconstruction!</u></a>
        <br><br><br><br>
        <footer>
            <a href="/contact/">Contact</a>
            <a href="/reconstruct/">Make Reconstruction</a>
            <a href="https://github.com/JoshM2/ClockDB" target="_blank">GitHub</a>
        </footer>
        <script src="/js/search.js"></script>
    </body>
    </html>`

    // key is missing: re-run workers/generate-home-grids.js from the dashboard.
    // 503 rather than an empty 200 so crawlers come back instead of recording
    // the home page as having no content, and no-store so the page recovers the
    // moment the key exists.
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
