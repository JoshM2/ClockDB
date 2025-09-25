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
        if (data1.access != 2) {
            return new Response("Sorry, your account does not have access to this page.")
        }

        const ps = context.env.db.prepare('SELECT * from queue')
        let data = await ps.all();
        data = data["results"]
        

        function encodeHtml(text) {
            return text.replace(/[\u00A0-\u9999<>&'"]/g, function(i) {
                return '&#'+i.charCodeAt(0)+';';
            });
        }

        const timeValues = data.map((jsonObj, index) => ({ index, solveStart: JSON.parse(jsonObj.solveStart)[1] }));
        let sortedIndexes = timeValues
            .sort((a, b) => a.solveStart - b.solveStart)
            .map(obj => obj.index);


        let officialGrid = "";
        let unofficialGrid = "";
        sortedIndexes.forEach(i => {
            let tagsHTML = ""
            data[i].tags = JSON.parse(data[i].tags)
            for (let x=0; x < data[i].tags.length; x++) {
                tagsHTML += `<span class='tags' style='background-color:${data[i].tags[x][1]};'>${data[i].tags[x][0]}</span> `;
            }
            //video recons
            if (data[i].id != undefined) {
                let title = data[i].title.includes(" - ") ? encodeHtml(data[i].title.split(" - ")[0]) : encodeHtml(data[i].title); 
                let tile = `<a href="/q/${data[i].num}" class="grid-item grid-item-card">
                    <div>
                        <img width="100%" alt="" src="${data[i].id != undefined ? 'https://img.youtube.com/vi/'+data[i].id+'/mqdefault.jpg' : '/images/thumbnails/'+i+'.png'}"></img>
                    </div>
                    <h2 class="solveTitle">${encodeHtml(data[i].name) + " " + title}</h2>
                    <div id="tagsDiv">${tagsHTML}</div>
                </a>`
                if (data[i].competitionName != "home (unofficial)") {
                    officialGrid += tile;
                }
                else {
                    unofficialGrid += tile;
                }
            }
        })

        const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <script defer src="https://analytics.clockdb.net/script.js" data-website-id="c808d079-4a5b-4e4b-8f11-faed3445ceb3"></script>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>QUEUE</title>
            <link href="/css/style.css" rel="stylesheet" type="text/css"/>
            <link href="/css/home.css" rel="stylesheet" type="text/css"/>
            <link rel="icon" type="image/x-icon" href="/images/clock.ico">
        </head>
        <body>
            <div id="nav">
                <a href="/" id="home"><img src="/images/clock.ico" width="23" height="23"> ClockDB</a>
            </div>
            <br><br>
            <h1>QUEUE</h1>

            <br><br>
            <h2 id="official">Official Solves</h2>
            <div id="grid-container">${officialGrid}</div><br>
            <h2 id="unofficial">Unofficial Solves</h2>
            <div id="grid-container">${unofficialGrid}</div><br>
            
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