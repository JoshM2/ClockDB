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


        const solveNum = context.params.solve;
        const ps = context.env.db.prepare('SELECT * FROM queue WHERE num=?').bind(solveNum);
        let data = await ps.first();
        //data['num'] = 1000
        //return new Response(Object.values(data))
        // const ps2 = context.env.db.prepare(`
        //     INSERT INTO archive (
        //         num, name, title, wcaid, id, recon, startTime, endTime,
        //         solveStart, tags, scramble, inspection, solution, date,
        //         competitionName, competitionLink, author, authorId, average
        //     )
        //     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        // `).bind(
        //     data['num'], data['name'], data['title'], data['wcaid'], data['id'],
        //     data['recon'], data['startTime'], data['endTime'], data['solveStart'],
        //     data['tags'], data['scramble'], data['inspection'], data['solution'],
        //     data['date'], data['competitionName'], data['competitionLink'],
        //     data['author'], data['authorId'], data['average']
        // );
        // await ps2.all();
        const ps3 = context.env.db.prepare(`
            INSERT INTO reconstructions (
                num, name, title, wcaid, id, recon, startTime, endTime,
                solveStart, tags, scramble, inspection, solution, date,
                competitionName, competitionLink, author, authorId, average
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            data['num'], data['name'], data['title'], data['wcaid'], data['id'],
            data['recon'], data['startTime'], data['endTime'], data['solveStart'],
            data['tags'], data['scramble'], data['inspection'], data['solution'],
            data['date'], data['competitionName'], data['competitionLink'],
            data['author'], data['authorId'], data['average']
        );
        await ps3.all();
        return new Response("yo")





    }
}