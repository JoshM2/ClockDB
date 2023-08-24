import {reconstructionData} from '../../src/js/data.js'
export function onRequest(context) {
    const solve = context.params.solve
    const data = JSON.parse(JSON.stringify(reconstructionData));

    if (data[solve] === undefined){
        return new Response("There isn't a reconstruction here!", {
            status: 404,
            headers: {
                "content-type": "text/html;charset=UTF-8",
            },
        });
    }
    
    let tagsHTML = '';
    for (let i=0; i < data[solve].tags.length; i++) {
        tagsHTML += `<span class='tags' style='background-color:${data[solve].tags[i][1]};'>${data[solve].tags[i][0]}</span>`;
    }

    let averageTimesHTML = '';
    if (data[solve].average != undefined) {
        for(let i=0; i<data[solve].average.length; i++) {
            averageTimesHTML += `<div class="averageTimeBox s${data[solve].average[i][0]}">${data[solve].average[i][2]}</div>`
        }
        averageTimesHTML += "<br><br>"
    }

    let html = "";
    if (data[solve].id != undefined) {
        html = `<!DOCTYPE html>
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
            <title>${data[solve].name + " " + data[solve].title} - ClockDB</title>
            <link href="/css/style.css" rel="stylesheet" type="text/css"/>
            <link rel="icon" type="image/x-icon" href="/images/clock.ico">
        </head>
        <body>
            <div id="nav">
                <a href="/" id="home"><img src="/images/clock.ico" width="23" height="23"> ClockDB</a>
            </div>
            <h1 id="title"><a href="/persons/${data[solve].wcaid}">${data[solve].name}</a> ${data[solve].title}</h1>
            <div id="tags">${tagsHTML}</div>
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
                    <div class="pin ul"></div>
                    <div class="pin u"></div>
                    <div class="pin l"></div>
                    <div class="pin c"></div>
                </div>
                <div>
                    <div id="player"></div>
                    <button id="restart">restart</button>
                </div>
            </div>
            <br>
            <span id="time">0.00</span><br><br>
            <div id="averageTimes">${averageTimesHTML}</div>
            <div id="infoBox">
                <h2 id="scramble">Scramble: ${data[solve].scramble}</h2>
                <h2 id="solution">Solution: ${data[solve].inspection} ${data[solve].solution}</h2>
            </div>
            <br><br>
            <span id="date">${data[solve].date} at <a href="${data[solve].competitionLink}" target="_blank">${data[solve].competitionName}</a>. Reconstructed by <span id="author">${data[solve].author}</span>.</span>
            <br><br><br>    
            <footer>
                <a href="/contact/">Contact</a>
                <a href="/reconstruct/">Make Reconstruction</a>
                <a href="https://github.com/JoshM2/ClockDB" target="_blank">GitHub</a>
            </footer>
            <script type="module" src="/js/script.js"></script>
        </body>
        </html>`
    }
    else {
        html = `<!DOCTYPE html>
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
            <title>${data[solve].name + " " + data[solve].title} - ClockDB</title>
            <link href="/css/style.css" rel="stylesheet" type="text/css"/>
            <link rel="icon" type="image/x-icon" href="/images/clock.ico">
        </head>
        <body>
            <div id="nav">
                <a href="/" id="home"><img src="/images/clock.ico" width="23" height="23"> ClockDB</a>
            </div>
            <h1 id="title"><a href="/persons/${data[solve].wcaid}">${data[solve].name}</a> ${data[solve].title}</h1>
            <div id="tags">${tagsHTML}</div>
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
                    <div class="pin ul"></div>
                    <div class="pin u"></div>
                    <div class="pin l"></div>
                    <div class="pin c"></div>
                </div>
                <div>
                    <div id="textInfoBox">
                        <h2 id="scramble">Scramble: ${data[solve].scramble}</h2>
                        <h2 id="solution">Solution: ${data[solve].inspection} ${data[solve].solution}</h2>
                    </div>
                    <br><br>
                    <button id="textPlay" class="textReconControls">Play</button>
                    <button id="textReset" class="textReconControls">Reset</button>
                </div>
            </div>
            <br>
            <div id="averageTimes">${averageTimesHTML}</div>
            
            <br><br>
            <span id="date">${data[solve].date} at <a href="${data[solve].competitionLink}" target="_blank">${data[solve].competitionName}</a>. Submitted by <span id="author">${data[solve].author}</span>.</span>
            <br><br><br>    
            <footer>
                <a href="/contact/">Contact</a>
                <a href="/reconstruct/">Make Reconstruction</a>
                <a href="https://github.com/JoshM2/ClockDB" target="_blank">GitHub</a>
            </footer>
            <script type="module" src="/js/text-recon.js"></script>
        </body>
        </html>`
    }

    return new Response(html, {
        headers: {
            "content-type": "text/html;charset=UTF-8",
        },
    });
}   
