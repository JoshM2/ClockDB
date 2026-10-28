export default {
  async scheduled(controller, env, ctx) {
    // only the columns the home page and /top-reconstructors actually use.
    // notably this leaves out recon/solution/inspection/scramble, which are
    // multi-KB per row and were being pulled on every single page load.
    const ps = env.DB.prepare('SELECT num, name, title, id, tags, solveStart, average, competitionName, author FROM reconstructions')
    const data = (await ps.all())['results'];


    // ---------- home page grids ----------

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


    // ---------- top reconstructors ----------

    let r = {};
    for (let i = 0; i < data.length; i++) {
        if (data[i].id == undefined) {

        }
        else if (data[i].author in r) {
            r[data[i].author].push(i);
        }
        else {
            r[data[i].author] = [i];
        }
    }

    const entries = Object.entries(r);
    entries.sort((a, b) => b[1].length - a[1].length);
    const sortedDictionary = Object.fromEntries(entries);

    let reconstructorHTML = "";
    const keys = Object.keys(sortedDictionary);
    for (let i = 0; i < keys.length; i++) {
        reconstructorHTML += `<div>${keys[i]} - ${sortedDictionary[keys[i]].length}</div>`;
    }


    // ---------- write ----------

    // never overwrite good data with nothing. throwing leaves the previous
    // values in KV and surfaces the failure in the worker logs.
    if (!data.length || (!officialGrid && !unofficialGrid)) {
        throw new Error(`refusing to write empty grids (rows=${data.length})`);
    }

    const generated = new Date().toISOString();
    await env.KV.put("home-grids", JSON.stringify({ official: officialGrid, unofficial: unofficialGrid, generated }));
    await env.KV.put("top-reconstructors", JSON.stringify({ html: reconstructorHTML, generated }));

    console.log(`generated ${generated}: ${data.length} rows, ${officialGrid.length + unofficialGrid.length} bytes of grid, ${keys.length} reconstructors`);
  }
};
