import {reconstructionData} from '../src/js/data.js'
export function onRequest(context) {
    const data = JSON.parse(JSON.stringify(reconstructionData));

    let r = {};
    for (let i = 0; i < data.length; i++) {
    if (data[i].author in r) {
        r[data[i].author].push(i);
    } else {
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
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-EFNED9JD2F"></script>
        <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-EFNED9JD2F');
        </script>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title>Top Reconstructors - ClockDB</title>
        <link href="/css/style.css" rel="stylesheet" type="text/css"/>
        <link rel="icon" type="image/x-icon" href="/clock.ico">
    </head>
    <body>
        <div id="nav">
            <a href="/" id="home"><img src="/clock.ico" width="23" height="23"> ClockDB</a>
        </div>
    
        <h1>Reconstructors</h1>

        <div id="reconstructorList">${reconstructorHTML}</div>

        <br><br>
        Note: a reconstructed ao5 counts as 5 reconstructed solves, hence why there there are more solves here than tiles on the home page.
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