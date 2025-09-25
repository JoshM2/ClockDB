function timeAgo(epochTime) {
    try {
        const now = Date.now(); // Current time in milliseconds
        const millisecondsAgo = now - epochTime;

        const secondsAgo = Math.floor(millisecondsAgo / 1000);
        
        if (secondsAgo < 60) {
            return `${secondsAgo} second${secondsAgo === 1 ? '' : 's'} ago`;
        } else if (secondsAgo < 3600) {
            const minutesAgo = Math.floor(secondsAgo / 60);
            return `${minutesAgo} minute${minutesAgo === 1 ? '' : 's'} ago`;
        } else if (secondsAgo < 86400) {
            const hoursAgo = Math.floor(secondsAgo / 3600);
            return `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`;
        } else {
            const daysAgo = Math.floor(secondsAgo / 86400);
            return `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`;
        }
    }
    catch {
        return "";
    }
}



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
        const ps = context.env.db.prepare('SELECT name,wcaid FROM users WHERE key=?').bind(key)
        let data = await ps.first();
        if (data == null) {
            return Response.redirect("https://clockdb.net/login", 303);
        }


        let grid = "";
        let saved_data;
        if (!data.wcaid) {
            grid = "<h2>You need a WCA ID for saved reconstructions to work right now. If you do have a WCA ID you shouldn't be seeing this message so please contact me. If you actually don't have a WCA ID, let me know and I will try to make this work for you (because otherwise I will assume that everyone who makes reconstructions has a WCA ID and will have no reason to fix this.)</h2>";
        }
        else {
            const ps = context.env.db.prepare('SELECT * from saved WHERE authorid=?').bind(data.wcaid);
            saved_data = await ps.all();
            saved_data = saved_data["results"];
            if (saved_data.length == 0){
                grid = "<h2>you don't have any saved reconstructions yet!</h2>";
            }
            for (let i = saved_data.length-1; i>=0; i--) {
                let tile = `<a href="https://clockdb.net/reconstruct/${saved_data[i].num}" class="grid-item grid-item-card">
                <div>
                    <img width="100%" alt="" src="${saved_data[i].id ? 'https://img.youtube.com/vi/'+saved_data[i].id+'/mqdefault.jpg' : ""}">
                </div>
                <h2 class="solveTitle">${saved_data[i].name} - ${saved_data[i].time}</h2>
                <h4>${timeAgo(saved_data[i].num)}</h4>
            </a>`
                grid += tile;
            }
        }

        const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <script defer src="https://analytics.clockdb.net/script.js" data-website-id="c808d079-4a5b-4e4b-8f11-faed3445ceb3"></script>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>My Reconstructions - ClockDB</title>
            <link href="/css/style.css" rel="stylesheet" type="text/css"/>
            <link href="/css/home.css" rel="stylesheet" type="text/css"/>
            <link rel="icon" type="image/x-icon" href="/images/clock.ico">
            <META NAME=”robots” CONTENT=”noindex”>
        </head>
        <body>
            <div id="nav">
                <a href="/" id="home"><img src="/images/clock.ico" width="23" height="23"> ClockDB</a>
            </div>
            <h3>You can now save reconstruction progress! I have done very little testing so if you have any issues/feedback please contact me.</h3>
            <h1><a href="https://clockdb.net/reconstruct/new">Click here to make a new reconstruction</a></h1>
            
            <br><br><br>
            <h1>Or continue editing a saved reconstruction:</h1>
            <h4>(reconstructions are saved here for 30 days)</h4>

            <div id="grid-container">${grid}</div><br>

           



            <br><br><br>    
            <footer>
                <a href="/contact/">Contact</a>
                <a href="/reconstruct/">Make Reconstruction</a>
                <a href="https://github.com/JoshM2/ClockDB" target="_blank">GitHub</a>
            </footer>
        </body>
        </html>

        `

        return new Response(html, {
            headers: {
                "content-type": "text/html;charset=UTF-8",
            },
        });
    }
}