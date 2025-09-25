export async function onRequest(context) {
    const num = context.params.num;

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
        const ps = context.env.db.prepare('SELECT name,wcaid FROM users WHERE key=?').bind(key);
        let data = await ps.first();
        if (data == null) {
            return Response.redirect("https://clockdb.net/login", 303);
        }
        // get saved reconstruction
        const ps2 = context.env.db.prepare('SELECT * FROM saved WHERE num=?').bind(num);
        let data2 = await ps2.first();
        if (data2 == null) {
            return new Response("Reconstruction not found! Contact me if you think this is a bug.", {
                status: 404,
                headers: {
                    "content-type": "text/html;charset=UTF-8",
                },
            });
        }
        if (data2.authorId != data.wcaid) {
            return new Response(`Your WCA ID (${data.wcaid}) does not match the WCA ID of the person whose reconstruction you are attempting to access (${data2.authorId}). Please contact me if you think this is a bug.`, {
                status: 404,
                headers: {
                    "content-type": "text/html;charset=UTF-8",
                },
            });
        }



        const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <script defer src="https://analytics.clockdb.net/script.js" data-website-id="c808d079-4a5b-4e4b-8f11-faed3445ceb3"></script>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Reconstruction Tool - ClockDB</title>
            <link href="/css/style.css" rel="stylesheet" type="text/css"/>
            <link href="/css/reconstruction-tool.css" rel="stylesheet" type="text/css"/>
            <link rel="icon" type="image/x-icon" href="/images/clock.ico">
        </head>
        <body>
            <div id="video" style="display: block;">
                <div id="container">
                    <div id="clock">
                        <div class="bigCircle"></div>
                        <div class="circle ul"></div>
                        <div class="circle u"></div>
                        <div class="circle ur"></div>
                        <div class="circle l"></div>
                        <div class="circle c"></div>
                        <div class="circle r"></div>
                        <div class="circle dl"></div>
                        <div class="circle d"></div>
                        <div class="circle dr"></div>
                        <div class="dial ul"></div>
                        <div class="dial u center"></div>
                        <div class="dial ur"></div>
                        <div class="dial l center"></div>
                        <div class="dial c center"></div>
                        <div class="dial r center"></div>
                        <div class="dial dl"></div>
                        <div class="dial d center"></div>
                        <div class="dial dr"></div>
                        <div class="twelve ul"></div>
                        <div class="twelve u"></div>
                        <div class="twelve ur"></div>
                        <div class="twelve l"></div>
                        <div class="twelve c"></div>
                        <div class="twelve r"></div>
                        <div class="twelve dl"></div>
                        <div class="twelve d"></div>
                        <div class="twelve dr"></div>
                    </div>
                    <div>
                        <div id="player"></div>
                    </div>
                </div>
                <button onclick="skipFrames(-5)">Skip 5 Frames Backward</button>
                <button onclick="skipFrames(-1)">Skip 1 Frame Backward</button>
                <button onclick="skipFrames(1)">Skip 1 Frame Forward</button>
                <button onclick="skipFrames(5)">Skip 5 Frames Forward</button><br>
                <span id="time"></span><br>
                (if the video doesn't play restart and make sure you entered the link properly)
                <br><br><br>
            </div>
            <div id="step2" style="display: none;">
                 starting orientation:<br>
                which way is 12 facing?
                <select id="twelveFacing">
                    <option value=0>up</option>
                    <option value=2>down</option>
                    <option value=3>left</option>
                    <option value=1>right</option>
                </select><br>
                which side is facing you?
                <select id="sideFacing">
                    <option value=0>white</option>
                    <option value=1>black</option>
                </select><br>    
                <button onclick="submitOrientation()">enter</button>
                <br>
            </div>
            <div id="step3" style="display: none">
                <h3>Enter the position of the highlighted clock (1-12) - If this is after the flip, enter the position in the opposite direction (e.g. 4 becomes 8)</h3>
                <input type="text" id="position" oninput="restrictInput(this)">
                <button id="enterPosition">enter</button>
            </div>
            <div id="step5" style="display: none">
                <h1>click the clocks that are turning above</h1>
                enter the turn amount (if after the flip enter the negative amount, e.g. 4 becomes -4): <input type="text" id="turnAmount">
                <button id="enterTurns" onclick="go=false; submitTurns()">enter</button>
            </div>
            <div id="step6" style="display: none">
                enter flip type (x2, y2, x2z, x2z'): <input type="text" id="flipType">
                what side will be facing you after the flip? (0 = white, 1 = black): <input type="text" id="color">
                <button id="enterFlips" onclick="addFlip(); ">enter</button>
            </div>
            <div id="step4" style="display: block;">
                <button id="set" onclick='document.querySelector("#step2").style.display = "block"; document.querySelector("#step4").style.display = "none"; '>set the state</button>
                <button id="turn" onclick="addMove(); go=true;">add a turn</button>
                <button id="flip" onclick='document.querySelector("#step6").style.display = "block";document.querySelector("#step4").style.display = "none"'>add a flip</button>
                <button id="delete" onclick="recon.pop();document.querySelector('#table').deleteRow(recon.length+1);alert('last move deleted')">delete the last move</button>
                <br><br>
                enter the starting and ending times of each move
                <table id="table">
                    <tr>
                    <th>Action</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    </tr>
                </table> 
                <br><br><br>
                Do not refresh the page! Your progress will NOT be saved.
                <br>
                <!-- <br><button onclick="copyToClipboard()">Click here to copy</button><span id="recon"></span>  -->
                Once you have completed the reconstruction, fill out the following information and submit. If you want to make any edits just resubmit the form. The most recent one will be used.<br>
                Solver's name:<br>
                <input type="text" id="solverName" placeholder="name" value="${data2.name}"><br>
                Solve time:<br>
                <input type="number" id="solveTime" placeholder="time" value="${data2.time}"><br>
                
                <input type="radio" id="method7s" name="methodRadio" value="7s" ${data2.method=="7s" ? "checked" : ""}>
                <label for="method7s">7-Simul</label>
                <input type="radio" id="methodFlip" name="methodRadio" value="flip" ${data2.method=="flip" ? "checked" : ""}>
                <label for="methodFlip">Flip</label>
                <input type="radio" id="method7sf" name="methodRadio" value="7sf" ${data2.method=="7sf" ? "checked" : ""}>
                <label for="method7sf">7sfndmw4lm</label><br>
        
                Solver's WCA ID:<br>
                <input type="text" id="solverWCAID" placeholder="WCA ID" value="${data2.wcaid}"><br>
                Scramble:<br>
                <input type="text" id="solveScramble" placeholder="scramble" value="${data2.scramble}"><br>
                Exact timestamp that hands are lifted off of timer (make sure it is in seconds! i.e. enter 70.33 not 1:10.33)<br>
                <input type="number" id="timerStart" placeholder="start time" value="${data2.startTimestamp}"><br>
                Date of solve:<br>
                <input type="date" id="solveDate" placeholder="date" value="${data2.date}"><br>
        
                <input type="radio" id="official" name="officialRadio" value="official" onclick='document.querySelector("#officialDiv").style.display = "block"' ${data2.official=="Official" ? "checked" : ""}>
                <label for="official">Official</label><br>
                <input type="radio" id="unofficial" name="officialRadio" value="unofficial" onclick='document.querySelector("#officialDiv").style.display = "none"' ${data2.official=="Official" ? "" : "checked"}>
                <label for="unofficial">Unofficial</label><br>
                <div id="officialDiv" style="display: ${data2.official=="Official" ? "block" : "none"};">
                    Competition name: <input type="text" id="compName" value="${data2.competitionName}"/><br>
                    Link to competition page: <input type="text" id="compLink" value="${data2.competitionLink}"/><br>
                </div>
                
                <button id="submitRecon" onclick="submitRecon()">Click here to submit the reconstruction!</button><br>
                <span id="submitStatus"></span>
                <button id="submitRecon" onclick="saveRecon()">save reconstruction progress</button><br>
                <span id="saveStatus"></span>
                <br><br>
                <span id="recon"></span>
                <br><br>
            </div>
            <script>
                window.vidId = "${data2.id}";
                window.reconData = ${data2.recon};
                let recon=${data2.recon};
                let table = document.querySelector('#table');
                table.innerHTML = '<tr><th>Action</th><th>Start Time</th><th>End Time</th></tr>'; // empty table
                for (let i = 0; i<recon.length; i++) {
                    if (recon[i][1]=="set") {
                        let r = document.createElement('tr');
                        r.innerHTML = "<td>set</td><td><input type='text' oninput='recon["+i+"][0]=parseFloat(this.value)' value='"+recon[i][0]+"'></td><td>N/A</td>";
                        table.appendChild(r); 
                    }
                    else if (recon[i][2]=="flip") {
                        let r = document.createElement('tr');
                        r.innerHTML = "<td>flip</td><td><input type='text' oninput='recon["+i+"][0]=parseFloat(this.value)' value='"+recon[i][0]+"'></td><td><input type='text' oninput='recon["+i+"][1]=parseFloat(this.value)' value='"+recon[i][1]+"'></td>";
                        table.appendChild(r);
                    }
                    else {
                        let r = document.createElement('tr');
                        r.innerHTML = "<td>move</td><td><input type='text' oninput='recon["+i+"][0]=parseFloat(this.value)' value='"+recon[i][0]+"'></td><td><input type='text' oninput='recon["+i+"][1]=parseFloat(this.value)' value='"+recon[i][1]+"'></td>";
                        table.appendChild(r);
                    }
                }
            </script>
            <script src="/js/reconstruction-tool.js"></script>
            <script src="/js/reconstruction-tool-saved.js"></script>
        </body>
        </html>`

        return new Response(html, {
            headers: {
                "content-type": "text/html;charset=UTF-8",
            },
        });
    }
}