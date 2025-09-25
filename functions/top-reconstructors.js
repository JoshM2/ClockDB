export async function onRequest(context) {
    const ps = context.env.db.prepare('SELECT * from reconstructions')
    let data = await ps.all();
    data = data["results"]

    let r = {};
    for (let i = 0; i < data.length; i++) {
        if (data[i].id == undefined) {

        }
        else if (data[i].author in r) {
            r[data[i].author].push(i);
        }
        else {
            r[data[i].author] = [i];
        }
    }

    const entries = Object.entries(r);
    entries.sort((a, b) => b[1].length - a[1].length);
    const sortedDictionary = Object.fromEntries(entries);

    let reconstructorHTML = "";
    const keys = Object.keys(sortedDictionary);
    for (let i = 0; i < keys.length; i++) {
        reconstructorHTML += `<div>${keys[i]} - ${sortedDictionary[keys[i]].length}</div>`;
    }

    const html = `<!DOCTYPE html>
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

        <div id="reconstructorList">${reconstructorHTML}</div>

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

    return new Response(html, {
        headers: {
            "content-type": "text/html;charset=UTF-8",
        },
    });
}   