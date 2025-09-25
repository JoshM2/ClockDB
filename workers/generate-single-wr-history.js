function convertDate(month, day, year) {
  const date = new Date(year, month, day); // Month is 0-indexed
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}
export default {
  async scheduled(controller, env, ctx) {
    const response = await await fetch("https://www.worldcubeassociation.org/results/records?event_id=clock&show=history", {
      "headers": {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0",
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.5",
        "Sec-GPC": "1",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
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



    let rankingsTable = "<table><tr><th>Date</th><th>Name</th><th>Time</th><th>Reconstruction</th>"
    function addToTable(date,name,time,link) {
      let row = "<tr>"
      row += "<td>" + date + "</td>"
      row += "<td>" + name + "</td>"
      row += "<td>" + time + "</td>"
      row += "<td>" + link + "</td>"
      row += "</tr>"
      rankingsTable += row
    }

    let found_counter = 0
    let counter = 0
    single_rankings['rows'].forEach(result => {
      if (result.type=="single") {
        const convertedDate = convertDate(result.month,result.day,result.year);
        let found = false;
        counter+=1;
        data.forEach(recon => {
          // right person
          if (recon['wcaid'] == result['person_id'] && found==false) {
            // right time
            if (JSON.parse(recon['solveStart'])[1] == (result.value/100).toFixed(2)) {
              addToTable(convertedDate,result.person_name,(result.value/100).toFixed(2),`<a href="https://clockdb.net/r/${recon.num}">https://clockdb.net/r/${recon.num}</a>`)
              found=true;
              found_counter += 1;
            }
          }
        })
        if (found == false) {
          addToTable(convertedDate,result.person_name,(result.value/100).toFixed(2),"none")
        }
      }  
    })
    rankingsTable = `<h4>updated daily. ${found_counter}/${counter} reconstructed</h3>`+ rankingsTable
    rankingsTable += "</table>";

    await env.KV.put("wr-history-single",rankingsTable)
    return new Response ('updated');
  }
}