export async function onRequest(context) {
    const vid_id = context.params.vid_id;
    console.log(vid_id)
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
            return new Response("error");
        }



        const ps2 = context.env.db.prepare('SELECT num, name, title, id FROM reconstructions WHERE author<>?').bind(data.name);
        let reconIds = await ps2.all();
        reconIds = reconIds.results;
        const ps3 = context.env.db.prepare('SELECT name, title, id FROM queue WHERE author<>? AND num>10000').bind(data.name);
        let queueIds = await ps3.all();
        queueIds = queueIds.results;
        
        console.log(reconIds)

        let reconDuplicates = "";
        for (let n=0; n<(reconIds?.length || 0); n++) {
            let i = reconIds[n];
            if (vid_id==i.id) {
                reconDuplicates += `<br>${i.name} ${i.title}: <a href="https://clockdb.net/r/${i.num}" target="_blank">clockdb.net/r/${i.num}</a>`
            }
        }
        let queueDuplicates = "";
        for (let n=0; n<(queueIds?.length || 0); n++) {
            let i = queueIds[n];
            if (vid_id==i.id) {
                queueDuplicates += `<br>${i.name} ${i.title}`
            }
        }


        let combinedList=""
        if (reconDuplicates != "") {
            combinedList += "<br>Reconstructions using same video:<br>" + reconDuplicates;
        }
        if (queueDuplicates != "") {
            combinedList += '<br>Recently submitted reconstructions (<a href="https://clockdb.net/reconstruct/not-yet-accepted" target="_blank">not yet on the site</a>) using the same video<br>' + queueDuplicates;
        }
        if (combinedList != "") {
            combinedList = "WARNING: you have entered a video that has been used in one or more reconstructions that are already on the site. Please make sure that the solve you are reconstructing has not already been reconstructed.<br>" + combinedList;
        }


        return new Response(combinedList, {
            headers: {
                "content-type": "text/html;charset=UTF-8",
            },
        })
    }
}