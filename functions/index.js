import {reconstructionData} from '../src/js/data.js'
export function onRequest(context) {
    const data = JSON.parse(JSON.stringify(reconstructionData));

    const timeValues = data.map((jsonObj, index) => ({ index, solveStart: jsonObj.solveStart[1] }));
    let sortedIndexes = timeValues
        .sort((a, b) => a.solveStart - b.solveStart)
        .map(obj => obj.index);

    // the following six lines are a temporary solution to put averages onto the site.
    sortedIndexes = sortedIndexes.filter(number => ![45, 46, 47, 48, 49].includes(number));
    sortedIndexes.unshift(45);
    sortedIndexes = sortedIndexes.filter(number => ![30, 31, 32, 33, 34].includes(number));
    sortedIndexes.unshift(30);
    sortedIndexes = sortedIndexes.filter(number => ![54, 55, 56, 57, 58].includes(number));
    sortedIndexes.unshift(54);
    sortedIndexes = sortedIndexes.filter(number => ![15, 16, 17, 18, 19].includes(number));
    sortedIndexes.unshift(15);
    sortedIndexes = sortedIndexes.filter(number => ![37, 38, 39, 40, 41].includes(number));
    sortedIndexes.unshift(37);

    let officialGrid = "";
    let unofficialGrid = "";
    sortedIndexes.forEach(i => {
        let tagsHTML = ""
        for (let x=0; x < data[i].tags.length; x++) {
            tagsHTML += `<span class='tags' style='background-color:${data[i].tags[x][1]};'>${data[i].tags[x][0]}</span>`;
        }
        let title = data[i].title.includes(" - ") ? data[i].title.split(" - ")[0] : data[i].title; 
        let tile = `<a href="/r/${i}" class="grid-item">
            <div>
                <img width="100%" aspect-ratio:"16x8" src="https://img.youtube.com/vi/${data[i].id}/0.jpg"></img>
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
    })

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
        <title>ClockDB - Rubik's Clock Reconstructions</title>
        <link href="/css/style.css" rel="stylesheet" type="text/css"/>
        <link href="/css/home.css" rel="stylesheet" type="text/css"/>
        <link rel="icon" type="image/x-icon" href="/clock.ico">
    </head>
    <body>
        <div id="nav">
            <a href="/" id="home"><img src="/clock.ico" width="23" height="23"> ClockDB</a>
        </div>
        <br><br>
        <input type="text" id="search" placeholder="Search"></input><br>

        <label class="filter grayLabel">
            <input type="checkbox" id="officialBox">Official
        </label>
        <label class="filter grayLabel">
            <input type="checkbox" id="unofficialBox">Unofficial
        </label>
        <label class="filter grayLabel">
            <input type="checkbox" id="singleBox">Single
        </label>
        <label class="filter grayLabel">
            <input type="checkbox" id="averageBox">Average
        </label>
        <label class="filter flipLabel">
            <input type="checkbox" id="flipBox">Flip
        </label>
        <label class="filter simulLabel">
            <input type="checkbox" id="simulBox">7-Simul
        </label>
        <label class="filter sheerinLabel">
            <input type="checkbox" id="sheerinBox">Sheerin
        </label>
        <label class="filter wrLabel">
            <input type="checkbox" id="wrBox">WR
        </label>
        <label class="filter crLabel">
            <input type="checkbox" id="crBox">CR
        </label>
        <label class="filter nrLabel">
            <input type="checkbox" id="nrBox">NR
        </label>

        <br><br>
        <h2 id="official">Official Solves</h2>
        <div id="grid-container">${officialGrid}</div><br>
        <h2 id="unofficial">Unofficial Solves</h2>
        <div id="grid-container">${unofficialGrid}</div><br>
        <div id="badSearch" style="display: none">Sorry, but there aren't any reconstructions that match your search.</div>
        <br><br>
        
        <a href="/top-reconstructors/"><u>Thanks to everyone who has made a reconstruction!</u></a>
        <br><br><br><br>
        <footer>
            <a href="/contact/">Contact</a>
            <a href="/reconstruct/">Make Reconstruction</a>
            <a href="https://github.com/JoshM2/ClockDB" target="_blank">GitHub</a>
        </footer>
        <script src="/js/search.js"></script>
    </body>
    </html>`

    return new Response(html, {
        headers: {
            "content-type": "text/html;charset=UTF-8",
        },
    });
}   