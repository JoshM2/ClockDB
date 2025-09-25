export async function onRequest(context) {
    let cookieHeader = context.request.headers.get('cookie');
    if (!cookieHeader) {
        return Response.redirect("https://clockdb.net/login", 303);
    }
    else {
        // Parse the cookie string to individual cookies
        const cookies = cookieHeader.split(';').reduce((cookiesObject, cookie) => {
            let [name, value] = cookie.split('=').map(c => c.trim());
            cookiesObject[name] = value;
            return cookiesObject;
        }, {});
        // Check the auth cookie
        const key = cookies['auth'];
        if (key == null) {
            return Response.redirect("https://clockdb.net/login", 303);
        }
        const ps1 = context.env.db.prepare('SELECT * FROM users WHERE key=?').bind(key)
        let data1 = await ps1.first();
        if (data1 == null) {
            return Response.redirect("https://clockdb.net/login", 303);
        }

        const ps = context.env.db.prepare('SELECT * from queue')
        let data = await ps.all();
        data = data["results"]
        
        let list = ""
        for (let i=0; i<data.length; i++) {
            if (data[i].num > 10000) {
                list += `${data[i].name} ${data[i].title} - <a href="https://youtube.com/watch?v=${data[i].id}" target="_blank">video link</a><br>`
            }
        }

        if (list == "") {
            list = "None"
        }

        const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <script defer src="https://analytics.clockdb.net/script.js" data-website-id="c808d079-4a5b-4e4b-8f11-faed3445ceb3"></script>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>not yet accepted</title>
            <link href="/css/style.css" rel="stylesheet" type="text/css"/>
            <link href="/css/home.css" rel="stylesheet" type="text/css"/>
            <link rel="icon" type="image/x-icon" href="/images/clock.ico">
            <META NAME=”robots” CONTENT=”noindex”>
        </head>
        <body>
            <div id="nav">
                <a href="/" id="home"><img src="/images/clock.ico" width="23" height="23"> ClockDB</a>
            </div>
            <br><br>
            <h1>Reconstructions that have been submitted but aren't on the site yet</h1>
            <h3>Check this list if you want to make sure that no one has already reconstructed a solve that you want to reconstruct</h3>

            <br><br>
            
            ${list}
            
            <br><br><br><br>
            <footer>
                <a href="/contact/">Contact</a>
                <a href="/reconstruct/">Make Reconstruction</a>
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
}   