export async function onRequest(context) {
    const ps = context.env.db.prepare('SELECT * from reconstructions')
    let data = await ps.all();
    data = data["results"]

    const timeValues = data.map((jsonObj, index) => ({
        index,
        solveStart: JSON.parse(jsonObj.solveStart)[1],
        title: jsonObj.title
    }));
    // sort the singles so that DNFs are at the bottom
    let sortedIndexes = timeValues.sort((a, b) => 
        a.title.includes("DNF") - b.title.includes("DNF") || a.solveStart - b.solveStart
    ).map(obj => obj.index);


    let averageIds = new Set()
    for (let i=0; i<data.length; i++) {
        if (data[i].average && (data[i].title.includes("Average") || data[i].title.includes("Ao12"))) {
            sortedIndexes.splice(sortedIndexes.indexOf(i), 1);
            if (data[i].num == JSON.parse(data[i].average)[0][0]) {
                averageIds.add(i)
            }
        }
    }
    let filteredDicts = Array.from(averageIds).map(i => data[i]);
    // sorts the averages so that the averages that are DNF go to the bottom
    filteredDicts.sort((dict1, dict2) => {
        const num1 = parseFloat(dict1.title.split()[0]);
        const num2 = parseFloat(dict2.title.split()[0]);
        if (isNaN(num1) && isNaN(num2)) {
            return 0; // Both are NaN, keep their order
        } else if (isNaN(num1) && !isNaN(num2)) {
            return -1; // num1 is NaN, sort it lower
        } else if (!isNaN(num1) && isNaN(num2)) {
            return 1; // num2 is NaN, sort it lower
        } else {
            return num2 - num1; //Both are valid numbers, sort in descending order
        }
    });    let sortedAverageIds = filteredDicts.map(dict => data.indexOf(dict));
    for (let item of sortedAverageIds) {
        sortedIndexes.unshift(item);
    }

    let officialGrid = "";
    let unofficialGrid = "";
    sortedIndexes.forEach(i => {
        let tagsHTML = ""
        data[i].tags = JSON.parse(data[i].tags)
        for (let x=0; x < data[i].tags.length; x++) {
            tagsHTML += `<span class='tags' style='background-color:${data[i].tags[x][1]};'>${data[i].tags[x][0]}</span> `;
        }
        // excludes text recons
        if (data[i].id) {
            let title = data[i].title.includes(" - ") ? data[i].title.split(" - ")[0] : data[i].title; 
            let tile = `<a href="/r/${data[i].num}" class="grid-item grid-item-card">
                <div>
                    <img style="width: 100%; height: auto;" width="320" height="180" loading="lazy" alt="" src="${data[i].id ? 'https://img.youtube.com/vi/'+data[i].id+'/mqdefault.jpg' : '/images/thumbnails/'+i+'.png'}"></img>
                </div>
                <h2 class="solveTitle">${data[i].name + " " + title}</h2>
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
        <meta name="description" content="Explore ClockDB.net, featuring over 1,500 reconstructions of top Rubik's Clock solves. Experience each solve from the solver's perspective with animations perfectly synchronized with the solve's video!">
        <title>ClockDB - Rubik's Clock Reconstructions</title>
        <link href="/css/style.css" rel="stylesheet" type="text/css"/>
        <link href="/css/home.css" rel="stylesheet" type="text/css"/>
        <link rel="icon" type="image/x-icon" href="/images/clock.ico">
    </head>
    <body>
        <div id="nav">
            <a href="/" id="home"><img src="/images/clock.ico" width="23" height="23"> ClockDB</a>
        </div>
        <a href="/lists">reconstruction lists</a>
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
        <label class="filter sfLabel">
            <input type="checkbox" id="sfBox">7sfndmw4lm
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
