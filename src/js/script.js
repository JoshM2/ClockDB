import {reconstructionData} from './data.js'
const data = JSON.parse(JSON.stringify(reconstructionData));
const solve = window.location.href.split("/")[4]
const recon = data[solve].recon
const reconLength = recon.length;

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
        videoId: data[solve].id,
        playerVars: {
            'playsinline': 1,
            'modestbranding': 1,
            'rel': 0,
            'start': data[solve].startTime,
            'end': data[solve].endTime || 1000000,
        },
        events: {
            'onReady': animate,
        }
    });
}


// Makes variables for all the DOM queries
const clockElement = document.querySelector("#clock");
const bigCircleAndDialElements = document.querySelectorAll(".bigCircle, .dial");
const circleElements = document.querySelectorAll(".circle");
const pinULElement = document.querySelector(".pin.ul");
const pinUElement = document.querySelector(".pin.u");
const pinLElement = document.querySelector(".pin.l");
const pinCElement = document.querySelector(".pin.c");
const dialElements = document.querySelectorAll(".dial");
const timeElement = document.querySelector("#time");

let state = [0,0,0,0,0,0,0,0,0,0,0]
let pinColors = ['','','','']
let turnDegrees;
let flipDegrees;
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
            bigCircleAndDialElements.forEach(element => element.style.backgroundColor = (state[9] === 0 ? "white" : "black"));
            circleElements.forEach(element => element.style.backgroundColor = (state[9] === 0 ? "black" : "white "));
            // sets the pins
            pinColors[0] = recon[i][3][0] === 1 ? "yellow" : "gray";
            pinColors[1] = recon[i][3][1] === 1 ? "yellow" : "gray";
            pinColors[2] = recon[i][3][2] === 1 ? "yellow" : "gray";
            pinColors[3] = recon[i][3][3] === 1 ? "yellow" : "gray";

        }
        // flips
        else if (recon[i][2] === "flip" && timeStamp >= recon[i][0]) {
            flipDegrees = ((timeStamp-recon[i][0])/(recon[i][1]-recon[i][0]) > 1 ? 1 : (timeStamp-recon[i][0])/(recon[i][1]-recon[i][0])) * 180;
            if(recon[i][3]==="x2"){
                clockElement.style.transform = "";
                clockElement.style.transform = " rotateX("+(-flipDegrees)+"deg) rotate("+state[10]*90+"deg)";
            }
            else if(recon[i][3]==="y2"){
                clockElement.style.transform = "";
                clockElement.style.transform = " rotateY("+flipDegrees+"deg) rotate("+state[10]*90+"deg)";
            }
            else if(recon[i][3]==="x2z"){
                clockElement.style.transform = "";
                clockElement.style.transform = `rotateX(${flipDegrees}deg) rotate(${state[10]*90+(flipDegrees/(flipDegrees > 90 ? -2 : 2))}deg)`

            }
            else if(recon[i][3]==="x2z'"){
                clockElement.style.transform = "";
                clockElement.style.transform = `rotateX(${flipDegrees}deg) rotate(${state[10]*90+(flipDegrees/(flipDegrees > 90 ? 2 : -2))}deg)`

            }            
            if (flipDegrees>90){
                state[9] = recon[i][4][9];
                bigCircleAndDialElements.forEach(element => element.style.backgroundColor = (state[9] === 0 ? "white" : "black"));
                circleElements.forEach(element => element.style.backgroundColor = (state[9] === 0 ? "black" : "white "));
                for (let dial=0; dial<9; dial++){
                    state[dial] = recon[i][4][dial]
                }
            }
            if (window.innerWidth < 430) {
                clockElement.style.transform += " scale(0.7) translate(-50px,0px)"
            }
        }
        // moves that turn the dials
        else if (timeStamp > recon[i][0]) {
            // sets the pins
            if (recon[i][2].includes(4)) {
                pinColors[0] = recon[i][2].includes(0) ? "yellow" : "gray";
                pinColors[1] = recon[i][2].includes(2) ? "yellow" : "gray";
                pinColors[2] = recon[i][2].includes(6) ? "yellow" : "gray";
                pinColors[3] = recon[i][2].includes(8) ? "yellow" : "gray";
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

    timeElement.innerHTML = Math.min(data[solve]['solveStart'][1],Math.max(0,timeStamp-data[solve]['solveStart'][0])).toFixed(2);
    
    window.requestAnimationFrame(animate);
};


document.querySelector("#restart").addEventListener("click", function(){
    player.seekTo(data[solve].startTime, true);
})