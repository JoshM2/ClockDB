import {reconstructionData} from '../../src/js/data.js'
export function onRequest(context) {
    const person = context.params.person.toUpperCase();
    const data = JSON.parse(JSON.stringify(reconstructionData));
    const findPerson = data.find(entry => entry.wcaid === person);

    if (!findPerson){
        return new Response("This person doesn't have any reconstructions!", {
            status: 404,
            headers: {
                "content-type": "text/html;charset=UTF-8",
            },
        });
    }

    const name = findPerson.name;

    const timeValues = data.map((jsonObj, index) => ({ index, solveStart: jsonObj.solveStart[1] }));
    let sortedIndexes = timeValues
        .sort((a, b) => a.solveStart - b.solveStart)
        .map(obj => obj.index);

    // the following lines are a temporary solution to put averages onto the site.
    sortedIndexes = sortedIndexes.filter(number => ![45, 46, 47, 48, 49].includes(number));
    sortedIndexes.unshift(45);
    sortedIndexes = sortedIndexes.filter(number => ![30, 31, 32, 33, 34].includes(number));
    sortedIndexes.unshift(30);
    sortedIndexes = sortedIndexes.filter(number => ![54, 55, 56, 57, 58].includes(number));
    sortedIndexes.unshift(54);
    sortedIndexes = sortedIndexes.filter(number => ![77, 78, 79, 80, 81].includes(number));
    sortedIndexes.unshift(77);
    sortedIndexes = sortedIndexes.filter(number => ![90, 91, 92, 93, 94].includes(number));
    sortedIndexes.unshift(90);
    sortedIndexes = sortedIndexes.filter(number => ![67, 44, 68, 69, 70].includes(number));
    sortedIndexes.unshift(67);
    sortedIndexes = sortedIndexes.filter(number => ![15, 16, 17, 18, 19].includes(number));
    sortedIndexes.unshift(15);
    sortedIndexes = sortedIndexes.filter(number => ![37, 38, 39, 40, 41].includes(number));
    sortedIndexes.unshift(37);

    let officialGrid = "";
    let unofficialGrid = "";
    sortedIndexes.forEach(i => {
        if (data[i].wcaid == person) { 
            let tagsHTML = ""
            for (let x=0; x < data[i].tags.length; x++) {
                tagsHTML += `<span class='tags' style='background-color:${data[i].tags[x][1]};'>${data[i].tags[x][0]}</span>`;
            }
            let title = data[i].title.includes(" - ") ? data[i].title.split(" - ")[0] : data[i].title; 
            let tile = `<a href="/r/${i}" class="grid-item">
                <div>
                    <img width="100%" alt="" src="${data[i].id != undefined ? 'https://img.youtube.com/vi/'+data[i].id+'/mqdefault.jpg' : '/images/thumbnails/'+i+'.png'}"></img>
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
    })
    let finalTiles = officialGrid ? `<h2 id="official">Official Solves</h2><div id="grid-container">${officialGrid}</div><br>` : "";
    finalTiles += unofficialGrid ? `<h2 id="official">Unofficial Solves</h2><div id="grid-container">${unofficialGrid}</div><br>` : "";

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
