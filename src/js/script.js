let solve = window.location.href.split("/")[4];
let solveData = window.data.find(item => item.num == solve)
let recon = JSON.parse(solveData.recon);
let reconLength = recon.length;

// red
// ["#ffdddd","#ff3549","#ffdddd","#ff3549","#ff3549","#ffdddd","#ff3549","#ffdddd","yellow","gray"]

//lilac
// ["#f0f291","#b831f2","##f0f291","red","#b831f2","#f0f291","#b831f2","red","#00ffff","gray"]

// blue
// ["white","#014ea8","white","red","#014ea8","white","#014ea8","red","yellow","gray"]

// cole shaft /r/1395 lilac blue combo
// ["#f0f291","#014ea8","white","red","#b831f2","white","#014ea8","red","#00ffff","gray"]

// reed /r/1396 red blue combo
// ["#ffdddd","#014ea8","white","#ff3549","#ff3549","white","014ea8","#ffdddd","yellow","gray"]


// gets colors of all the elements
let [face1,clocks1,hands1,twelve1,face2,clocks2,hands2,twelve2,pinsUp,pinsDown] = ["white","black","white","red","black","white","black","red","yellow","gray"]
if (solveData.authorId) {
    [face1,clocks1,hands1,twelve1,face2,clocks2,hands2,twelve2,pinsUp,pinsDown] = JSON.parse(solveData.authorId);
}


// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an <iframe> (and YouTube player) after the API code downloads.
var player;
window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
        width: 640,
        videoId: solveData.id,
        playerVars: {
            'playsinline': 1,
            'modestbranding': 1,
            'rel': 0,
            'origin': "https://clockdb.net",
            'start': solveData.startTime,
            'end': solveData.endTime || 1000000,
        },
        events: {
            'onReady': animate,
        }
    });
}


// Makes variables for all the DOM queries
const clockElement = document.querySelector("#clock");
// const bigCircleAndDialElements = document.querySelectorAll(".bigCircle, .dial");
const bigCircleElement = document.querySelector(".bigCircle");
const circleElements = document.querySelectorAll(".circle");
const pinULElement = document.querySelector(".pin.ul");
const pinUElement = document.querySelector(".pin.u");
const pinLElement = document.querySelector(".pin.l");
const pinCElement = document.querySelector(".pin.c");
const dialElements = document.querySelectorAll(".dial");
const twelveElements = document.querySelectorAll(".twelve");
const timeElement = document.querySelector("#time");
const averageTimeBoxElements = document.querySelectorAll(".averageTimeBox")



