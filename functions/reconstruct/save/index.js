export async function onRequest(context) {
    let cookieHeader = context.request.headers.get('cookie');

    if (!cookieHeader) {
        return new Response("Please open clockdb.net/login in a new window, login, and reclick the submit button. Contact me if this issue persists.");
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
            return new Response("Please open clockdb.net/login in a new window, login, and reclick the submit button. Contact me if this issue persists.");
        }

        // I can/should probably move some of these try catches because they don't do anything. parseFloat returns NaN not an error.
        let d, idValue, name;
        try {
            d = JSON.parse(cookies['reconData']);
            idValue = Date.now();
            name = data.name;
        } catch (error) {
            return new Response("Error. Please contact me if this issue persists.");
        }
        


        const ps2 = context.env.db.prepare(`
            INSERT INTO saved (
                num, id, recon, name, time, method, wcaid, scramble, startTimestamp, date, official, competitionName, competitionLink, authorId
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            idValue, d['vidId'], JSON.stringify(d['recon']), d['solverName'].trim(), d['solveTime'], d['methodUsed'], d['solverWCAID'].trim(), d['solveScramble'].trim(), d['timerStart'], d['solveDate'], d['officialStatus'], d['compName'].trim(), d['compLink'].trim(), data.wcaid
        );
        await ps2.all();
        return new Response('Saved. Future edits will not be saved unless you hit save again. If the reconstruction is complete, please hit the submit button so the reconstruction can be added to the site.')
    }
}