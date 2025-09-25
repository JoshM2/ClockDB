export async function onRequest(context) {
    const table = await context.env.KV.get("rankings-average");
 
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <script defer src="https://analytics.clockdb.net/script.js" data-website-id="c808d079-4a5b-4e4b-8f11-faed3445ceb3"></script>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title>Average Rankings - ClockDB</title>
        <link href="/css/style.css" rel="stylesheet" type="text/css"/>
        <link rel="icon" type="image/x-icon" href="/images/clock.ico">
    </head>
    <body>
        <div id="nav">
            <a href="/" id="home"><img src="/images/clock.ico" width="23" height="23"> ClockDB</a>
        </div>
    
        <h1>Official Average Rankings</h1>

        ${table}  
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