let state = [0,0,0,0,0,0,0,0,0,0,0];
let pinColors = ['','','',''];
let turnDegrees;
let flipDegrees;
let solveOfAverage = solve;
function animate() {
    let timeStamp;
    try{
        timeStamp = player.getCurrentTime();
    } catch(error) {return;}

    // loop through each move
    for (let i=0; i<reconLength; i++){

        // moves that set the clock to a specific state
        if (recon[i][1] === "set" && timeStamp >= recon[i][0]) {
            // sets the dials
            for (let dial=0; dial<9; dial++){
                state[dial] = recon[i][2][dial]
            }
            // sets the orientation
            state[9] = recon[i][2][9];
            state[10] = recon[i][2][10];
            clockElement.style.transform = "";
            clockElement.style.transform = "rotate("+state[10]*90+"deg)";
            if (window.innerWidth < 430) {
                clockElement.style.transform += " scale(0.7) translate(-50px,0px)"
            }
            bigCircleElement.style.backgroundColor = (state[9] === 0 ? face1 : face2);
            dialElements.forEach(element => element.style.backgroundColor = (state[9] === 0 ? hands1 : hands2));
            circleElements.forEach(element => element.style.backgroundColor = (state[9] === 0 ? clocks1 : clocks2));
            twelveElements.forEach(element => element.style.backgroundColor = (state[9] === 0 ? twelve1 : twelve2));
            // sets the pins
            pinColors[0] = recon[i][3][0] === 1 ? pinsUp: pinsDown;
            pinColors[1] = recon[i][3][1] === 1 ? pinsUp: pinsDown;
            pinColors[2] = recon[i][3][2] === 1 ? pinsUp: pinsDown;
            pinColors[3] = recon[i][3][3] === 1 ? pinsUp: pinsDown;
        }
        // flips
        else if (recon[i][2] === "flip" && timeStamp >= recon[i][0]) {
            flipDegrees = ((timeStamp-recon[i][0])/(recon[i][1]-recon[i][0]) > 1 ? 1 : (timeStamp-recon[i][0])/(recon[i][1]-recon[i][0])) * 180;
            if(recon[i][3]==="x2"){
                // clockElement.style.transform = "";

                clockElement.style.transform = " rotateX("+(-flipDegrees)+"deg) " + clockElement.style.transform;
                state[10] = [2,1,0,3][state[10]];
            }
            else if(recon[i][3]==="y2"){
                // clockElement.style.transform = "";
                clockElement.style.transform = "rotateY("+flipDegrees+"deg) " + clockElement.style.transform;
                state[10] = [0,3,2,1][state[10]];
            }
            else if(recon[i][3]==="x2z"){
                // clockElement.style.transform = "";
                clockElement.style.transform = `rotateX(${flipDegrees}deg) rotate(${(flipDegrees/(flipDegrees > 90 ? -2 : 2))}deg) ` + clockElement.style.transform;
                state[10] = [3,2,1,0][state[10]];
            }
            else if(recon[i][3]==="x2z'"){
                // clockElement.style.transform = "";
                clockElement.style.transform = ` rotateX(${flipDegrees}deg) rotate(${(flipDegrees/(flipDegrees > 90 ? 2 : -2))}deg) ` + clockElement.style.transform;
                state[10] = [1,0,3,2][state[10]];
            }      
            else if(recon[i][3]==="z"){
                // clockElement.style.transform = "";
                clockElement.style.transform = `rotate(${(flipDegrees/2)}deg) ` + clockElement.style.transform;
                state[10] = [1,2,3,0][state[10]];
            }
            else if(recon[i][3]==="z'"){
                clockElement.style.transform = "";
                clockElement.style.transform = `rotate(${(flipDegrees/-2)}deg) ` + clockElement.style.transform
                state[10] = [3,0,1,2][state[10]];
            }          
            if (flipDegrees>90 && recon[i][3]!="z" && recon[i][3]!="z'") {
                state[9] = recon[i][4][9];
                bigCircleElement.style.backgroundColor = (state[9] === 0 ? face1 : face2);
                dialElements.forEach(element => element.style.backgroundColor = (state[9] === 0 ? hands1 : hands2));
                circleElements.forEach(element => element.style.backgroundColor = (state[9] === 0 ? clocks1 : clocks2));
                twelveElements.forEach(element => element.style.backgroundColor = (state[9] === 0 ? twelve1 : twelve2));

                for (let dial=0; dial<9; dial++){
                    state[dial] = recon[i][4][dial]
                }
                // makes up pins down and vice versa
                pinColors[0] = pinColors[0] == pinsDown ? pinsUp: pinsDown;
                pinColors[1] = pinColors[1] == pinsDown ? pinsUp: pinsDown;
                pinColors[2] = pinColors[2] == pinsDown ? pinsUp: pinsDown;
                pinColors[3] = pinColors[3] == pinsDown ? pinsUp: pinsDown;
            }
        }
        // moves that turn the dials
        else if (timeStamp > recon[i][0]) {
            // sets the pins
            if (recon[i][2].includes(4)) {
                pinColors[0] = recon[i][2].includes(0) ? pinsUp: pinsDown;
                pinColors[1] = recon[i][2].includes(2) ? pinsUp: pinsDown;
                pinColors[2] = recon[i][2].includes(6) ? pinsUp: pinsDown;
                pinColors[3] = recon[i][2].includes(8) ? pinsUp: pinsDown;
            }
            else {
                pinColors[0] = recon[i][2].includes(0) ? pinsDown: pinsUp; 
                pinColors[1] = recon[i][2].includes(2) ? pinsDown: pinsUp; 
                pinColors[2] = recon[i][2].includes(6) ? pinsDown: pinsUp; 
                pinColors[3] = recon[i][2].includes(8) ? pinsDown: pinsUp;
            }
            turnDegrees = ((timeStamp-recon[i][0])/(recon[i][1]-recon[i][0]) > 1 ? 1 : (timeStamp-recon[i][0])/(recon[i][1]-recon[i][0])) * recon[i][3];
            for (let dial of recon[i][2]){
                state[dial] += turnDegrees
            }
        }
    } 
    // sets the state of the dials and pins
    for (let dial=0; dial<9; dial++){
        dialElements[dial].style.transform = "translate(50px, 2px) rotate("+(state[dial]*30)+"deg)";
    }
    pinULElement.style.backgroundColor = pinColors[0];
    pinUElement.style.backgroundColor = pinColors[1];
    pinLElement.style.backgroundColor = pinColors[2];
    pinCElement.style.backgroundColor = pinColors[3];

    // updates the solve if in an average and the video is on a new solve
    if (solveData.average !== null) {
        // figures out what solve the video is on
        let a = JSON.parse(solveData.average);
        for (let i = 0; i < a.length; i++) {
            if (timeStamp >= a[i][2]) {
                if (i === a.length - 1 || timeStamp < a[i + 1][2]) {
                    solveOfAverage = a[i][0];
                    // console.log(solveOfAverage);
                }
            }
        }
        if (solveOfAverage != solve) {
            solve = solveOfAverage;
            solveData = window.data.find(item => item.num == solve)
            for (let s = 0; s < averageTimeBoxElements.length; s++) {
                averageTimeBoxElements[s].classList.remove("selectedTime");
            }
            document.querySelector(`.s${solve}`).classList.add('selectedTime');
            document.querySelector("#title").innerHTML = `<a href="/persons/${solveData.wcaid}">${solveData.name}</a> ${solveData.title}`;
            document.querySelector("#author").innerHTML = solveData.author;
            document.title = solveData.name + " " + solveData.title + " - ClockDB";
            document.querySelector("#scramble").innerHTML = "Scramble: " + solveData.scramble;
            document.querySelector("#solution").innerHTML = `Solution: ${solveData.inspection} ${solveData.solution}`;
            let parsedTags = JSON.parse(solveData.tags)
            let tagsHTML = '';
            for (let i=0; i<parsedTags.length; i++) {
                tagsHTML += `<span class='tags' style='background-color:${parsedTags[i][1]};'>${parsedTags[i][0]}</span> `;
            }
            document.querySelector("#tags").innerHTML = tagsHTML;
            window.history.replaceState({ path: "/r/"+solve }, "", "/r/"+solve);
            recon = JSON.parse(solveData.recon);
            reconLength = recon.length;
        }
    }

    timeElement.innerHTML = Math.min(JSON.parse(solveData.solveStart)[1],Math.max(0,timeStamp-JSON.parse(solveData.solveStart)[0])).toFixed(2);
    
    window.requestAnimationFrame(animate);
};

if (solveData.average !== null) {
    document.querySelector(`.s${solve}`).classList.add('selectedTime');
    for (let s = 0; s < averageTimeBoxElements.length; s++) {
        averageTimeBoxElements[s].addEventListener("click", function(){
            player.seekTo(window.data.find(item => item.num == JSON.parse(solveData.average)[s][0]).startTime, true); // NEEDS FIXING
        })        
    }
}

document.querySelector("#restart").addEventListener("click", function(){
    player.seekTo(solveData.startTime, true);
})

// make it so that hitting space will always pause/unpause the yt video instead of sometimes triggering the restart button if that is the last thing that you clicked.
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        event.preventDefault();
        if (player) {
            const playerState = player.getPlayerState();
            if (playerState === YT.PlayerState.PLAYING) {
                player.pauseVideo();
            } else {
                player.playVideo();
            }
        }
    }
});
