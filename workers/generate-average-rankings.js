export default {
  async scheduled(controller, env, ctx) {
    const response = await fetch("https://www.worldcubeassociation.org/results/rankings/clock/average?", {
        "headers": {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0",
            "Accept": "application/json",
            "Accept-Language": "en-US,en;q=0.5",
            "Sec-GPC": "1",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Site": "same-origin",
            "Priority": "u=4",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache"
        },
        "method": "GET",
    });
    const single_rankings = await response.json();

    const ps = env.DB.prepare('SELECT * FROM reconstructions')
    const data = (await ps.all())['results'];



    let rankingsTable = "<table><tr><th>Rank</th><th>Name</th><th>Time</th><th>Reconstruction</th>"
    function addToTable(rank,name,time,link) {
      let row = "<tr>"
      row += "<td>" + rank + "</td>"
      row += "<td>" + name + "</td>"
      row += "<td>" + time + "</td>"
      row += "<td>" + link + "</td>"
      row += "</tr>"
      rankingsTable += row
    }

    let rank = 0
    let lastTime = 0
    let solveNum = 0
    let found_counter = 0
    let counter = 0
    single_rankings['rows'].forEach(result => {
      // figures out what the rank is
      solveNum += 1;
      if (result.average != lastTime) {
        rank = solveNum;
      }
      lastTime = result.average;
      // top 100 result
      if (rank <= 100) {
        let found = false;
        counter += 1
        data.forEach(recon => {
          // right person
          if (recon['wcaid'] == result['person_id'] && found==false) {
            // right time
            if (recon["title"].includes("Average") && recon['title'].split(" ")[0] == ""+(result['average']/100).toFixed(2)) {
              // console.log(result['best'],recon['num'])
              let firstSolveNum = JSON.parse(recon.average)[0][0]
              addToTable(rank,result.person_name,(result.average/100).toFixed(2),`<a href="https://clockdb.net/r/${firstSolveNum}">https://clockdb.net/r/${firstSolveNum}</a>`)
              found=true;
              found_counter += 1;
            }
          }
        })
        if (found == false) {
          addToTable(rank,result.person_name,(result.average/100).toFixed(2),"none")
        }
      }     
    })
    rankingsTable = `<h4>updated daily. ${found_counter}/${counter} reconstructed</h3>`+ rankingsTable
    rankingsTable += "</table>";

    await env.KV.put("rankings-average",rankingsTable)
    return new Response ('updated');
  }
};