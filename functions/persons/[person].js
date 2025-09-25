export async function onRequest(context) {
    const person = context.params.person.toUpperCase();

    const ps = context.env.db.prepare('SELECT * from reconstructions WHERE wcaid=?').bind(person);
    let data = await ps.all();
    data = data["results"] 
    if (data.length == 0){
        return new Response("This person doesn't have any reconstructions!", {
            status: 404,
            headers: {
                "content-type": "text/html;charset=UTF-8",
            },
        });
    }
    let name = data[0].name;
    if (name == "Pei-Ni Chiang & Jaidon Lin") {
        name = "Pei-Ni Chiang";
    }

    data.sort((a, b) => a.title.includes("DNF") - b.title.includes("DNF") || JSON.parse(a.solveStart)[1] - JSON.parse(b.solveStart)[1]);

    let officialGrid = "";
    let unofficialGrid = "";
    for (let i=0; i<data.length; i++) {
        let tagsHTML = ""
        let tags = JSON.parse(data[i].tags)
        for (let x=0; x < tags.length; x++) {
            tagsHTML += `<span class='tags' style='background-color:${tags[x][1]};'>${tags[x][0]}</span> `;
        }
        // video recons 
        if (data[i].id != undefined) {
            // set solve title text
            let title;
            if (data[i].title.includes(" - ")) {
                if (data[i].title.includes("DNF")) {
                    title = `${data[i].title.split(" - ")[1]} (${data[i].title.split(" - ")[0]})`;
                }
                else {
                    title = `${parseFloat(data[i].title.split(" - ")[1]).toFixed(2)} (${data[i].title.split(" - ")[0]})`;
                }
            }
            else if (data[i].title.includes("DNF")) {
                title = data[i].title.split(" ")[data[i].title.split(" ").length - 1];
            }
            else {
                title = JSON.parse(data[i].solveStart)[1].toFixed(2);
            }

            let tile = `<a href="/r/${data[i].num}" class="grid-item grid-item-card">
                <div>
                    <img width="100%" alt="" src="https://img.youtube.com/vi/${data[i].id}/mqdefault.jpg"></img>
                </div>
                <h2 class="solveTitle">${title}</h2>
                <div id="tagsDiv">${tagsHTML}</div>
            </a>`
            if (data[i].competitionName != "home (unofficial)") {
                officialGrid += tile;
            }
            else {
                unofficialGrid += tile;
            }
        }
    }

    let finalTiles = officialGrid ? `<h2 id="official">Official Solves</h2><div id="grid-container">${officialGrid}</div><br>` : "";
    finalTiles += unofficialGrid ? `<h2 id="official">Unofficial Solves</h2><div id="grid-container">${unofficialGrid}</div><br>` : "";

    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <script defer src="https://analytics.clockdb.net/script.js" data-website-id="c808d079-4a5b-4e4b-8f11-faed3445ceb3"></script>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title>${name} - ClockDB</title>
        <link href="/css/style.css" rel="stylesheet" type="text/css"/>
        <link href="/css/home.css" rel="stylesheet" type="text/css"/>
        <link rel="icon" type="image/x-icon" href="/images/clock.ico">
    </head>
    <body>
        <div id="nav">
            <a href="/" id="home"><img src="/images/clock.ico" width="23" height="23"> ClockDB</a>
        </div>
        <h1 id="title">${name} <a href="https://www.worldcubeassociation.org/persons/${person}" target="_blank"><img alt="WCA logo" width="32" height="32" src="/images/WCAlogo.svg"></img></a></h1>
        <br><br>
        ${finalTiles}
        <br><br><br>
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
